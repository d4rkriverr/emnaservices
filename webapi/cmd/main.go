package main

import (
	"emnaservices/webapi/internal/kernel"
	"emnaservices/webapi/registry/accounts"
	"emnaservices/webapi/registry/expenses"
	"emnaservices/webapi/registry/invoices"
	"emnaservices/webapi/utils"
	"log"

	"github.com/joho/godotenv"
)

func init() {
	if err := godotenv.Load(); err != nil {
		panic("No .env file found")
	}
}

func main() {
	app, err := kernel.Boot()
	if err != nil {
		log.Fatalf("[X] - Cannot boot: %v", err)
	}

	// auth middleware
	authMidd := utils.NewAuthMiddleware(app.Database)

	accounts.BuildAccountService(app, authMidd)
	expenses.BuildExpenseService(app, authMidd)
	invoices.BuildInvoiceService(app, authMidd)
	// calllog.BuildCallsService(app)

	go app.Run()
	kernel.WaitForShutdown(app)
}
