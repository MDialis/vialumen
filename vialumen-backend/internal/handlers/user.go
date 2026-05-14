package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"github.com/MDialis/vialumen-backend/internal/types"
)

func (h *Handler) SearchAllUsers(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")

	// EARLY EXIT: Save DB connections if the query is empty or too short
	if len(query) < 2 {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("[]"))
		return
	}

	// Prepare search pattern for ILIKE (e.g., "%dia%")
	searchPattern := "%" + query + "%"

	// Strict LIMIT 10 ensures sub-millisecond execution times
	sqlQuery := `
		SELECT id, username, name 
		FROM users 
		WHERE username ILIKE $1 OR name ILIKE $1 
		ORDER BY username ASC 
		LIMIT 10
	`

	rows, err := h.DB.Query(sqlQuery, searchPattern)
	if err != nil {
		log.Printf("Error searching users: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	results := []types.UserListItem{}
	for rows.Next() {
		var u types.UserListItem
		if err := rows.Scan(&u.ID, &u.Username, &u.Name); err != nil {
			log.Printf("Error scanning user search row: %v", err)
			continue
		}
		results = append(results, u)
	}

	if err = rows.Err(); err != nil {
		log.Printf("Error iterating user search rows: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(results)
}

// GetUserProfile fetches public profile data by username
func (h *Handler) GetUserProfile(w http.ResponseWriter, r *http.Request) {
	// Extract the username from the URL
	username := r.PathValue("username")
	if username == "" {
		http.Error(w, "Username is required", http.StatusBadRequest)
		return
	}

	var profile types.PublicProfile
	var image sql.NullString

	query := `SELECT name, username, image, created_at FROM users WHERE username = $1`

	err := h.DB.QueryRow(query, username).Scan(
		&profile.Name,
		&profile.Username,
		&image,
		&profile.CreatedAt,
	)

	// Handle Errors
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "User not found", http.StatusNotFound)
			return
		}
		log.Printf("Database error fetching user %s: %v", username, err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// Map the NullString to our pointer if it's valid
	if image.Valid {
		profile.Image = &image.String
	}

	// Send the JSON response
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(profile); err != nil {
		log.Printf("Error encoding JSON response: %v", err)
	}
}
