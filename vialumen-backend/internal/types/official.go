package types

import "time"

// DB Models
type OfficialVersion struct {
	ID             int        `json:"id"`
	SubthemeID     int        `json:"subtheme_id"`
	OriginalPostID *int       `json:"original_post_id"`
	ContentType    string     `json:"content_type"`
	ContentText    string     `json:"content_text"`
	IsActive       *bool      `json:"is_active"`
	AcceptedAt     *time.Time `json:"accepted_at"`
}

type OfficialContributor struct {
	ID               int     `json:"id"`
	VersionID        int     `json:"version_id"`
	UserID           *int    `json:"user_id"`
	ExternalName     *string `json:"external_name"`
	ContributionRole string  `json:"contribution_role"`
}

type OfficialNomination struct {
	ID                 int        `json:"id"`
	PostID             *int       `json:"post_id"`
	NominatedByAdminID *int       `json:"nominated_by_admin_id"`
	EditedContentText  string     `json:"edited_content_text"`
	AdminNotes         *string    `json:"admin_notes"`
	ReviewStatus       *string    `json:"review_status"`
	CreatedAt          *time.Time `json:"created_at"`
}

type Source struct {
	ID                int     `json:"id"`
	OfficialVersionID int     `json:"official_version_id"`
	Title             string  `json:"title"`
	URL               *string `json:"url"`
	SourceType        string  `json:"source_type"`
}
