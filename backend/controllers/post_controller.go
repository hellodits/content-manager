package controllers

import (
	"backend-app/config"
	"backend-app/models"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

type PostInput struct {
	Title    string `json:"title"`
	Content  string `json:"content"`
	Category string `json:"category"`
	Status   string `json:"status"`
}

type ValidationError struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

func validatePost(input PostInput) []ValidationError {
	var errors []ValidationError
	validStatuses := map[string]bool{"Publish": true, "Draft": true, "Thrash": true}

	if input.Title == "" {
		errors = append(errors, ValidationError{Field: "title", Message: "Title is required"})
	} else if len(input.Title) < 20 {
		errors = append(errors, ValidationError{Field: "title", Message: "Title must be at least 20 characters"})
	}

	if input.Content == "" {
		errors = append(errors, ValidationError{Field: "content", Message: "Content is required"})
	} else if len(input.Content) < 200 {
		errors = append(errors, ValidationError{Field: "content", Message: "Content must be at least 200 characters"})
	}

	if input.Category == "" {
		errors = append(errors, ValidationError{Field: "category", Message: "Category is required"})
	} else if len(input.Category) < 3 {
		errors = append(errors, ValidationError{Field: "category", Message: "Category must be at least 3 characters"})
	}

	if input.Status == "" {
		errors = append(errors, ValidationError{Field: "status", Message: "Status is required"})
	} else if !validStatuses[input.Status] {
		errors = append(errors, ValidationError{Field: "status", Message: "Status must be Publish, Draft, or Thrash"})
	}

	return errors
}

// CreatePost creates a new article
func CreatePost(c *gin.Context) {
	var input PostInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON format"})
		return
	}

	if errors := validatePost(input); len(errors) > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"errors": errors})
		return
	}

	post := models.Post{
		Title:    input.Title,
		Content:  input.Content,
		Category: input.Category,
		Status:   input.Status,
	}

	if err := config.DB.Create(&post).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create article"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": post})
}

// GetPosts returns paginated list of articles
func GetPosts(c *gin.Context) {
	limitStr := c.Param("limit")
	offsetStr := c.Param("offset")

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 {
		limit = 10
	}

	offset, err := strconv.Atoi(offsetStr)
	if err != nil || offset < 0 {
		offset = 0
	}

	var posts []models.Post
	if err := config.DB.Limit(limit).Offset(offset).Find(&posts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch articles"})
		return
	}

	var total int64
	config.DB.Model(&models.Post{}).Count(&total)

	c.JSON(http.StatusOK, gin.H{
		"data":   posts,
		"total":  total,
		"limit":  limit,
		"offset": offset,
	})
}

// GetPostsByStatus returns paginated list of articles filtered by status
func GetPostsByStatus(c *gin.Context) {
	// Extract status from URL path (e.g., /article/Publish)
	path := c.Request.URL.Path
	var status string
	if strings.Contains(path, "Publish") {
		status = "Publish"
	} else if strings.Contains(path, "Draft") {
		status = "Draft"
	} else if strings.Contains(path, "Thrash") {
		status = "Thrash"
	}

	// Get limit and offset from query params
	limitStr := c.DefaultQuery("limit", "10")
	offsetStr := c.DefaultQuery("offset", "0")

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 {
		limit = 10
	}

	offset, err := strconv.Atoi(offsetStr)
	if err != nil || offset < 0 {
		offset = 0
	}

	var posts []models.Post
	query := config.DB.Where("status = ?", status)

	if err := query.Limit(limit).Offset(offset).Find(&posts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch articles"})
		return
	}

	// Return array directly for frontend compatibility
	c.JSON(http.StatusOK, posts)
}

// GetPostsHandler handles both GET by status and GET by ID
func GetPostsHandler(c *gin.Context) {
	param := c.Param("param")

	// Check if param is a status
	if param == "Publish" || param == "Draft" || param == "Thrash" {
		// Get limit and offset from query params
		limitStr := c.DefaultQuery("limit", "10")
		offsetStr := c.DefaultQuery("offset", "0")

		limit, _ := strconv.Atoi(limitStr)
		if limit < 1 {
			limit = 10
		}

		offset, _ := strconv.Atoi(offsetStr)
		if offset < 0 {
			offset = 0
		}

		var posts []models.Post
		if err := config.DB.Where("status = ?", param).Limit(limit).Offset(offset).Find(&posts).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch articles"})
			return
		}

		c.JSON(http.StatusOK, posts)
		return
	}

	// Otherwise treat as ID
	id, err := strconv.Atoi(param)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid parameter"})
		return
	}

	var post models.Post
	if err := config.DB.First(&post, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
		return
	}

	c.JSON(http.StatusOK, post)
}

// GetPost returns a single article by ID
func GetPost(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid article ID"})
		return
	}

	var post models.Post
	if err := config.DB.First(&post, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": post})
}

// UpdatePost updates an existing article
func UpdatePost(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid article ID"})
		return
	}

	// Check if post exists
	var post models.Post
	if err := config.DB.First(&post, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Article not found", "details": err.Error()})
		return
	}

	var input map[string]interface{}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON format", "details": err.Error()})
		return
	}

	// Build update map with only provided fields
	updates := make(map[string]interface{})

	if title, ok := input["title"].(string); ok {
		updates["title"] = title
	}
	if content, ok := input["content"].(string); ok {
		updates["content"] = content
	}
	if category, ok := input["category"].(string); ok {
		updates["category"] = category
	}
	if status, ok := input["status"].(string); ok {
		validStatuses := map[string]bool{"Publish": true, "Draft": true, "Thrash": true}
		if !validStatuses[status] {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Status must be Publish, Draft, or Thrash"})
			return
		}
		updates["status"] = status
	}

	// Use Updates() instead of Save() to only update specific fields
	if err := config.DB.Model(&post).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update article", "details": err.Error()})
		return
	}

	// Fetch updated post
	config.DB.First(&post, id)
	c.JSON(http.StatusOK, gin.H{"data": post})
}

// DeletePost deletes an article by ID
func DeletePost(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid article ID"})
		return
	}

	var post models.Post
	if err := config.DB.First(&post, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
		return
	}

	if err := config.DB.Delete(&post).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete article"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Article deleted successfully"})
}
