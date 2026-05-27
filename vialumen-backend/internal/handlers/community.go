package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/MDialis/vialumen-backend/internal/types"
)

// ----- GET Functions -----
func (h *Handler) GetCommunityPosts(w http.ResponseWriter, r *http.Request) {
	userID, _ := r.Context().Value("user_id").(string)
	feedType := r.URL.Query().Get("feed")

	subthemeID := r.URL.Query().Get("subtheme_id")
	slug := r.URL.Query().Get("slug")

	var query string
	var args []interface{}

	if slug != "" || subthemeID != "" {
		// --- CONTEXTUAL FEED ---
		query = `
			SELECT cp.id, cp.subtheme_id, s.title, s.slug, cp.user_id, u.username, cp.title, cp.content_text, cp.created_at, u.name,
			COALESCE(SUM(v.vote_value), 0) AS net_votes
			FROM community_posts cp
			JOIN subthemes s ON cp.subtheme_id = s.id 
			LEFT JOIN "users" u ON cp.user_id = u.id
			LEFT JOIN community_post_votes v ON cp.id = v.post_id
			WHERE cp.status = 'published' 
			AND ($1::text = '' OR s.slug = $1)
			AND ($2::text = '' OR cp.subtheme_id = $2::int)
			GROUP BY cp.id, s.title, s.slug, u.username, u.name
			ORDER BY net_votes DESC, cp.created_at DESC
			LIMIT 15`
		args = append(args, slug, subthemeID)

	} else if feedType == "home" && userID != "" {
		// --- THE WEIGHTED DISCOVERY FEED (HOME) ---
		query = `
			SELECT cp.id, cp.subtheme_id, s.title, s.slug, cp.user_id, u.username, cp.title, cp.content_text, cp.created_at, u.name,
			COALESCE(SUM(v.vote_value), 0) AS net_votes,
			(
				(COALESCE(SUM(v.vote_value), 0) * 2.0) 
				+ CASE WHEN us.user_id IS NOT NULL THEN 50.0 ELSE 0.0 END 
			) / POWER(EXTRACT(EPOCH FROM (NOW() - cp.created_at))/3600 + 2, 1.5) AS dynamic_score
			FROM community_posts cp
			JOIN subthemes s ON cp.subtheme_id = s.id 
			LEFT JOIN "users" u ON cp.user_id = u.id
			LEFT JOIN community_post_votes v ON cp.id = v.post_id
			LEFT JOIN user_subscriptions us ON cp.subtheme_id = us.subtheme_id AND us.user_id = $1
			WHERE cp.status = 'published'
			GROUP BY cp.id, s.title, s.slug, u.username, u.name, us.user_id
			ORDER BY dynamic_score DESC
			LIMIT 50`
		args = append(args, userID)

	} else {
		// --- TRENDING / DEFAULT ---
		query = `
			SELECT cp.id, cp.subtheme_id, s.title, s.slug, cp.user_id, u.username, cp.title, cp.content_text, cp.created_at, u.name,
			COALESCE(SUM(v.vote_value), 0) AS net_votes,
			(COALESCE(SUM(v.vote_value), 0) / POWER(EXTRACT(EPOCH FROM (NOW() - cp.created_at))/3600 + 2, 1.8)) AS hot_score
			FROM community_posts cp
			JOIN subthemes s ON cp.subtheme_id = s.id 
			LEFT JOIN "users" u ON cp.user_id = u.id
			LEFT JOIN community_post_votes v ON cp.id = v.post_id
			WHERE cp.status = 'published'
			GROUP BY cp.id, s.title, s.slug, u.username, u.name
			ORDER BY hot_score DESC
			LIMIT 50`
	}

	rows, err := h.DB.Query(query, args...)
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
		var authorUsername *string
		var dummyScore float64

		if slug != "" || subthemeID != "" {
			err = rows.Scan(&p.ID, &p.SubthemeID, &p.SubthemeName, &p.SubthemeSlug, &p.UserID, &authorUsername, &p.Title, &p.ContentText, &p.CreatedAt, &authorName, &p.NetVotes)
		} else {
			err = rows.Scan(&p.ID, &p.SubthemeID, &p.SubthemeName, &p.SubthemeSlug, &p.UserID, &authorUsername, &p.Title, &p.ContentText, &p.CreatedAt, &authorName, &p.NetVotes, &dummyScore)
		}

		if err != nil {
			log.Printf("Error scanning post: %v", err)
			continue
		}

		// Handle missing Display Name
		if authorName != nil {
			p.AuthorName = *authorName
		} else {
			p.AuthorName = "Deleted User"
		}

		// Handle missing Username
		if authorUsername != nil {
			p.AuthorUsername = *authorUsername
		} else {
			p.AuthorUsername = "deleted"
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

// ----- POST Functions -----
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

func (h *Handler) VoteOnPost(w http.ResponseWriter, r *http.Request) {
	// 1. Get the authenticated user
	userID, ok := r.Context().Value("user_id").(string)
	if !ok || userID == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// 2. Grab the Post ID from the URL (e.g., /api/community/15/vote)
	postID := r.PathValue("id")
	if postID == "" {
		http.Error(w, "Post ID is required", http.StatusBadRequest)
		return
	}

	// 3. Decode the vote value (1, -1, or 0)
	var req types.VoteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if req.VoteValue != 1 && req.VoteValue != -1 && req.VoteValue != 0 {
		http.Error(w, "Vote value must be 1, -1, or 0", http.StatusBadRequest)
		return
	}

	// 4. Execute the correct Database Action
	if req.VoteValue == 0 {
		// The user clicked their active vote to remove it
		_, err := h.DB.Exec(`
			DELETE FROM community_post_votes 
			WHERE post_id = $1 AND user_id = $2`,
			postID, userID,
		)
		if err != nil {
			log.Printf("Error deleting vote: %v", err)
			http.Error(w, "Failed to remove vote", http.StatusInternalServerError)
			return
		}
	} else {
		// The user is casting a new vote OR changing an upvote to a downvote
		_, err := h.DB.Exec(`
			INSERT INTO community_post_votes (post_id, user_id, vote_value)
			VALUES ($1, $2, $3)
			ON CONFLICT (post_id, user_id) 
			DO UPDATE SET vote_value = EXCLUDED.vote_value`,
			postID, userID, req.VoteValue,
		)
		if err != nil {
			log.Printf("Error upserting vote: %v", err)
			http.Error(w, "Failed to register vote", http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Vote registered"})
}
