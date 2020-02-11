package auth

import (
	"context"
	"log"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/zairza-cetb/evential/db"

	"github.com/zairza-cetb/evential/db/models"
	"github.com/zairza-cetb/evential/lib/common"
	"github.com/zairza-cetb/evential/lib/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

//hash takes in a password and returns a hash string
func hash(pwd string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(pwd), bcrypt.MinCost)
	return string(hash), err
}

//compare password hash
func checkHash(password string, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

//register controller for the /auth/register route
func register(c *gin.Context) {
	var user models.User

	//define context for timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	//instantiate user collection
	userDB := db.GetUserDB()

	//get request data into a object
	if err := c.BindJSON(&user); err != nil {
		c.AbortWithStatus(400)
		return
	}

	user.ID = primitive.NewObjectID().Hex()

	//hash password
	hash, hashError := hash(user.Password)
	if hashError != nil {
		c.AbortWithStatus(500)
		return
	}
	user.Password = hash

	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()

	//check if user exists
	var userExists models.User
	err := userDB.FindOne(ctx, bson.M{"username": user.Username}).Decode(&userExists)
	if err == nil {
		c.AbortWithStatus(204)
		return
	}

	//insert the user
	_, err = userDB.InsertOne(ctx, user)
	if err != nil {
		log.Println(err)
		c.AbortWithStatus(500)
		return
	}

	serialized := user.Serialize()

	//generate jwt token
	token, _ := utils.GenerateToken(serialized)

	c.JSON(200, common.JSON{
		"user":  serialized,
		"token": token,
	})
}

func login(c *gin.Context) {
	userDB := db.GetUserDB()

	//define context for timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	type RequestBody struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	//bind request body
	var body RequestBody
	if err := c.BindJSON(&body); err != nil {
		c.AbortWithStatus(400)
		return
	}

	//check if the user exists
	var userExists models.User
	err := userDB.FindOne(ctx, bson.M{"username": body.Username}).Decode(&userExists)
	if err != nil {
		c.JSON(404, common.JSON{})
		return
	}

	//check if the password is correct
	if !checkHash(body.Password, userExists.Password) {
		c.JSON(401, common.JSON{
			"error": "Unauthorized",
		})
		return
	}

	serialized := userExists.Serialize()

	// generate jwt token
	token, _ := utils.GenerateToken(serialized)

	c.JSON(200, common.JSON{
		"user":  serialized,
		"token": token,
	})
}

//check will renew token when token life in less than 3 days else return nil
func check(c *gin.Context) {
	authorization := c.Request.Header.Get("Authorization")
	sp := strings.Split(authorization, "Bearer ")
	tokenString := sp[1]

	tokenData, _ := utils.ValidateToken(tokenString)

	var user models.User
	user.Read(tokenData["user"].(common.JSON))

	tokenExpire := tokenData["exp"].(float64)
	now := time.Now().Unix()
	diff := int64(tokenExpire) - now
	//renew token
	if diff < 60*4 {
		tokenString, _ = utils.GenerateToken(user.Serialize())
	}

	c.JSON(200, common.JSON{
		"token": tokenString,
		"user":  user.Serialize(),
	})
}
