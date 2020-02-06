package main

import (
	"log"
	"os"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"github.com/zairza-cetb/evential/api"
	"github.com/zairza-cetb/evential/db"
)

func main() {
	// Load env variables
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	//Get mongo url from env
	mongoURL := os.Getenv("MONGO_URL")
	port := os.Getenv("PORT")
	
	db.Connect(mongoURL)

	defer db.Disconnect()
	
	app := gin.Default()
	app.Use(static.Serve("/", static.LocalFile("./client/build", true)))
	api.ApplyRoutes(app)
	
	app.Run(":" + port)
}