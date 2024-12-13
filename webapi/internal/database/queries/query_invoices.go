package queries

import (
	"database/sql"
	"emnaservices/webapi/internal/database/models"
	"fmt"
)

type QueryInvoices struct {
	db *sql.DB
}

func NewQueryInvoices(db *sql.DB) *QueryInvoices {
	return &QueryInvoices{db: db}
}

func (q *QueryInvoices) CreateInvoice(data models.Invoice) (int64, error) {
	var lastInsertId int64
	query := `
		INSERT INTO invoices
		(fullname, phone_number, product_name, product_price, product_payment, advance_payment, agent, issue_date)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;
	`
	err := q.db.QueryRow(query, data.Fullname, data.PhoneNumber, data.ProductName, data.ProductPrice, data.ProductPayment, data.AdvancePayment, data.Agent, data.IssueDate).Scan(&lastInsertId)
	if err != nil {
		return 0, fmt.Errorf("failed to create invoice: %v", err)
	}
	return lastInsertId, nil
}

func (q *QueryInvoices) GetInvoicesBetweenDate(startDate, endDate, fullname, agent string) ([]models.Invoice, error) {
	// Define the SQL query to get invoices between the two dates
	query := `
		SELECT id, fullname, phone_number, product_name, product_price, product_payment, advance_payment, agent, issue_date
		FROM invoices
		WHERE issue_date BETWEEN $1 AND $2 AND fullname ILIKE $3 AND agent ILIKE $4
		ORDER BY id DESC;
	`

	// Prepare a slice to hold the results
	invoices := []models.Invoice{}

	// Query the database
	rows, err := q.db.Query(query, startDate, endDate, "%"+fullname+"%", "%"+agent+"%")
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %v", err)
	}
	defer rows.Close()

	// Loop through the rows and scan each one into the Invoice struct
	for rows.Next() {
		var invoice models.Invoice
		err := rows.Scan(&invoice.Id, &invoice.Fullname, &invoice.PhoneNumber, &invoice.ProductName,
			&invoice.ProductPrice, &invoice.ProductPayment, &invoice.AdvancePayment, &invoice.Agent, &invoice.IssueDate)
		if err != nil {
			return nil, fmt.Errorf("failed to scan row: %v", err)
		}
		invoices = append(invoices, invoice)
	}

	// Check for any error that occurred during iteration
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("row iteration error: %v", err)
	}

	return invoices, nil
}
func (q *QueryInvoices) GetAgentsList() ([]string, error) {
	// Define the SQL query to get invoices between the two dates
	query := `SELECT DISTINCT agent FROM invoices;`

	// Prepare a slice to hold the results
	agents := []string{}

	// Query the database
	rows, err := q.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %v", err)
	}
	defer rows.Close()

	// Loop through the rows and scan each one into the Invoice struct
	for rows.Next() {
		var agent string
		if err := rows.Scan(&agent); err != nil {
			return nil, fmt.Errorf("failed to scan row: %v", err)
		}
		agents = append(agents, agent)
	}

	// Check for any error that occurred during iteration
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("row iteration error: %v", err)
	}

	return agents, nil
}
