package main

import (
	"log"
	"os"

	"backend-app/config"
	"backend-app/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Connect to database
	config.ConnectDatabase()

	// Create Gin router
	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	// Disable automatic redirect for trailing slash
	router.RedirectTrailingSlash = false

	// Get allowed origin from environment variable
	clientOrigin := os.Getenv("CLIENT_ORIGIN")
	if clientOrigin == "" {
		clientOrigin = "http://localhost:5173"
	}

	// Configure CORS for frontend
	corsConfig := cors.Config{
		AllowOrigins:     []string{clientOrigin, "http://localhost:3000", "http://localhost:3001"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}
	router.Use(cors.New(corsConfig))

	// Setup routes
	routes.SetupRoutes(router)

	// Get port from environment variable
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Start server
	log.Printf("Server starting on :%s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
