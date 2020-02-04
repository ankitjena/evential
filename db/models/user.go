package models

import (
	"time"

	"github.com/zairza-cetb/evential/lib/common"
)

// User model
type User struct {
	ID string `json:"_id"`
	Username string `json:"username"`
	Name string `json:"name"`
	Email string `json:"email"`
	Phone string `json:"phone"`
	Password string `json:"password"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (u *User) Read(m common.JSON) {
	u.ID = m["_id"].(string)
	u.Username = m["username"].(string)
	u.Name = m["name"].(string)
}

// Serialize serializes user data
func (u *User) Serialize() common.JSON {
	return common.JSON{
		"_id": u.ID,
		"username": u.Username,
		"name": u.Name,
	}
}