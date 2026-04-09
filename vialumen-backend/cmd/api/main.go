package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/joho/godotenv"

	"github.com/MDialis/vialumen-backend/internal/handlers"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: No .env file found, falling back to OS environment variables")
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL is not set in the environment")
	}

	db, err := sql.Open("pgx", dbURL)
	if err != nil {
		log.Fatalf("Error opening database connection: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("Could not ping the database: %v", err)
	}
	log.Println("Successfully connected to the database!")

	appHandler := &handlers.Handler{
		DB: db,
	}

	mux := http.NewServeMux()

	mux.HandleFunc("GET /api/health", handlers.HealthCheck)
	mux.HandleFunc("GET /api/hierarchies", appHandler.GetHierarchyLevels)
	//	mux.HandleFunc("GET /api/hierarchies/{id}/subthemes", appHandler.GetSubthemesByHierarchy)
	mux.HandleFunc("GET /api/core/{id}", appHandler.GetSubthemesConnectionsByHierarchy)
	mux.HandleFunc("GET /api/path/{slug}", appHandler.GetOfficialSubthemeBySlug)

	mux.HandleFunc("POST /api/subthemes", appHandler.CreateSubtheme)
	mux.HandleFunc("POST /api/subthemes/connect", appHandler.ConnectSubthemes)
	mux.HandleFunc("POST /api/official", appHandler.CreateOfficialVersion)

	allowedOrigin := os.Getenv("CORS_ALLOWED_ORIGIN")
	if allowedOrigin == "" {
		allowedOrigin = "http://localhost:3000" // Fallback
	}

	// Pass it to your handler wrapper
	handler := enableCORS(mux, allowedOrigin)

	port := "8080"

	log.Println("Starting Vialumen backend on :" + port)
	if err := http.ListenAndServe(":"+port, handler); err != nil {
		log.Fatal(err)
	}
}

func enableCORS(next http.Handler, allowedOrigin string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
