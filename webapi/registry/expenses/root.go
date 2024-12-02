package expenses

import (
	"emnaservices/webapi/internal/kernel"
	"emnaservices/webapi/utils"
	"net/http"
)

func BuildExpenseService(app *kernel.Application, midd *utils.AuthMiddleware) {
	// Create our Handler
	handler := newHandler(NewService(app))

	// Register our service routes
	app.Router.HandleFunc("GET /api/expenses/find", midd.Protect(http.HandlerFunc(handler.GetExpansesData)))
	app.Router.HandleFunc("POST /api/expenses/create", midd.Protect(http.HandlerFunc(handler.HandleCreateExpanses)))
}
