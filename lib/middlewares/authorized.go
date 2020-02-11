package middlewares

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/zairza-cetb/evential/lib/utils"
)

// Authorized blocks unauthorized requests
func Authorized(c *gin.Context) {
	authorization := c.Request.Header.Get("Authorization")
	if authorization == "" {
		c.AbortWithStatus(401)
		return
	}

	sp := strings.Split(authorization, "Bearer ")
	// invalid token
	if len(sp) < 1 {
		c.AbortWithStatus(500)
		return
	}
	tokenString := sp[1]

	_, err := utils.ValidateToken(tokenString)
	if err != nil {
		c.AbortWithStatus(401)
		return
	}

	c.Next()
}
