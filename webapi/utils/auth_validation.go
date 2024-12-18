package utils

import (
	"context"
	"emnaservices/webapi/internal/database"
	"fmt"
	"net/http"
	"strings"
)

type AuthedUser struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Role     string `json:"role"`
}

type key int

const UserContextKey key = iota

type AuthMiddleware struct {
	QM *database.QueriesManager
}

func NewAuthMiddleware(q *database.QueriesManager) *AuthMiddleware {
	return &AuthMiddleware{
		QM: q,
	}
}

func (s *AuthMiddleware) Protect(next http.Handler) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if token, err := GetAuthorizationToken(r); err == nil {
			if acc, err := s.QM.Accounts.GetOneByToken(token); err == nil {
				ctx := context.WithValue(r.Context(), UserContextKey, acc)
				next.ServeHTTP(w, r.WithContext(ctx))
				return
			}
		}
		RespondWithError(w, http.StatusUnauthorized, "Invalid Authorization")
	})
}

func GetAuthorizationToken(r *http.Request) (string, error) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return "", fmt.Errorf("Missing Authorization header")
	}
	tokenParts := strings.Split(authHeader, " ")
	if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
		return "", fmt.Errorf("Invalid Authorization format")
	}
	return tokenParts[1], nil
}
