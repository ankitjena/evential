package main

import (
	"net/http"
	"os"
	"log"

	"github.com/gin-gonic/contrib/static"
	"github.com/joho/godotenv"
	"github.com/gin-gonic/gin"

	"github.com/zairza-cetb/evential/db"
)

var mongoURL string

func init() {
	// Load env variables
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	//Get mongo url from env
	mongoURL = os.Getenv("MONGO_URL")
	
	db.Connect(mongoURL)
}

func main() {
	// Set the router as the default one shipped with Gin
	router := gin.Default()

	// Serve frontend static files
	router.Use(static.Serve("/", static.LocalFile("./client/build", true)))

	// Setup route group for the API
	api := router.Group("/v1/api")
	{
		api.GET("/", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"message": "pong",
			})
		})
	}

	// Start and run the server
	router.Run(":5000")
}