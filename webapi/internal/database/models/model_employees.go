package models

import "time"

// Employee represents the basic info of an employee
type Employee struct {
	ID            int             `json:"id"`
	FullName      string          `json:"full_name"`
	Phone         string          `json:"phone"`
	Position      string          `json:"position"`
	Salary        float64         `json:"salary"`
	DateOfHire    string          `json:"date_of_hire"`
	PaymentMethod string          `json:"payment_method"`
	CreatedAt     time.Time       `json:"created_at"`
	MonthlyRecord *MonthlyMetrics `json:"monthly_record,omitempty"`
}

// MonthlyMetrics represents the monthly records for an employee
type MonthlyMetrics struct {
	ID            int       `json:"id"`
	RecordMonth   string    `json:"record_month"`
	Salary        float64   `json:"salary"`
	TotalOffDays  int       `json:"total_off_days"`
	TotalAbsences int       `json:"total_absences"`
	TotalAdvance  float64   `json:"total_advance"`
	UpdatedAt     time.Time `json:"updated_at"`
}
