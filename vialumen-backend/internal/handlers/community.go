package handlers

import (
	"database/sql"
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
			COALESCE(SUM(v.vote_value), 0) AS net_votes,
			(SELECT COUNT(*) FROM post_comments WHERE post_id = cp.id) AS comment_count
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
			(SELECT COUNT(*) FROM post_comments WHERE post_id = cp.id) AS comment_count,
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
			(SELECT COUNT(*) FROM post_comments WHERE post_id = cp.id) AS comment_count,
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
			err = rows.Scan(&p.ID, &p.SubthemeID, &p.SubthemeName, &p.SubthemeSlug, &p.UserID, &authorUsername, &p.Title, &p.ContentText, &p.CreatedAt, &authorName, &p.NetVotes, &p.CommentCount)
		} else {
			err = rows.Scan(&p.ID, &p.SubthemeID, &p.SubthemeName, &p.SubthemeSlug, &p.UserID, &authorUsername, &p.Title, &p.ContentText, &p.CreatedAt, &authorName, &p.NetVotes, &p.CommentCount, &dummyScore)
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

func (h *Handler) GetCommunityPostByID(w http.ResponseWriter, r *http.Request) {
	postID := r.PathValue("id")
	if postID == "" {
		http.Error(w, "Post ID is required", http.StatusBadRequest)
		return
	}

	var response types.CommunityPostDetailResponse

	// Fetch the Single Post
	postQuery := `
		SELECT cp.id, cp.subtheme_id, s.title, s.slug, cp.user_id, u.username, cp.title, cp.content_text, cp.created_at, u.name,
		COALESCE(SUM(v.vote_value), 0) AS net_votes
		FROM community_posts cp
		JOIN subthemes s ON cp.subtheme_id = s.id 
		LEFT JOIN "users" u ON cp.user_id = u.id
		LEFT JOIN community_post_votes v ON cp.id = v.post_id
		WHERE cp.id = $1 AND cp.status = 'published'
		GROUP BY cp.id, s.title, s.slug, u.username, u.name`

	var authorName *string
	var authorUsername *string

	err := h.DB.QueryRow(postQuery, postID).Scan(
		&response.Post.ID, &response.Post.SubthemeID, &response.Post.SubthemeName, &response.Post.SubthemeSlug,
		&response.Post.UserID, &authorUsername, &response.Post.Title, &response.Post.ContentText,
		&response.Post.CreatedAt, &authorName, &response.Post.NetVotes,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Post not found", http.StatusNotFound)
			return
		}
		log.Printf("Error fetching post: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	response.Post.AuthorName = "Deleted User"
	if authorName != nil {
		response.Post.AuthorName = *authorName
	}
	response.Post.AuthorUsername = "deleted"
	if authorUsername != nil {
		response.Post.AuthorUsername = *authorUsername
	}

	// Fetch the Comments for this Post
	commentsQuery := `
		SELECT c.id, c.post_id, c.user_id, u.username, u.name, c.content_text, c.created_at,
		COALESCE(SUM(cv.vote_value), 0) AS net_votes
		FROM post_comments c
		LEFT JOIN "users" u ON c.user_id = u.id
		LEFT JOIN comment_votes cv ON c.id = cv.comment_id
		WHERE c.post_id = $1
		GROUP BY c.id, u.username, u.name
		ORDER BY net_votes DESC, c.created_at DESC` // Sort by highest voted, then newest

	rows, err := h.DB.Query(commentsQuery, postID)
	if err != nil {
		log.Printf("Error fetching comments: %v", err)
		http.Error(w, "Failed to fetch comments", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	response.Comments = []types.PostCommentResponse{}
	for rows.Next() {
		var c types.PostCommentResponse
		var cAuthor *string
		var cUser *string

		if err := rows.Scan(&c.ID, &c.PostID, &c.UserID, &cUser, &cAuthor, &c.ContentText, &c.CreatedAt, &c.NetVotes); err != nil {
			log.Printf("Error scanning comment: %v", err)
			continue
		}

		c.AuthorName = "Deleted User"
		if cAuthor != nil {
			c.AuthorName = *cAuthor
		}
		c.Username = "deleted"
		if cUser != nil {
			c.Username = *cUser
		}

		response.Comments = append(response.Comments, c)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
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
	// Get the authenticated user
	userID, ok := r.Context().Value("user_id").(string)
	if !ok || userID == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Grab the Post ID from the URL (e.g., /api/community/15/vote)
	postID := r.PathValue("id")
	if postID == "" {
		http.Error(w, "Post ID is required", http.StatusBadRequest)
		return
	}

	// Decode the vote value (1, -1, or 0)
	var req types.VoteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if req.VoteValue != 1 && req.VoteValue != -1 && req.VoteValue != 0 {
		http.Error(w, "Vote value must be 1, -1, or 0", http.StatusBadRequest)
		return
	}

	// Execute the correct Database Action
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

func (h *Handler) CreateComment(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("user_id").(string)
	if !ok || userID == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	postID := r.PathValue("id")
	if postID == "" {
		http.Error(w, "Post ID is required", http.StatusBadRequest)
		return
	}

	var req types.CreateCommentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if req.ContentText == "" {
		http.Error(w, "Comment cannot be empty", http.StatusBadRequest)
		return
	}

	var commentID int
	err := h.DB.QueryRow(`
		INSERT INTO post_comments (post_id, user_id, content_text)
		VALUES ($1, $2, $3) RETURNING id`,
		postID, userID, req.ContentText,
	).Scan(&commentID)

	if err != nil {
		log.Printf("Error inserting comment: %v", err)
		http.Error(w, "Failed to post comment", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message":    "Comment posted",
		"comment_id": commentID,
	})
}

func (h *Handler) VoteOnComment(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("user_id").(string)
	if !ok || userID == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	commentID := r.PathValue("commentId")
	if commentID == "" {
		http.Error(w, "Comment ID is required", http.StatusBadRequest)
		return
	}

	var req types.VoteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if req.VoteValue == 0 {
		h.DB.Exec(`DELETE FROM comment_votes WHERE comment_id = $1 AND user_id = $2`, commentID, userID)
	} else {
		h.DB.Exec(`
			INSERT INTO comment_votes (comment_id, user_id, vote_value)
			VALUES ($1, $2, $3)
			ON CONFLICT (comment_id, user_id) 
			DO UPDATE SET vote_value = EXCLUDED.vote_value`,
			commentID, userID, req.VoteValue,
		)
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Vote registered"})
}
