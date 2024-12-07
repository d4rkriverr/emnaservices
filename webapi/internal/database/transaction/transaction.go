package transaction

import (
	"database/sql"
	"fmt"
)

func CreateTransaction(db *sql.DB, trans Transaction) error {
	query := `
		INSERT INTO transactions (description, activity, total_cost, payment_method, agent, status, issue_date)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id;
	`
	_, err := db.Exec(query,
		trans.Description,
		trans.Activity,
		trans.TotalCost,
		trans.PaymentMethod,
		trans.Agent,
		trans.Status,
		trans.IssueDate)
	if err != nil {
		return fmt.Errorf("failed to create account: %v", err)
	}
	return nil

}
