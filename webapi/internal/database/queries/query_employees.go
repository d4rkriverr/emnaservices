package queries

import (
	"database/sql"
	"emnaservices/webapi/internal/database/models"
	"fmt"
)

type QueryEmployees struct {
	db *sql.DB
}

func NewQueryEmployees(db *sql.DB) *QueryEmployees {
	return &QueryEmployees{db: db}
}

func (q *QueryEmployees) GetEmployeesWithMonthlyRecords(recordMonth string) ([]models.Employee, error) {
	query := `
		SELECT
			e.id AS employee_id,
			e.full_name,
			e.phone,
			e.position,
			e.salary,
			e.date_of_hire,
			e.payment_method,
			e.created_at AS employee_created_at,
			m.id AS metrics_id,
			m.record_month,
			m.salary,
			m.total_off_days,
			m.total_absences,
			m.total_advance,
			m.updated_at AS metrics_updated_at
		FROM
			employees_basic_info e
		LEFT JOIN
			employees_monthly_metrics m ON e.id = m.employee_id AND m.record_month = $1
		ORDER BY
			e.id;
	`

	rows, err := q.db.Query(query, recordMonth)
	if err != nil {
		return nil, fmt.Errorf("error executing query: %v", err)
	}
	defer rows.Close()

	var employees []models.Employee

	for rows.Next() {
		var emp models.Employee
		var metrics models.MonthlyMetrics

		// Use nullable types for all columns that might be NULL
		var metricsID sql.NullInt64
		var recordMonthString sql.NullString
		var salary sql.NullFloat64
		var totalOffDays sql.NullInt64
		var totalAbsences sql.NullInt64
		var totalAdvance sql.NullFloat64
		var updatedAt sql.NullTime

		err := rows.Scan(
			&emp.ID,
			&emp.FullName,
			&emp.Phone,
			&emp.Position,
			&emp.Salary,
			&emp.DateOfHire,
			&emp.PaymentMethod,
			&emp.CreatedAt,
			&metricsID,
			&recordMonthString,
			&salary,
			&totalOffDays,
			&totalAbsences,
			&totalAdvance,
			&updatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning row: %v", err)
		}

		// Populate metrics only if metricsID is valid
		if metricsID.Valid {
			metrics.ID = int(metricsID.Int64)
			if recordMonthString.Valid {
				metrics.RecordMonth = recordMonthString.String
			}
			if salary.Valid {
				metrics.Salary = salary.Float64
			}
			if totalOffDays.Valid {
				metrics.TotalOffDays = int(totalOffDays.Int64)
			}
			if totalAbsences.Valid {
				metrics.TotalAbsences = int(totalAbsences.Int64)
			}
			if totalAdvance.Valid {
				metrics.TotalAdvance = totalAdvance.Float64
			}
			if updatedAt.Valid {
				metrics.UpdatedAt = updatedAt.Time
			}
			emp.MonthlyRecord = &metrics
		}

		employees = append(employees, emp)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error after iterating over rows: %v", err)
	}
	return employees, nil
}

func (q *QueryEmployees) CreateEmployee(emp models.Employee) (int, error) {
	query := `
		INSERT INTO employees_basic_info (
			full_name, phone, position, salary, date_of_hire, payment_method, created_at
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id;` // Returning the generated id

	// Execute the query and get the inserted employee's id
	var employeeID int
	err := q.db.QueryRow(query, emp.FullName, emp.Phone, emp.Position, emp.Salary, emp.DateOfHire, emp.PaymentMethod, emp.CreatedAt).
		Scan(&employeeID)
	if err != nil {
		return 0, fmt.Errorf("error inserting employee: %v", err)
	}
	return employeeID, nil
}

func (q *QueryEmployees) CreateMonthlyMetricOrUpdate(empID int, record_month string, salary float64) error {
	query := `
	INSERT INTO employees_monthly_metrics (
		employee_id, record_month, salary, total_off_days, total_absences, total_advance, updated_at
	)
	VALUES 
		($1, $2, $3, 0, 0, 0, NOW())
	ON CONFLICT (employee_id, record_month)
	DO UPDATE SET
		salary = EXCLUDED.salary;
	`

	_, err := q.db.Exec(query, empID, record_month, salary)
	if err != nil {
		return fmt.Errorf("error inserting monthly metrics: %v", err)
	}
	return nil
}

func (q *QueryEmployees) UpdateMonthlyMetric(id int, total_advance float64, total_absences float64) error {
	query := `
	UPDATE employees_monthly_metrics
	SET 
		total_advance =total_advance +  $2,
		total_absences = total_absences + $3
	WHERE
		id = $1;
	`
	_, err := q.db.Exec(query, id, total_advance, total_absences)
	if err != nil {
		return fmt.Errorf("error inserting monthly metrics: %v", err)
	}
	return nil
}
