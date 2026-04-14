package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"github.com/MDialis/vialumen-backend/internal/types"
)

// ----- GET Functions -----
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

// GetVersionHistory gets a lightweight list of past edits for a specific content type
func (h *Handler) GetVersionHistory(w http.ResponseWriter, r *http.Request) {
	slug := r.PathValue("slug")
	contentType := r.PathValue("contentType")

	if slug == "" || contentType == "" {
		http.Error(w, "Slug and contentType are required", http.StatusBadRequest)
		return
	}

	// 1. Find the subtheme ID first to ensure it exists
	var subthemeID int
	err := h.DB.QueryRow(`SELECT id FROM subthemes WHERE slug = $1`, slug).Scan(&subthemeID)
	if err != nil {
		http.Error(w, "Subtheme not found", http.StatusNotFound)
		return
	}

	// 2. Fetch the lightweight history
	query := `
		SELECT id, accepted_at, is_active
		FROM official_versions
		WHERE subtheme_id = $1 AND content_type = $2
		ORDER BY accepted_at DESC
	`
	rows, err := h.DB.Query(query, subthemeID, contentType)
	if err != nil {
		log.Printf("Error fetching history: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	history := []types.VersionHistoryItem{}
	for rows.Next() {
		var item types.VersionHistoryItem
		if err := rows.Scan(&item.VersionID, &item.AcceptedAt, &item.IsActive); err != nil {
			log.Printf("Error scanning history row: %v", err)
			continue
		}
		history = append(history, item)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(history)
}

func (h *Handler) GetSpecificVersion(w http.ResponseWriter, r *http.Request) {
	versionID := r.PathValue("id")
	if versionID == "" {
		http.Error(w, "Version ID is required", http.StatusBadRequest)
		return
	}

	var block types.ContentBlockResponse

	err := h.DB.QueryRow(`
		SELECT id, content_type, content_text 
		FROM official_versions 
		WHERE id = $1`, versionID,
	).Scan(&block.VersionID, &block.ContentType, &block.ContentText)

	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Version not found", http.StatusNotFound)
			return
		}
		log.Printf("Error fetching specific version: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	block.Contributors = []types.ContributorResponse{}
	block.Sources = []types.SourceResponse{}

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

	sRows, _ := h.DB.Query(`SELECT title, url FROM sources WHERE official_version_id = $1`, block.VersionID)
	defer sRows.Close()
	for sRows.Next() {
		var s types.SourceResponse
		sRows.Scan(&s.Title, &s.URL)
		block.Sources = append(block.Sources, s)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(block)
}

// ----- POST Functions -----
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
