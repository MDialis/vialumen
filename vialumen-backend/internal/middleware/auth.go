package middleware

import (
	"context"
	"database/sql"
	"net/http"
	"strings"
	"time"
)

// AuthMiddleware wraps an http.Handler to verify the Better-Auth session token
func AuthMiddleware(db *sql.DB) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

			// Extract the token from the Authorization header
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
				http.Error(w, "Unauthorized: Missing or invalid token format", http.StatusUnauthorized)
				return
			}

			token := strings.TrimPrefix(authHeader, "Bearer ")

			// Query the PostgreSQL session table
			var sessionID string
			var userID string
			var expiresAt time.Time

			// Better-Auth stores the token directly in the 'token' column
			err := db.QueryRowContext(r.Context(), `
				SELECT id, user_id, expires_at 
				FROM session 
				WHERE token = $1`, token).Scan(&sessionID, &userID, &expiresAt)

			if err != nil {
				if err == sql.ErrNoRows {
					http.Error(w, "Unauthorized: Invalid session token", http.StatusUnauthorized)
					return
				}
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}

			// Check for expiration
			if time.Now().After(expiresAt) {
				http.Error(w, "Unauthorized: Session expired", http.StatusUnauthorized)
				return
			}

			// Attach the user_id to the context
			ctx := context.WithValue(r.Context(), "user_id", userID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
