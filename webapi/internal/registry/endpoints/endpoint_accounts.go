package endpoints

import (
	"crypto/sha256"
	"emnaservices/webapi/internal/database"
	"emnaservices/webapi/internal/database/models"
	"emnaservices/webapi/utils"
	"encoding/hex"
	"fmt"
	"net/http"
)

type AccountHandler struct {
	QueriesManager *database.QueriesManager
}

func NewAccountHandler(q *database.QueriesManager) *AccountHandler {
	return &AccountHandler{QueriesManager: q}
}

type UserCredentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func (h *AccountHandler) HandleUserLogin(w http.ResponseWriter, r *http.Request) {
	var creds UserCredentials
	var acc models.Account
	var err error

	if creds, err = utils.BodyParser[UserCredentials](r.Body); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}
	// CHECK IF THE USERNAME CORRECT
	if acc, err = h.QueriesManager.Accounts.GetOneByUsername(creds.Username); err != nil {
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
	if err = h.QueriesManager.Accounts.UpdateAccessToken(&acc); err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to get token")
		return
	}
	utils.RespondWithSuccess(w, acc.AccessToken)
}

func (h *AccountHandler) HandleUserInfo(w http.ResponseWriter, r *http.Request) {
	var acc models.Account
	var token string
	var err error
	if token, err = utils.GetAuthorizationToken(r); err != nil {
		utils.RespondWithError(w, http.StatusUnauthorized, "Invalid Authorization")
		return
	}
	if acc, err = h.QueriesManager.Accounts.GetOneByToken(token); err != nil {
		utils.RespondWithError(w, http.StatusUnauthorized, "Invalid Authorization")
		return
	}
	utils.RespondWithSuccess(w, map[string]any{"username": acc.Username, "role": acc.Authorizations})
}

func (h *AccountHandler) HandleUserCreate(w http.ResponseWriter, r *http.Request) {
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
	if err = h.QueriesManager.Accounts.CreateAccount(creds.Username, hashedPassword); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "cannot create account")
		return
	}
	utils.RespondWithSuccess(w, "created successfully")
}
