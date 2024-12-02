package invoice

type Invoice struct {
	Id              int64  `json:"id"`
	Fullname        string `json:"fullname"`
	PhoneNumber     string `json:"phone_number"`
	ProductName     string `json:"product_name"`
	ProductPrice    int64  `json:"product_price"`
	ProductDiscount int64  `json:"product_discount"`
	AdvancePayment  int64  `json:"advance_payment"`
	Agent           string `json:"agent"`
	IssueDate       string `json:"issue_date"`
}
