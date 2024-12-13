package queries

import (
	"crypto/md5"
	"database/sql"
	"emnaservices/webapi/internal/database/models"
	"encoding/hex"
	"errors"
	"fmt"
	"time"
)

type QueryAccounts struct {
	db *sql.DB
}

func NewQueryAccounts(db *sql.DB) *QueryAccounts {
	return &QueryAccounts{db: db}
}

func (q *QueryAccounts) CreateAccount(username, password string) error {
	query := `INSERT INTO accounts (username, password, authorizations) VALUES ($1, $2, $3)`
	_, err := q.db.Exec(query, username, password, "1111", "", time.Now())
	if err != nil {
		return fmt.Errorf("failed to create account: %v", err)
	}
	return nil
}
func (q *QueryAccounts) GetOneByToken(token string) (models.Account, error) {
	var acc models.Account
	query := "SELECT * FROM accounts WHERE access_token = $1"
	err := q.db.QueryRow(query, token).Scan(&acc.ID, &acc.Username, &acc.Password, &acc.Authorizations, &acc.AccessToken, &acc.ExpiredAt)
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
func (q *QueryAccounts) GetOneByUsername(username string) (models.Account, error) {
	var acc models.Account
	query := "SELECT * FROM accounts WHERE username = $1"
	err := q.db.QueryRow(query, username).Scan(&acc.ID, &acc.Username, &acc.Password, &acc.Authorizations, &acc.AccessToken, &acc.ExpiredAt)
	if err == sql.ErrNoRows {
		return acc, errors.New("user not found")
	} else if err != nil {
		return acc, err
	}
	return acc, nil
}
func (q *QueryAccounts) UpdateAccessToken(acc *models.Account) error {
	data := fmt.Sprintf("%d-%s", acc.ID, time.Now().Format(time.RFC3339Nano))
	md5p := md5.New()
	md5p.Write([]byte(data))
	acc.AccessToken = hex.EncodeToString(md5p.Sum(nil))
	acc.ExpiredAt = time.Now().Add(3 * time.Hour)
	query := "UPDATE accounts SET access_token = $1, expired_at= $2 WHERE id = $3"
	if _, err := q.db.Exec(query, acc.AccessToken, acc.ExpiredAt, acc.ID); err != nil {
		return err
	}
	return nil
}
