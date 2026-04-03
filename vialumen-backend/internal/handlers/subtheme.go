package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/MDialis/vialumen-backend/internal/types"
)

func (h *Handler) fetchSubthemesHelper(hierarchyID string) ([]types.SubthemeResponse, error) {
	query := `
		SELECT s.id, s.title, s.slug, s.description, s.created_at
		FROM subthemes s
		JOIN subtheme_hierarchies sh ON s.id = sh.subtheme_id
		WHERE sh.hierarchy_id = $1
		ORDER BY s.title ASC
	`
	rows, err := h.DB.Query(query, hierarchyID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	subthemes := []types.SubthemeResponse{}

	for rows.Next() {
		var st types.SubthemeResponse
		if err := rows.Scan(&st.ID, &st.Title, &st.Slug, &st.Description, &st.CreatedAt); err != nil {
			return nil, err
		}
		subthemes = append(subthemes, st)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return subthemes, nil
}

func (h *Handler) CreateSubtheme(w http.ResponseWriter, r *http.Request) {
	var req types.CreateSubthemeRequest
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

func (h *Handler) GetSubthemesByHierarchy(w http.ResponseWriter, r *http.Request) {
	hierarchyID := r.PathValue("id")
	if hierarchyID == "" {
		http.Error(w, "Hierarchy ID is required", http.StatusBadRequest)
		return
	}

	subthemes, err := h.fetchSubthemesHelper(hierarchyID)
	if err != nil {
		log.Printf("Error fetching subthemes: %v", err)
		http.Error(w, "Failed to fetch subthemes", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(subthemes)
}

func (h *Handler) GetSubthemesConnectionsByHierarchy(w http.ResponseWriter, r *http.Request) {
	hierarchyID := r.PathValue("id")
	if hierarchyID == "" {
		http.Error(w, "Hierarchy ID is required", http.StatusBadRequest)
		return
	}

	nodes, err := h.fetchSubthemesHelper(hierarchyID)
	if err != nil {
		log.Printf("Error fetching nodes: %v", err)
		http.Error(w, "Failed to fetch subthemes", http.StatusInternalServerError)
		return
	}

	edgesQuery := `
		SELECT sc.source_subtheme_id, sc.target_subtheme_id
		FROM subtheme_connections sc
		JOIN subtheme_hierarchies sh ON sc.source_subtheme_id = sh.subtheme_id
		WHERE sh.hierarchy_id = $1
	`
	edgeRows, err := h.DB.Query(edgesQuery, hierarchyID)
	if err != nil {
		log.Printf("Error querying connections: %v", err)
		http.Error(w, "Failed to fetch connections", http.StatusInternalServerError)
		return
	}
	defer edgeRows.Close()

	edges := []types.Connection{}
	for edgeRows.Next() {
		var conn types.Connection
		if err := edgeRows.Scan(&conn.Source, &conn.Target); err != nil {
			log.Printf("Error scanning connection row: %v", err)
			http.Error(w, "Failed to read data", http.StatusInternalServerError)
			return
		}
		edges = append(edges, conn)
	}
	if err = edgeRows.Err(); err != nil {
		log.Printf("Error iterating connection rows: %v", err)
		http.Error(w, "Error processing data", http.StatusInternalServerError)
		return
	}

	response := types.HierarchyGraphResponse{
		Nodes: nodes,
		Edges: edges,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func (h *Handler) ConnectSubthemes(w http.ResponseWriter, r *http.Request) {
	var req types.ConnectSubthemesRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if req.SourceID == 0 || req.TargetID == 0 {
		http.Error(w, "Both source_id and target_id are required", http.StatusBadRequest)
		return
	}

	if req.SourceID == req.TargetID {
		http.Error(w, "A subtheme cannot connect to itself", http.StatusBadRequest)
		return
	}

	_, err := h.DB.Exec(`
		INSERT INTO subtheme_connections (source_subtheme_id, target_subtheme_id) 
		VALUES ($1, $2)`,
		req.SourceID, req.TargetID,
	)

	if err != nil {
		log.Printf("Error connecting subthemes %d and %d: %v", req.SourceID, req.TargetID, err)
		http.Error(w, "Failed to connect subthemes. They might already be connected, or the IDs do not exist.", http.StatusConflict)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Subthemes connected successfully",
	})
}
