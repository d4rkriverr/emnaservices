package endpoints

import (
	"emnaservices/webapi/internal/database"
	"emnaservices/webapi/internal/database/models"
	"emnaservices/webapi/utils"
	"encoding/json"
	"fmt"
	"net/http"
)

type TransactionsHandler struct {
	QueriesManager *database.QueriesManager
}

func NewTransactionsHandler(q *database.QueriesManager) *TransactionsHandler {
	return &TransactionsHandler{QueriesManager: q}
}

func (h *TransactionsHandler) GetExpansesData(w http.ResponseWriter, r *http.Request) {
	date_from := r.URL.Query().Get("from")
	date_to := r.URL.Query().Get("to")

	data, err := h.QueriesManager.Transactions.GetExpensesWithRange(date_from, date_to)
	if err != nil {
		fmt.Println(err)
		utils.RespondWithError(w, 400, err.Error())
		return
	}
	utils.RespondWithSuccess(w, data)
}

func (h *TransactionsHandler) HandleCreateExpanses(w http.ResponseWriter, r *http.Request) {
	var newInvoice models.Transaction
	err := json.NewDecoder(r.Body).Decode(&newInvoice)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}
	if err := h.QueriesManager.Transactions.CreateTransaction(newInvoice); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}
	utils.RespondWithSuccess(w, map[string]any{"success": true})
}
