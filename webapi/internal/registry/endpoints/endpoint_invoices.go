package endpoints

import (
	"emnaservices/webapi/internal/database"
	"emnaservices/webapi/internal/database/models"
	"emnaservices/webapi/utils"
	"fmt"
	"net/http"
)

type InvoicesHandler struct {
	QM *database.QueriesManager
}

func NewInvoicesHandler(q *database.QueriesManager) *InvoicesHandler {
	return &InvoicesHandler{QM: q}
}

func (h *InvoicesHandler) HandleCreate(w http.ResponseWriter, r *http.Request) {
	var payload models.Invoice
	var insertedId int64
	var err error

	if payload, err = utils.BodyParser[models.Invoice](r.Body); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}
	if insertedId, err = h.QM.Invoices.CreateInvoice(payload); err != nil {
		fmt.Println(err)
		utils.RespondWithError(w, http.StatusBadRequest, "cannot create invoice")
		return
	}
	utils.RespondWithSuccess(w, insertedId)
}

func (h *InvoicesHandler) HandleFindInvoices(w http.ResponseWriter, r *http.Request) {
	// Get the 'start' and 'end' parameters from the URL query
	startDate := r.URL.Query().Get("start")
	endDate := r.URL.Query().Get("end")
	fullname := r.URL.Query().Get("val")
	agent := r.URL.Query().Get("agent")

	// Validate the dates
	if startDate == "" || endDate == "" {
		utils.RespondWithError(w, http.StatusBadRequest, "Start and end dates must be provided")
		return
	}

	invoices, err := h.QM.Invoices.GetInvoicesBetweenDate(startDate, endDate, fullname, agent)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Error fetching invoices: %v", err))
		return
	}

	agents, err := h.QM.Invoices.GetAgentsList()
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Error fetching invoices: %v", err))
		return
	}
	utils.RespondWithSuccess(w, map[string]any{"invoices": invoices, "agents": agents})
}
