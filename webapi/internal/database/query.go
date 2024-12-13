package database

import (
	"database/sql"
	"emnaservices/webapi/internal/database/queries"
)

type QueriesManager struct {
	Employees    *queries.QueryEmployees
	Invoices     *queries.QueryInvoices
	Transactions *queries.QueryTransactions
	Accounts     *queries.QueryAccounts
}

func NewQueriesManager(db *sql.DB) *QueriesManager {
	return &QueriesManager{
		Employees:    queries.NewQueryEmployees(db),
		Invoices:     queries.NewQueryInvoices(db),
		Transactions: queries.NewQueryTransactions(db),
		Accounts:     queries.NewQueryAccounts(db),
	}
}
