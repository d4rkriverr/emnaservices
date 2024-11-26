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
	psql := fmt.Sprintf("postgres://%s:%s@localhost:5432/?sslmode=disable", os.Getenv("DBUSER"), os.Getenv("DBPASS"))
	db, err := sql.Open("postgres", psql)
	fmt.Printf("Try to connect to postgres server")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatal(err)
	}

	// Create the 'emnaservicescrm' database if it doesn't exist
	createDBQuery := `CREATE DATABASE IF NOT EXISTS emnaservicescrm;`
	_, err = db.Exec(createDBQuery)
	if err != nil {
		log.Fatal("Error creating the database: ", err)
	}
	fmt.Println("Database 'emnaservicescrm' is ready!")

	// Create the 'accounts' table
	createAccountsTable := `
	CREATE TABLE IF NOT EXISTS accounts (
		id SERIAL PRIMARY KEY,
		username VARCHAR(255) NOT NULL,
		password VARCHAR(255) NOT NULL,
		authorizations VARCHAR(255) NOT NULL,
		access_token VARCHAR(255) NOT NULL,
		expired_at TIMESTAMP NOT NULL
	);`
	_, err = db.Exec(createAccountsTable)
	if err != nil {
		log.Fatal("Error creating accounts table: ", err)
	}
	fmt.Println("Accounts table created successfully!")

	// Create the 'transactions' table
	createTransactionsTable := `
	CREATE TABLE IF NOT EXISTS transactions (
		id SERIAL PRIMARY KEY,
		description VARCHAR(255) NOT NULL,
		activity VARCHAR(255) NOT NULL,
		total_cost FLOAT NOT NULL,
		payment_method VARCHAR(50) NOT NULL,
		agent VARCHAR(100) NOT NULL,
		status VARCHAR(50) NOT NULL,
		issue_date TIMESTAMP NOT NULL
	);`
	_, err = db.Exec(createTransactionsTable)
	if err != nil {
		log.Fatal("Error creating transactions table: ", err)
	}
	fmt.Println("Transactions table created successfully!")
}
