package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"github.com/MDialis/vialumen-backend/internal/types"
)

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
