package expenses

import (
	"database/sql"
	"emnaservices/webapi/internal/database/transaction"
	"emnaservices/webapi/internal/kernel"
)

type Service struct {
	db *sql.DB
}

func NewService(app *kernel.Application) *Service {
	return &Service{
		db: app.Database,
	}
}

func (s *Service) GetExpensesWithRange(from, to string) (map[string]any, error) {
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

	var transactions = []transaction.Transaction{}
	for rows.Next() {
		var txn transaction.Transaction
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

func (s *Service) CreateExpansesInvoice() error {
	return nil
}
