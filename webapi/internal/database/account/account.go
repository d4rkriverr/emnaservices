package account

import (
	"crypto/md5"
	"database/sql"
	"encoding/hex"
	"errors"
	"fmt"
	"time"
)

func (Account) CreateTable() string {
	return `
		CREATE TABLE accounts (
			id            	SERIAL PRIMARY KEY,
			username      	VARCHAR(255) NOT NULL,
			password      	VARCHAR(255) NOT NULL,
			authorizations	VARCHAR(255) NOT NULL,
			access_token  	VARCHAR(255) NOT NULL,
			expired_at    	TIMESTAMP NOT NULL
		);`
}

func CreateAccount(db *sql.DB, username, password string) error {
	query := `INSERT INTO accounts (username, password, authorizations) VALUES ($1, $2, $3)`
	_, err := db.Exec(query, username, password, "1111", "", time.Now())
	if err != nil {
		return fmt.Errorf("failed to create account: %v", err)
	}
	return nil
}
func GetOneByToken(db *sql.DB, token string) (Account, error) {
	var acc Account
	query := "SELECT * FROM accounts WHERE access_token = $1"
	err := db.QueryRow(query, token).Scan(&acc.ID, &acc.Username, &acc.Password, &acc.Authorizations, &acc.AccessToken, &acc.ExpiredAt)
	if err == sql.ErrNoRows {
		return acc, errors.New("user not found")
	} else if err != nil {
		return acc, err
	}
	if time.Now().After(acc.ExpiredAt) {
		return acc, errors.New("token expired")
	}
	return acc, nil
}
func GetOneByUsername(db *sql.DB, username string) (Account, error) {
	var acc Account
	query := "SELECT * FROM accounts WHERE username = $1"
	err := db.QueryRow(query, username).Scan(&acc.ID, &acc.Username, &acc.Password, &acc.Authorizations, &acc.AccessToken, &acc.ExpiredAt)
	if err == sql.ErrNoRows {
		return acc, errors.New("user not found")
	} else if err != nil {
		return acc, err
	}
	return acc, nil
}
func UpdateAccessToken(db *sql.DB, acc *Account) error {
	data := fmt.Sprintf("%d-%s", acc.ID, time.Now().Format(time.RFC3339Nano))
	md5p := md5.New()
	md5p.Write([]byte(data))
	acc.AccessToken = hex.EncodeToString(md5p.Sum(nil))
	acc.ExpiredAt = time.Now().Add(3 * time.Hour)
	query := "UPDATE accounts SET access_token = $1, expired_at= $2 WHERE id = $3"
	if _, err := db.Exec(query, acc.AccessToken, acc.ExpiredAt, acc.ID); err != nil {
		return err
	}
	return nil
}
