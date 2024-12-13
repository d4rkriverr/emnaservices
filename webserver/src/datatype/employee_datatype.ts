// EmployeeBasicInfo represents the basic information of an employee
export interface EmployeeBasicInfo {
  id: number; // Employee ID (Primary Key)
  full_name: string; // Employee's full name
  phone: string; // Employee's phone number
  position: string; // Job position
  salary: number; // Employee's salary
  date_of_hire: string; // Date the employee was hired
  payment_method: string; // Payment method (restricted to 'Bank' or 'Cash')
  createdAt: Date; // Record creation date
}

// EmployeeMonthlyMetrics represents the monthly metrics for an employee
export interface EmployeeMonthlyMetrics {
  id: number; // Primary Key for this table
  employeeId: number; // Foreign Key: references EmployeeBasicInfo
  recordMonth: Date; // The month for which metrics are recorded
  salary: number; // Employee's salary
  totalOffDays: number; // Total off days in the month
  total_absences: number; // Total absences in the month
  total_advance: number; // Total advance payment for the month
  updatedAt: Date; // Last updated timestamp
}

// Combined model to represent an employee with their monthly metrics
export interface EmployeeWithMonthlyMetrics extends EmployeeBasicInfo {
  monthly_record?: EmployeeMonthlyMetrics; // Optional field for monthly metrics
}
