package types

import "time"

// DB Model
type Subtheme struct {
	ID          int        `json:"id"`
	Title       string     `json:"title"`
	Slug        string     `json:"slug"`
	Description *string    `json:"description"`
	CreatedAt   *time.Time `json:"created_at"`
}

// HTTP Request DTOs
type CreateSubthemeRequest struct {
	Title        string   `json:"title"`
	Slug         string   `json:"slug"`
	Description  string   `json:"description"`
	HierarchyIDs []string `json:"hierarchy_ids"`
}

type ConnectSubthemesRequest struct {
	SourceID int `json:"source_id"`
	TargetID int `json:"target_id"`
}

type CreateOfficialVersionRequest struct {
	SubthemeID   int                  `json:"subtheme_id"`
	ContentType  string               `json:"content_type"`
	ContentText  string               `json:"content_text"`
	IsActive     bool                 `json:"is_active"`
	Contributors []ContributorRequest `json:"contributors"`
	Sources      []SourceRequest      `json:"sources"`
}

type ContributorRequest struct {
	UserID       *int    `json:"user_id"`       // Nullable (if it's an external expert)
	ExternalName *string `json:"external_name"` // Nullable (if it's a registered user)
	Role         string  `json:"role"`
}

type SourceRequest struct {
	Title      string  `json:"title"`
	URL        *string `json:"url"`
	SourceType string  `json:"source_type"`
}

// HTTP Response DTOs
type SubthemeResponse struct {
	ID          int       `json:"id"`
	Title       string    `json:"title"`
	Slug        string    `json:"slug"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
}

type Connection struct {
	Source int `json:"source"`
	Target int `json:"target"`
}

type HierarchyGraphResponse struct {
	Nodes []SubthemeResponse `json:"nodes"`
	Edges []Connection       `json:"edges"`
}

type OfficialPageResponse struct {
	ID          int                    `json:"id"`
	Title       string                 `json:"title"`
	Slug        string                 `json:"slug"`
	Description *string                `json:"description"`
	Blocks      []ContentBlockResponse `json:"blocks"`
}

type ContentBlockResponse struct {
	VersionID        int                   `json:"version_id"`
	ContentType      string                `json:"content_type"`
	ContentText      string                `json:"content_text"`
	HasOlderVersions bool                  `json:"has_older_versions"`
	Contributors     []ContributorResponse `json:"contributors"`
	Sources          []SourceResponse      `json:"sources"`
}

// (ContributorResponse and SourceResponse remain the same)
type ContributorResponse struct {
	Name string `json:"name"`
	Role string `json:"role"`
}

type SourceResponse struct {
	Title string  `json:"title"`
	URL   *string `json:"url"`
}
