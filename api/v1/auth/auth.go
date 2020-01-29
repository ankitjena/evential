package auth

import (
	"github.com/gin-gonic/gin"
)

//ApplyRoutes applies router to the gin engine
func ApplyRoutes(r *gin.RouterGroup) {
	auth := r.Group("/auth")
	{
		auth.POST("/register", register)
	}
}