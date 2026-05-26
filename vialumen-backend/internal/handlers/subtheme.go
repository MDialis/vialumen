package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/MDialis/vialumen-backend/internal/types"
)

// ----- Helper Functions -----
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

// ----- GET Functions -----
func (h *Handler) GetAllSubthemes(w http.ResponseWriter, r *http.Request) {
	query := `SELECT id, title, slug FROM subthemes ORDER BY title ASC`

	rows, err := h.DB.Query(query)
	if err != nil {
		log.Printf("Error querying all subthemes: %v", err)
		http.Error(w, "Failed to fetch subthemes", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	list := []types.SubthemeListItem{}

	for rows.Next() {
		var item types.SubthemeListItem
		if err := rows.Scan(&item.ID, &item.Title, &item.Slug); err != nil {
			log.Printf("Error scanning subtheme list row: %v", err)
			continue
		}
		list = append(list, item)
	}

	if err = rows.Err(); err != nil {
		log.Printf("Error iterating subtheme list rows: %v", err)
		http.Error(w, "Error processing data", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(list)
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
		JOIN subtheme_hierarchies sh1 ON sc.source_subtheme_id = sh1.subtheme_id
		JOIN subtheme_hierarchies sh2 ON sc.target_subtheme_id = sh2.subtheme_id
		WHERE sh1.hierarchy_id = $1 AND sh2.hierarchy_id = $1
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

func (h *Handler) GetSubthemePathNodes(w http.ResponseWriter, r *http.Request) {
	slug := r.PathValue("slug")
	if slug == "" {
		http.Error(w, "Slug is required", http.StatusBadRequest)
		return
	}

	// Fetch all Edges (Connections) going strictly UP to the root and DOWN to the leaves.
	edgesQuery := `
		WITH RECURSIVE target AS (
			SELECT id FROM subthemes WHERE slug = $1
		),
		children_cte AS (
			-- Base Case: Direct children
			SELECT source_subtheme_id, target_subtheme_id
			FROM subtheme_connections
			WHERE source_subtheme_id = (SELECT id FROM target)
			
			UNION ALL
			
			-- Recursive: Children of children
			SELECT sc.source_subtheme_id, sc.target_subtheme_id
			FROM subtheme_connections sc
			JOIN children_cte c ON sc.source_subtheme_id = c.target_subtheme_id
		),
		parents_cte AS (
			-- Base Case: Direct parents
			SELECT source_subtheme_id, target_subtheme_id
			FROM subtheme_connections
			WHERE target_subtheme_id = (SELECT id FROM target)
			
			UNION ALL
			
			-- Recursive: Parents of parents (A single line up, ignoring siblings)
			SELECT sc.source_subtheme_id, sc.target_subtheme_id
			FROM subtheme_connections sc
			JOIN parents_cte p ON sc.target_subtheme_id = p.source_subtheme_id
		)
		SELECT source_subtheme_id, target_subtheme_id FROM children_cte
		UNION
		SELECT source_subtheme_id, target_subtheme_id FROM parents_cte
	`

	edgeRows, err := h.DB.Query(edgesQuery, slug)
	if err != nil {
		log.Printf("Error querying specific path edges: %v", err)
		http.Error(w, "Failed to fetch path connections", http.StatusInternalServerError)
		return
	}
	defer edgeRows.Close()

	var edges []types.Connection
	for edgeRows.Next() {
		var conn types.Connection
		if err := edgeRows.Scan(&conn.Source, &conn.Target); err != nil {
			log.Printf("Error scanning edge row: %v", err)
			continue
		}
		edges = append(edges, conn)
	}

	// Fetch the Nodes (Subthemes) that belong to those specific edges
	nodesQuery := `
		WITH RECURSIVE target AS (
			SELECT id FROM subthemes WHERE slug = $1
		),
		children_cte AS (
			SELECT source_subtheme_id, target_subtheme_id FROM subtheme_connections WHERE source_subtheme_id = (SELECT id FROM target)
			UNION ALL
			SELECT sc.source_subtheme_id, sc.target_subtheme_id FROM subtheme_connections sc JOIN children_cte c ON sc.source_subtheme_id = c.target_subtheme_id
		),
		parents_cte AS (
			SELECT source_subtheme_id, target_subtheme_id FROM subtheme_connections WHERE target_subtheme_id = (SELECT id FROM target)
			UNION ALL
			SELECT sc.source_subtheme_id, sc.target_subtheme_id FROM subtheme_connections sc JOIN parents_cte p ON sc.target_subtheme_id = p.source_subtheme_id
		),
		all_edges AS (
			SELECT source_subtheme_id as src, target_subtheme_id as tgt FROM children_cte
			UNION
			SELECT source_subtheme_id, target_subtheme_id FROM parents_cte
		),
		involved_nodes AS (
			SELECT src AS node_id FROM all_edges
			UNION
			SELECT tgt FROM all_edges
			UNION
			SELECT id FROM target -- Ensures the target itself is loaded even if it has no children or parents
		)
		SELECT s.id, s.title, s.slug, s.created_at
		FROM subthemes s
		JOIN involved_nodes n ON s.id = n.node_id;
	`

	nodeRows, err := h.DB.Query(nodesQuery, slug)
	if err != nil {
		log.Printf("Error querying specific path nodes: %v", err)
		http.Error(w, "Failed to fetch path nodes", http.StatusInternalServerError)
		return
	}
	defer nodeRows.Close()

	var nodes []types.SubthemeSimpleResponse
	for nodeRows.Next() {
		var st types.SubthemeSimpleResponse
		// Removed &st.Description from the Scan parameters to match the updated SELECT
		if err := nodeRows.Scan(&st.ID, &st.Title, &st.Slug, &st.CreatedAt); err != nil {
			log.Printf("Error scanning node row: %v", err)
			continue
		}
		nodes = append(nodes, st)
	}

	// Package and send the exact same DTO the main graph uses
	response := types.HierarchyNodeResponse{
		Nodes: nodes,
		Edges: edges,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// ----- POST Functions -----
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
