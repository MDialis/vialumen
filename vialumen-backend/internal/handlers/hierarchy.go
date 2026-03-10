package handlers

import (
	"encoding/json"
	"net/http"
)

type HierarchyLevel struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Theme       string `json:"theme"`
}

func HealthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "healthy"})
}

func GetHierarchyLevels(w http.ResponseWriter, r *http.Request) {
	levels := []HierarchyLevel{
		{
			ID:          "physiology",
			Title:       "Physiology",
			Description: "The essentials for survival: air, water, food, and shelter.",
			Theme:       "physiology-theme",
		},
		{
			ID:          "safety",
			Title:       "Safety",
			Description: "Finding stability in a chaotic world.",
			Theme:       "safety-theme",
		},
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(levels)
}
