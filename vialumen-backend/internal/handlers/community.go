package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/MDialis/vialumen-backend/internal/types"
)

func (h *Handler) CreateCommunityPost(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("user_id").(string)
	if !ok || userID == "" {
		http.Error(w, "Unauthorized: User ID not found in context", http.StatusUnauthorized)
		return
	}

	var req types.CreateCommunityPostRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if req.Title == "" || req.ContentText == "" || req.SubthemeID == 0 {
		http.Error(w, "Title, content, and subtheme_id are required", http.StatusBadRequest)
		return
	}

	tx, err := h.DB.Begin()
	if err != nil {
		http.Error(w, "Failed to start transaction", http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()

	var postID int
	err = tx.QueryRow(`
		INSERT INTO community_posts (subtheme_id, user_id, title, content_text, status)
		VALUES ($1, $2, $3, $4, 'published')
		RETURNING id`,
		req.SubthemeID, userID, req.Title, req.ContentText,
	).Scan(&postID)

	if err != nil {
		log.Printf("Error creating community post: %v", err)
		http.Error(w, "Failed to create post", http.StatusInternalServerError)
		return
	}

	for _, c := range req.Contributors {
		_, err = tx.Exec(`
			INSERT INTO contributors (community_post_id, user_id, external_name, contribution_role)
			VALUES ($1, $2, $3, $4)`,
			postID, c.UserID, c.ExternalName, c.Role,
		)
		if err != nil {
			log.Printf("Error inserting post contributor: %v", err)
			http.Error(w, "Failed to insert contributors", http.StatusInternalServerError)
			return
		}
	}

	for _, s := range req.Sources {
		_, err = tx.Exec(`
			INSERT INTO sources (community_post_id, title, url, source_type)
			VALUES ($1, $2, $3, $4)`,
			postID, s.Title, s.URL, s.SourceType,
		)
		if err != nil {
			log.Printf("Error inserting post source: %v", err)
			http.Error(w, "Failed to insert sources", http.StatusInternalServerError)
			return
		}
	}

	if err = tx.Commit(); err != nil {
		log.Printf("Error committing transaction: %v", err)
		http.Error(w, "Failed to save data", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Post created successfully",
		"post_id": postID,
	})
}

func (h *Handler) GetCommunityPosts(w http.ResponseWriter, r *http.Request) {
	subthemeID := r.URL.Query().Get("subtheme_id")

	query := `
		SELECT cp.id, cp.subtheme_id, cp.user_id, cp.title, cp.content_text, cp.created_at, u.name
		FROM community_posts cp
		LEFT JOIN "users" u ON cp.user_id = u.id
		WHERE cp.status = 'published'
		AND ($1::text = '' OR cp.subtheme_id = $1::int)
		ORDER BY cp.created_at DESC
		LIMIT 50
	`

	rows, err := h.DB.Query(query, subthemeID)
	if err != nil {
		log.Printf("Error fetching posts: %v", err)
		http.Error(w, "Failed to fetch posts", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var posts []types.CommunityPostFeedResponse
	for rows.Next() {
		var p types.CommunityPostFeedResponse
		var authorName *string

		if err := rows.Scan(&p.ID, &p.SubthemeID, &p.UserID, &p.Title, &p.ContentText, &p.CreatedAt, &authorName); err != nil {
			log.Printf("Error scanning post: %v", err)
			continue
		}

		if authorName != nil {
			p.AuthorName = *authorName
		} else {
			p.AuthorName = "[Deleted User]"
		}

		posts = append(posts, p)
	}

	if posts == nil {
		posts = []types.CommunityPostFeedResponse{}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(posts)
}
