package accounts

import (
	"emnaservices/webapi/internal/kernel"
	"emnaservices/webapi/utils"
)

func BuildAccountService(app *kernel.Application, midd *utils.AuthMiddleware) {

	handler := newHandler(app.Database)

	app.Router.HandleFunc("POST /api/account/auth", handler.HandleUserLogin)
	app.Router.HandleFunc("POST /api/account/info", handler.HandleUserInfo)
	app.Router.HandleFunc("POST /api/account/create", handler.HandleUserCreate)

	// app.Router.HandleFunc("GET /api/v2/account/info", midd.Protect(http.HandlerFunc(handler.HandleUserInfo)))
}
