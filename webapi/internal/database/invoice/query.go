package invoice

import (
	"database/sql"
	"fmt"
)

func CreateInvoice(db *sql.DB, data Invoice) (int64, error) {
	var lastInsertId int64
	query := `
		INSERT INTO invoices
		(fullname, phone_number, product_name, product_price, product_discount, advance_payment, agent, issue_date)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;
	`
	err := db.QueryRow(query, data.Fullname, data.PhoneNumber, data.ProductName, data.ProductPrice, data.ProductDiscount, data.AdvancePayment, data.Agent, data.IssueDate).Scan(&lastInsertId)
	if err != nil {
		return 0, fmt.Errorf("failed to create invoice: %v", err)
	}
	return lastInsertId, nil
	// return id, nil
}
func GetInvoicesBetweenDate(db *sql.DB, startDate, endDate, fullname string) ([]Invoice, error) {
	// Define the SQL query to get invoices between the two dates
	query := `
		SELECT id, fullname, phone_number, product_name, product_price, product_discount, advance_payment, agent, issue_date
		FROM invoices
		WHERE issue_date BETWEEN $1 AND $2 AND fullname ILIKE $3
		ORDER BY id DESC;
	`

	// Prepare a slice to hold the results
	invoices := []Invoice{}

	// Query the database
	rows, err := db.Query(query, startDate, endDate, "%"+fullname+"%")
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %v", err)
	}
	defer rows.Close()

	// Loop through the rows and scan each one into the Invoice struct
	for rows.Next() {
		var invoice Invoice
		err := rows.Scan(&invoice.Id, &invoice.Fullname, &invoice.PhoneNumber, &invoice.ProductName,
			&invoice.ProductPrice, &invoice.ProductDiscount, &invoice.AdvancePayment, &invoice.Agent, &invoice.IssueDate)
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
