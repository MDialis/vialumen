package types

import "time"

// DB Models
type CommunityPost struct {
	ID          int        `json:"id"`
	HierarchyID string     `json:"hierarchy_id"`
	SubthemeID  *int       `json:"subtheme_id"`
	Title       string     `json:"title"`
	ContentType string     `json:"content_type"`
	ContentText string     `json:"content_text"`
	Status      *string    `json:"status"`
	CreatedAt   *time.Time `json:"created_at"`
}

type PostContributor struct {
	ID               int     `json:"id"`
	PostID           int     `json:"post_id"`
	UserID           *int    `json:"user_id"`
	ExternalName     *string `json:"external_name"`
	ContributionRole string  `json:"contribution_role"`
}

type SubmissionVote struct {
	PostID    int `json:"post_id"`
	UserID    int `json:"user_id"`
	VoteValue int `json:"vote_value"` // smallint maps to int in Go
}
