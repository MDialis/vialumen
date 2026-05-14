package types

import "time"

// DB Model
type User struct {
	ID       string  `json:"id"`
	Username string  `json:"username"`
	Name     string  `json:"name"`
	Email    string  `json:"email"`
	Role     *string `json:"role"` // Nullable (defaults to 'user')
}

type UserListItem struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Name     string `json:"name"`
}

type PublicProfile struct {
	Name      string    `json:"name"`
	Username  string    `json:"username"`
	Image     *string   `json:"image"`
	CreatedAt time.Time `json:"createdAt"`
}
