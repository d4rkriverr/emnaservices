package registry

import (
	"emnaservices/webapi/internal/kernel"
	"emnaservices/webapi/internal/registry/endpoints"
	"emnaservices/webapi/utils"
	"net/http"
)

func BuildAccountService(app *kernel.Application, midd *utils.AuthMiddleware) {
	handler := endpoints.NewAccountHandler(app.QM)
	app.Router.HandleFunc("POST /api/account/auth", handler.HandleUserLogin)
	app.Router.HandleFunc("POST /api/account/info", handler.HandleUserInfo)
	app.Router.HandleFunc("POST /api/account/create", handler.HandleUserCreate)
}

func BuildInvoiceService(app *kernel.Application, midd *utils.AuthMiddleware) {
	// Create our Handler
	handler := endpoints.NewInvoicesHandler(app.QM)

	// Register our service routes
	app.Router.HandleFunc("GET /api/invoices/find", midd.Protect(http.HandlerFunc(handler.HandleFindInvoices)))
	app.Router.HandleFunc("POST /api/invoices/create", midd.Protect(http.HandlerFunc(handler.HandleCreate)))
}

func BuildTransactionService(app *kernel.Application, midd *utils.AuthMiddleware) {
	// Create our Handler
	handler := endpoints.NewTransactionsHandler(app.QM)

	// Register our service routes
	app.Router.HandleFunc("GET /api/expenses/find", midd.Protect(http.HandlerFunc(handler.GetExpansesData)))
	app.Router.HandleFunc("POST /api/expenses/create", midd.Protect(http.HandlerFunc(handler.HandleCreateExpanses)))
}

func BuildEmployeeService(app *kernel.Application, midd *utils.AuthMiddleware) {
	// Create our Handler
	handler := endpoints.NewEmployeesHandler(app.QM)

	// Register our service routes
	app.Router.HandleFunc("GET /api/employees/find", midd.Protect(http.HandlerFunc(handler.GetEmployeesData)))
	app.Router.HandleFunc("POST /api/employees/create", midd.Protect(http.HandlerFunc(handler.CreateEmployee)))
	app.Router.HandleFunc("POST /api/employees/monthly_metric/cu", midd.Protect(http.HandlerFunc(handler.UpdateorCreateMetric)))
	app.Router.HandleFunc("POST /api/employees/monthly_metric/ud", midd.Protect(http.HandlerFunc(handler.UpdateMetric)))

}
