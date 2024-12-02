package invoices

import (
	"emnaservices/webapi/internal/kernel"
	"emnaservices/webapi/utils"
	"net/http"
)

func BuildInvoiceService(app *kernel.Application, midd *utils.AuthMiddleware) {
	// Create our Handler
	handler := newHandler(app.Database)

	// Register our service routes
	app.Router.HandleFunc("GET /api/invoices/find", midd.Protect(http.HandlerFunc(handler.HandleFindInvoices)))
	app.Router.HandleFunc("POST /api/invoices/create", midd.Protect(http.HandlerFunc(handler.HandleCreate)))

	// app.Router.HandleFunc("GET /api/invoices/find", midd.Protect(http.HandlerFunc(handler.GetExpansesData)))
	// app.Router.HandleFunc("POST /api/expenses/auth", handler.HandleUserLogin)

}
