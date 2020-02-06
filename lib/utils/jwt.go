package utils

import (
	"errors"
	"fmt"
	"os"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/zairza-cetb/evential/lib/common"
)

var secretKey []byte

//ValidateToken takes in a jwt token and returns data
func ValidateToken(tokenString string) (common.JSON, error) {
	secretKey = []byte(os.Getenv("JWT_SECRET"))
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return secretKey, nil
	})

	if err != nil {
		return common.JSON{}, err
	}

	if !token.Valid {
		return common.JSON{}, errors.New("invalid token")
	}

	return token.Claims.(jwt.MapClaims), nil
}

//GenerateToken generates a jwt token with userdata
func GenerateToken(data common.JSON) (string, error) {
	date := time.Now().Add(time.Hour * 24 * 7)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user": data,
		"exp": date.Unix(),
	})

	secretKeyString := os.Getenv("JWT_SECRET")

	tokenString, err := token.SignedString([]byte(secretKeyString))
	return tokenString, err
}
