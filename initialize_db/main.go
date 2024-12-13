package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func init() {
	if err := godotenv.Load(); err != nil {
		panic("No .env file found")
	}
}
func main() {
	psql := fmt.Sprintf("postgres://%s:%s@localhost:5432/emnaservicescrm?sslmode=disable", os.Getenv("DBUSER"), os.Getenv("DBPASS"))
	db, err := sql.Open("postgres", psql)
	fmt.Println("Try to connect to postgres server")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatal(err)
	}
	fmt.Println("Database 'emnaservicescrm' is ready!")

	// Create the 'accounts' table
	createAccountsTable := ``
	if _, err = db.Exec(createAccountsTable); err != nil {
		log.Fatal("Error creating accounts table: ", err)
	}
	fmt.Println("Accounts table created successfully!")

	// Create the 'transactions' table
	createTransactionsTable := ``
	if _, err = db.Exec(createTransactionsTable); err != nil {
		log.Fatal("Error creating transactions table: ", err)
	}
	fmt.Println("Transactions table created successfully!")
}
