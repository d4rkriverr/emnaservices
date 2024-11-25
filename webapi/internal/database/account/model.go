package account

import "time"

type Account struct {
	ID             int       `json:"id"`
	Username       string    `json:"username"`
	Password       string    `json:"password"`
	Authorizations string    `json:"authorizations"`
	AccessToken    string    `json:"access_token"`
	ExpiredAt      time.Time `json:"expired_at"`
}
