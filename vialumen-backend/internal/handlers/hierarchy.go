package handlers

import (
	"encoding/json"
	"log"
	"net/http"
)

type HierarchyLevel struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Theme       string `json:"theme"`
	Href        string `json:"href"`
	Image       string `json:"image"`
}

func (h *Handler) GetHierarchyLevels(w http.ResponseWriter, r *http.Request) {
	rows, err := h.DB.Query("SELECT id, title, description FROM hierarchies")
	if err != nil {
		log.Printf("Error querying hierarchies: %v", err)
		http.Error(w, "Failed to fetch hierarchies", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var levels []HierarchyLevel

	for rows.Next() {
		var level HierarchyLevel

		if err := rows.Scan(&level.ID, &level.Title, &level.Description); err != nil {
			log.Printf("Error scanning hierarchy row: %v", err)
			http.Error(w, "Failed to read data", http.StatusInternalServerError)
			return
		}

		level.Theme = level.ID + "-theme"
		level.Href = "/core?tab=" + level.ID
		level.Image = "https://avatar.vercel.sh/shadcn1"

		levels = append(levels, level)
	}

	if err = rows.Err(); err != nil {
		log.Printf("Error iterating hierarchy rows: %v", err)
		http.Error(w, "Error processing data", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	if levels == nil {
		levels = []HierarchyLevel{}
	}

	json.NewEncoder(w).Encode(levels)
}
