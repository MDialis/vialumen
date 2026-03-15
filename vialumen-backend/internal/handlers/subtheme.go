package handlers

import (
	"encoding/json"
	"log"
	"net/http"
)

type CreateSubthemeRequest struct {
	Title        string   `json:"title"`
	Slug         string   `json:"slug"`
	Description  string   `json:"description"`
	HierarchyIDs []string `json:"hierarchy_ids"`
}

func (h *Handler) CreateSubtheme(w http.ResponseWriter, r *http.Request) {
	var req CreateSubthemeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if req.Title == "" || req.Slug == "" || len(req.HierarchyIDs) == 0 {
		http.Error(w, "Title, slug, and at least one hierarchy_id are required", http.StatusBadRequest)
		return
	}

	tx, err := h.DB.Begin()
	if err != nil {
		http.Error(w, "Failed to start transaction", http.StatusInternalServerError)
		return
	}

	defer tx.Rollback()

	var subthemeID int
	err = tx.QueryRow(`
		INSERT INTO subthemes (title, slug, description) 
		VALUES ($1, $2, $3) 
		RETURNING id`,
		req.Title, req.Slug, req.Description,
	).Scan(&subthemeID)

	if err != nil {
		log.Printf("Error inserting subtheme: %v", err)
		http.Error(w, "Failed to create subtheme (slug might already exist)", http.StatusConflict)
		return
	}

	for _, hierarchyID := range req.HierarchyIDs {
		_, err = tx.Exec(`
			INSERT INTO subtheme_hierarchies (subtheme_id, hierarchy_id) 
			VALUES ($1, $2)`,
			subthemeID, hierarchyID,
		)
		if err != nil {
			log.Printf("Error linking hierarchy %s: %v", hierarchyID, err)
			http.Error(w, "Failed to link hierarchies", http.StatusInternalServerError)
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
		"message":     "Subtheme created successfully",
		"subtheme_id": subthemeID,
	})
}
