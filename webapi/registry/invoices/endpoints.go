package invoices

import (
	"database/sql"
	"emnaservices/webapi/internal/database/invoice"
	"emnaservices/webapi/utils"
	"fmt"
	"net/http"
)

type Handler struct {
	db *sql.DB
}

func newHandler(db *sql.DB) *Handler {
	return &Handler{db: db}
}

type InvoiceCreateDTO struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func (h *Handler) HandleCreate(w http.ResponseWriter, r *http.Request) {
	var payload invoice.Invoice
	var insertedId int64
	var err error

	if payload, err = utils.BodyParser[invoice.Invoice](r.Body); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}
	if insertedId, err = invoice.CreateInvoice(h.db, payload); err != nil {
		fmt.Println(err)
		utils.RespondWithError(w, http.StatusBadRequest, "cannot create invoice")
		return
	}
	utils.RespondWithSuccess(w, insertedId)
}
func (h *Handler) HandleFindInvoices(w http.ResponseWriter, r *http.Request) {
	// Get the 'start' and 'end' parameters from the URL query
	startDate := r.URL.Query().Get("start")
	endDate := r.URL.Query().Get("end")
	fullname := r.URL.Query().Get("val")

	// Validate the dates
	if startDate == "" || endDate == "" {
		utils.RespondWithError(w, http.StatusBadRequest, "Start and end dates must be provided")
		return
	}

	invoices, err := invoice.GetInvoicesBetweenDate(h.db, startDate, endDate, fullname)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Error fetching invoices: %v", err))
		return
	}
	utils.RespondWithSuccess(w, invoices)
}
