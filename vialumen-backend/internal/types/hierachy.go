package types

// DB Model
type Hierarchy struct {
	ID          string  `json:"id"`
	Title       string  `json:"title"`
	Description *string `json:"description"`
}

// HTTP Response DTO
type HierarchyLevel struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Theme       string `json:"theme"`
	Href        string `json:"href"`
	Image       string `json:"image"`
}
