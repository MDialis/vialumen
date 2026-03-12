package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
)

type Handler struct {
	DB *sql.DB
}

type HierarchyLevel struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Theme       string `json:"theme"`
}

func (h *Handler) GetHierarchyLevels(w http.ResponseWriter, r *http.Request) {
	rows, err := h.DB.Query("SELECT id, title, description, theme FROM hierarchy_levels")
	if err != nil {
		http.Error(w, "Failed to query database", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var levels []HierarchyLevel

	for rows.Next() {
		var level HierarchyLevel
		// Scan the row columns into the struct fields
		if err := rows.Scan(&level.ID, &level.Title, &level.Description, &level.Theme); err != nil {
			http.Error(w, "Failed to read database row", http.StatusInternalServerError)
			return
		}
		levels = append(levels, level)
	}

	if err = rows.Err(); err != nil {
		http.Error(w, "Error iterating over rows", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(levels)
}
