package routes

import (
	"backend-app/controllers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	// POST /article - create
	router.POST("/article", controllers.CreatePost)
	router.POST("/article/", controllers.CreatePost)

	// GET /article/:param - handles both status (Publish/Draft/Thrash) and ID (numeric)
	router.GET("/article/:param", controllers.GetPostsHandler)
	router.GET("/article/:param/", controllers.GetPostsHandler)

	// PUT /article/:id - update
	router.PUT("/article/:id", controllers.UpdatePost)
	router.PUT("/article/:id/", controllers.UpdatePost)

	// DELETE /article/:id - delete
	router.DELETE("/article/:id", controllers.DeletePost)
	router.DELETE("/article/:id/", controllers.DeletePost)
}
