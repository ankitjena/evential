package models

import "go.mongodb.org/mongo-driver/bson/primitive"

import "time"

// User model
type User struct {
	ID primitive.ObjectID `bson:"_id"`
	Username string `json:"username"`
	Name string `json:"name"`
	Email string `json:"email"`
	Phone string `json:"phone"`
	Password string `json:"password"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}