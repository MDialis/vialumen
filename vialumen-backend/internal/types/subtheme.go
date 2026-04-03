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
