package accounts

import (
	"crypto/sha256"
	"database/sql"
	"emnaservices/webapi/internal/database/account"
	"emnaservices/webapi/utils"
	"encoding/hex"
	"net/http"
	"fmt"
)

type Handler struct {
	db *sql.DB
}

func newHandler(db *sql.DB) *Handler {
	return &Handler{db: db}
}

type UserCredentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func (h *Handler) HandleUserLogin(w http.ResponseWriter, r *http.Request) {
	var creds UserCredentials
	var acc account.Account
	var err error

	if creds, err = utils.BodyParser[UserCredentials](r.Body); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}
	// CHECK IF THE USERNAME CORRECT
	if acc, err = account.GetOneByUsername(h.db, creds.Username); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}
	// CHECK IF THE PASSOWRD CORRECT
	sha2 := sha256.New()
	sha2.Write([]byte(creds.Password))
	if hex.EncodeToString(sha2.Sum(nil)) != acc.Password {
		utils.RespondWithError(w, http.StatusBadRequest, "invalid credentials")
		return
	}

	// STORE THE ACCESS TOKEN
	if err = account.UpdateAccessToken(h.db, &acc); err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to get token")
		return
	}
	utils.RespondWithSuccess(w, acc.AccessToken)
}

func (h *Handler) HandleUserInfo(w http.ResponseWriter, r *http.Request) {
	var acc account.Account
	var token string
	var err error
	if token, err = utils.GetAuthorizationToken(r); err != nil {
		utils.RespondWithError(w, http.StatusUnauthorized, "Invalid Authorization")
		return
	}
	if acc, err = account.GetOneByToken(h.db, token); err != nil {
		utils.RespondWithError(w, http.StatusUnauthorized, "Invalid Authorization")
		return
	}
	utils.RespondWithSuccess(w, map[string]any{"username": acc.Username, "role": acc.Authorizations})
}

func (h *Handler) HandleUserCreate(w http.ResponseWriter, r *http.Request) {
	var creds UserCredentials
	var err error
	if creds, err = utils.BodyParser[UserCredentials](r.Body); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}
	sha2 := sha256.New()
	sha2.Write([]byte(creds.Password))
	hashedPassword := hex.EncodeToString(sha2.Sum(nil))
	fmt.Println(hashedPassword)
	if err = account.CreateAccount(h.db, creds.Username, hashedPassword); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "cannot create account")
		return
	}
	utils.RespondWithSuccess(w, "created successfully")
}
