package handlers

import (
	"database/sql"
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

func (h *Handler) GetOfficialSubthemeBySlug(w http.ResponseWriter, r *http.Request) {
	slug := r.PathValue("slug")
	if slug == "" {
		http.Error(w, "Slug is required", http.StatusBadRequest)
		return
	}

	var response types.OfficialPageResponse
	response.Blocks = []types.ContentBlockResponse{} // Initialize empty array

	// Fetch the Base Subtheme Info
	err := h.DB.QueryRow(`
		SELECT id, title, slug, description 
		FROM subthemes WHERE slug = $1`, slug,
	).Scan(&response.ID, &response.Title, &response.Slug, &response.Description)

	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Subtheme not found", http.StatusNotFound)
			return
		}
		log.Printf("Error fetching subtheme: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// Fetch ALL Active Versions for this Subtheme AND check for older versions
	// The subquery (SELECT COUNT...) checks if inactive versions exist for this specific content_type
	blocksQuery := `
		SELECT 
			id, content_type, content_text,
			(SELECT COUNT(*) FROM official_versions ov2 
			 WHERE ov2.subtheme_id = ov1.subtheme_id 
			 AND ov2.content_type = ov1.content_type 
			 AND ov2.is_active = false) > 0 as has_older_versions
		FROM official_versions ov1
		WHERE subtheme_id = $1 AND is_active = true
	`
	rows, err := h.DB.Query(blocksQuery, response.ID)
	if err != nil {
		log.Printf("Error fetching blocks: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// Loop through each active block, and attach its Contributors and Sources
	for rows.Next() {
		var block types.ContentBlockResponse
		block.Contributors = []types.ContributorResponse{}
		block.Sources = []types.SourceResponse{}

		if err := rows.Scan(&block.VersionID, &block.ContentType, &block.ContentText, &block.HasOlderVersions); err != nil {
			log.Printf("Error scanning block: %v", err)
			continue
		}

		// Fetch Contributors for this specific block
		cRows, _ := h.DB.Query(`
			SELECT COALESCE(u.name, oc.external_name), oc.contribution_role
			FROM official_contributors oc
			LEFT JOIN users u ON oc.user_id = u.id
			WHERE oc.version_id = $1`, block.VersionID,
		)
		defer cRows.Close()
		for cRows.Next() {
			var c types.ContributorResponse
			cRows.Scan(&c.Name, &c.Role)
			block.Contributors = append(block.Contributors, c)
		}

		// Fetch Sources for this specific block
		sRows, _ := h.DB.Query(`SELECT title, url FROM sources WHERE official_version_id = $1`, block.VersionID)
		defer sRows.Close()
		for sRows.Next() {
			var s types.SourceResponse
			sRows.Scan(&s.Title, &s.URL)
			block.Sources = append(block.Sources, s)
		}

		// Append the fully populated block to the page response
		response.Blocks = append(response.Blocks, block)
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

func (h *Handler) CreateOfficialVersion(w http.ResponseWriter, r *http.Request) {
	var req types.CreateOfficialVersionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// Basic validation
	if req.SubthemeID == 0 || req.ContentType == "" || req.ContentText == "" {
		http.Error(w, "subtheme_id, content_type, and content_text are required", http.StatusBadRequest)
		return
	}

	tx, err := h.DB.Begin()
	if err != nil {
		http.Error(w, "Failed to start transaction", http.StatusInternalServerError)
		return
	}
	defer tx.Rollback() // Rolls back if anything fails before tx.Commit()

	// If this new version is active, deactivate all older versions for this subtheme in the same content type
	if req.IsActive {
		_, err = tx.Exec(`
            UPDATE official_versions 
            SET is_active = false 
            WHERE subtheme_id = $1 AND content_type = $2`,
			req.SubthemeID, req.ContentType,
		)
		if err != nil {
			log.Printf("Error deactivating old versions: %v", err)
			http.Error(w, "Failed to update previous version statuses", http.StatusInternalServerError)
			return
		}
	}

	// Insert the main version
	var versionID int
	err = tx.QueryRow(`
		INSERT INTO official_versions (subtheme_id, content_type, content_text, is_active)
		VALUES ($1, $2, $3, $4)
		RETURNING id`,
		req.SubthemeID, req.ContentType, req.ContentText, req.IsActive,
	).Scan(&versionID)

	if err != nil {
		log.Printf("Error inserting official version: %v", err)
		http.Error(w, "Failed to create official version", http.StatusInternalServerError)
		return
	}

	// Insert Contributors
	for _, c := range req.Contributors {
		_, err = tx.Exec(`
			INSERT INTO official_contributors (version_id, user_id, external_name, contribution_role)
			VALUES ($1, $2, $3, $4)`,
			versionID, c.UserID, c.ExternalName, c.Role,
		)
		if err != nil {
			log.Printf("Error inserting contributor: %v", err)
			http.Error(w, "Failed to insert contributors", http.StatusInternalServerError)
			return
		}
	}

	// Insert Sources
	for _, s := range req.Sources {
		_, err = tx.Exec(`
			INSERT INTO sources (official_version_id, title, url, source_type)
			VALUES ($1, $2, $3, $4)`,
			versionID, s.Title, s.URL, s.SourceType,
		)
		if err != nil {
			log.Printf("Error inserting source: %v", err)
			http.Error(w, "Failed to insert sources", http.StatusInternalServerError)
			return
		}
	}

	// Commit everything to the database!
	if err = tx.Commit(); err != nil {
		log.Printf("Error committing transaction: %v", err)
		http.Error(w, "Failed to save data", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message":    "Official version created successfully",
		"version_id": versionID,
	})
}
