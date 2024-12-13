package queries

import (
	"database/sql"
	"emnaservices/webapi/internal/database/models"
	"fmt"
)

type QueryTransactions struct {
	db *sql.DB
}

func NewQueryTransactions(db *sql.DB) *QueryTransactions {
	return &QueryTransactions{db: db}
}

func (s *QueryTransactions) GetExpensesWithRange(from, to string) (map[string]any, error) {
	var activities = []string{"office supplies", "staff", "cancelation", "transportation", "sponsoring", "rent", "private expenses"}
	var paymentMethods = []string{"Credit Card", "Cash", "Bank Transfer"}

	query := `
		SELECT id, description, activity, total_cost, payment_method, agent, status, issue_date
		FROM transactions
		WHERE issue_date BETWEEN $1 AND $2
		ORDER BY issue_date DESC;
	`
	rows, err := s.db.Query(query, from, to)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var transactions = []models.Transaction{}
	for rows.Next() {
		var txn models.Transaction
		err := rows.Scan(&txn.ID, &txn.Description, &txn.Activity, &txn.TotalCost, &txn.PaymentMethod, &txn.Agent, &txn.Status, &txn.IssueDate)
		if err != nil {
			return nil, err
		}
		transactions = append(transactions, txn)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	data := map[string]any{"invoices": transactions, "activities": activities, "payMethod": paymentMethods}
	return data, nil
}
func (q *QueryTransactions) CreateTransaction(trans models.Transaction) error {
	query := `
		INSERT INTO transactions (description, activity, total_cost, payment_method, agent, status, issue_date)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id;
	`
	_, err := q.db.Exec(query,
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
