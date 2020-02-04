package models

import (
	"time"

	"github.com/zairza-cetb/evential/lib/common"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

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

func (u *User) Read(m common.JSON) {
	u.ID = m["_id"].(primitive.ObjectID)
	u.Username = m["username"].(string)
	u.Name = m["name"].(string)
}