package endpoints

import (
	"emnaservices/webapi/internal/database"
	"emnaservices/webapi/internal/database/models"
	"emnaservices/webapi/utils"
	"encoding/json"
	"fmt"
	"net/http"
)

type EmployeesHandler struct {
	QM *database.QueriesManager
}

func NewEmployeesHandler(q *database.QueriesManager) *EmployeesHandler {
	return &EmployeesHandler{QM: q}
}

func (h *EmployeesHandler) GetEmployeesData(w http.ResponseWriter, r *http.Request) {
	// GET SELECTED DATE
	date := r.URL.Query().Get("d")
	// CALL THE API
	emps := []models.Employee{}
	emps, err := h.QM.Employees.GetEmployeesWithMonthlyRecords(date)
	if err != nil {
		fmt.Println(err)
		utils.RespondWithError(w, http.StatusBadRequest, "Cannot get employees")
		return
	}
	// RETURN RESULT
	utils.RespondWithSuccess(w, emps)
}

func (h *EmployeesHandler) CreateEmployee(w http.ResponseWriter, r *http.Request) {
	var payload models.Employee
	var insertedId int
	var err error
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}
	if insertedId, err = h.QM.Employees.CreateEmployee(payload); err != nil {
		fmt.Println(err)
		utils.RespondWithError(w, http.StatusBadRequest, "cannot create employee")
		return
	}
	utils.RespondWithSuccess(w, insertedId)
}

func (h *EmployeesHandler) UpdateorCreateMetric(w http.ResponseWriter, r *http.Request) {
	date := r.URL.Query().Get("d")
	var payload []struct {
		ID     int     `json:"id"`
		Salary float64 `json:"salary"`
	}
	var insertedId int
	var err error
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}
	for _, v := range payload {
		if err = h.QM.Employees.CreateMonthlyMetricOrUpdate(v.ID, date, v.Salary); err != nil {
			fmt.Println(err)
			utils.RespondWithError(w, http.StatusBadRequest, "cannot create metric")
			return
		}
	}

	utils.RespondWithSuccess(w, insertedId)
}

func (h *EmployeesHandler) UpdateMetric(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		ID            int     `json:"metric_id"`
		TotalAbsences float64 `json:"total_absences"`
		TotalAdvance  float64 `json:"total_advances"`
	}
	var err error
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	if err = h.QM.Employees.UpdateMonthlyMetric(payload.ID, payload.TotalAdvance, payload.TotalAbsences); err != nil {
		fmt.Println(err)
		utils.RespondWithError(w, http.StatusBadRequest, "cannot create metric")
		return
	}

	utils.RespondWithSuccess(w, 0)
}
