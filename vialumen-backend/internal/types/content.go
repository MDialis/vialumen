package types

import "time"

// ----- Unified DB Models -----
type Contributor struct {
	ID                int     `json:"id"`
	OfficialVersionID *int    `json:"official_version_id"`
	CommunityPostID   *int    `json:"community_post_id"`
	UserID            *string `json:"user_id"`
	ExternalName      *string `json:"external_name"`
	ContributionRole  string  `json:"contribution_role"`
}

type Source struct {
	ID                int     `json:"id"`
	OfficialVersionID *int    `json:"official_version_id"`
	CommunityPostID   *int    `json:"community_post_id"`
	Title             string  `json:"title"`
	URL               *string `json:"url"`
	SourceType        string  `json:"source_type"`
}

// ----- Official Models -----
type OfficialVersion struct {
	ID             int        `json:"id"`
	SubthemeID     int        `json:"subtheme_id"`
	OriginalPostID *int       `json:"original_post_id"`
	ContentType    string     `json:"content_type"`
	ContentText    string     `json:"content_text"`
	IsActive       *bool      `json:"is_active"`
	AcceptedAt     *time.Time `json:"accepted_at"`
}

type OfficialNomination struct {
	ID                 int        `json:"id"`
	PostID             *int       `json:"post_id"`
	NominatedByAdminID *string    `json:"nominated_by_admin_id"`
	EditedContentText  string     `json:"edited_content_text"`
	AdminNotes         *string    `json:"admin_notes"`
	ReviewStatus       *string    `json:"review_status"`
	CreatedAt          *time.Time `json:"created_at"`
}

type VersionHistoryItem struct {
	VersionID  int    `json:"version_id"`
	AcceptedAt string `json:"accepted_at"`
	IsActive   bool   `json:"is_active"`
}

// ----- Community Models -----
type SubmissionVote struct {
	PostID    int    `json:"post_id"`
	UserID    string `json:"user_id"`
	VoteValue int    `json:"vote_value"`
}

type CreateCommunityPostRequest struct {
	SubthemeID   int                  `json:"subtheme_id"`
	Title        string               `json:"title"`
	ContentText  string               `json:"content_text"`
	Contributors []ContributorRequest `json:"contributors"`
	Sources      []SourceRequest      `json:"sources"`
}

type CommunityPostFeedResponse struct {
	ID          int        `json:"id"`
	SubthemeID  int        `json:"subtheme_id"`
	UserID      string     `json:"user_id"`
	Title       string     `json:"title"`
	ContentText string     `json:"content_text"`
	CreatedAt   *time.Time `json:"created_at"`
	AuthorName  string     `json:"author_name"`
	NetVotes    int        `json:"net_votes"`
}
