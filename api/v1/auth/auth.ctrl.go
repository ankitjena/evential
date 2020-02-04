package auth

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/zairza-cetb/evential/db"
	"github.com/zairza-cetb/evential/db/models"
	"github.com/zairza-cetb/evential/lib/common"
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

//generate jwt token with userdata
func generateToken(data common.JSON) (string, error) {
	date := time.Now().Add(time.Minute * 5)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user": data,
		"exp": date.Unix(),
	})

	secretKeyString := os.Getenv("JWT_SECRET")

	tokenString, err := token.SignedString([]byte(secretKeyString))
	return tokenString, err
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
	token, _ := generateToken(serialized)

	//set cookie
	c.SetCookie("token", token, 60*60*24*7, "/", "", http.SameSiteDefaultMode, false, true)

	c.JSON(200, common.JSON{
		"user": serialized,
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
		c.AbortWithStatus(404)
		return
	}

	//check if the password is correct
	if !checkHash(body.Password, userExists.Password) {
		c.AbortWithStatus(401)
		return
	}

	serialized := userExists.Serialize()
	
	// generate jwt token
	token, _ := generateToken(serialized)

	//set cookie
	c.SetCookie("token", token, 60*60*24*7, "/", "", http.SameSiteDefaultMode, false, true)

	c.JSON(200, common.JSON{
		"user": serialized,
		"token": token,
	})
}

//check will renew token when token life in less than 3 days else return nil
func check(c *gin.Context) {
	// get user stored in the cookie
	userRaw, ok := c.Get("user")
	if !ok {
		c.AbortWithStatus(401)
		return
	}

	user := userRaw.(models.User)

	tokenExpire := int64(c.MustGet("token_expire").(float64))
	now := time.Now().Unix()

	diff := tokenExpire - now

	if diff < 60*60*24*3 {
		//renew token if expires in less than 3 days
		token, _ := generateToken(user.Serialize())
		c.SetCookie("token", token, 60*60*24*7, "/", "", http.SameSiteDefaultMode, false, true)
		c.JSON(200, common.JSON{
			"token": token,
			"user": user.Serialize(),
		})
		return
	}

	c.JSON(200, common.JSON{
		"token": nil,
		"user": user.Serialize(),
	})
}