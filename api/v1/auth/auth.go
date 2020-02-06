package auth

import (
	"github.com/gin-gonic/gin"
	"github.com/zairza-cetb/evential/lib/middlewares"
)

//ApplyRoutes applies router to the gin engine
func ApplyRoutes(r *gin.RouterGroup) {
	auth := r.Group("/auth")
	{
		auth.POST("/register", register)
		auth.POST("/login", login)
		auth.GET("/check", middlewares.Authorized, check)
	}
}