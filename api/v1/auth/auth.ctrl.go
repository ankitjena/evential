package auth

import (
	"context"
	"github.com/gin-gonic/gin"
	"time"
	"golang.org/x/crypto/bcrypt"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/bson"
	"log"
	"github.com/zairza-cetb/evential/db/models"
	"github.com/zairza-cetb/evential/db"
)

//hash takes in a password and returns a hash string
func hash(pwd string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(pwd), bcrypt.MinCost)
	return string(hash), err
}

//register controller for the /auth/register route
func register(c *gin.Context) {
	var body models.User

	//define context for timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	
	//instantiate user collection
	userDB := db.GetUserDB()

	//get request data into a object
	if err := c.BindJSON(&body); err != nil {
		c.AbortWithStatus(400)
		return
	}

	body.ID = primitive.NewObjectID()

	//hash password
	hash, hashError := hash(body.Password)
	if hashError != nil {
		c.AbortWithStatus(500)
		return
	}
	body.Password = hash

	body.CreatedAt = time.Now()
	body.UpdatedAt = time.Now()

	//check if user exists
	var userExists models.User
	err := userDB.FindOne(ctx, bson.M{"username": body.Username}).Decode(&userExists)
	if err == nil {
		c.AbortWithStatus(204)
		return
	}

	//insert the user
	res, err := userDB.InsertOne(ctx, body)
	if err != nil {
		log.Println(err)
		c.AbortWithStatus(500)
		return
	}

	c.JSON(200, res)
}