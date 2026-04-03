package types

// DB Model
type User struct {
	ID       int     `json:"id"`
	Username string  `json:"username"`
	Name     string  `json:"name"`
	Email    string  `json:"email"`
	Role     *string `json:"role"` // Nullable (defaults to 'user')
}
