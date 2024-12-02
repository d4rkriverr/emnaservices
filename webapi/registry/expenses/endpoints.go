package expenses

import (
	"emnaservices/webapi/internal/database/transaction"
	"emnaservices/webapi/utils"
	"encoding/json"
	"net/http"
	"fmt"
)

type Handler struct {
	service *Service
}

func newHandler(s *Service) *Handler {
	return &Handler{service: s}
}

func (h *Handler) GetExpansesData(w http.ResponseWriter, r *http.Request) {
	date_from := r.URL.Query().Get("from")
	date_to := r.URL.Query().Get("to")

	data, err := h.service.GetExpensesWithRange(date_from, date_to)
	if err != nil {
		fmt.Println(err)
		utils.RespondWithError(w, 400, err.Error())
		return
	}
	utils.RespondWithSuccess(w, data)
}

func (h *Handler) HandleCreateExpanses(w http.ResponseWriter, r *http.Request) {
	var newInvoice transaction.Transaction
	err := json.NewDecoder(r.Body).Decode(&newInvoice)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}
	if err := transaction.CreateTransaction(h.service.db, newInvoice); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}
	utils.RespondWithSuccess(w, map[string]any{"success": true})
}
