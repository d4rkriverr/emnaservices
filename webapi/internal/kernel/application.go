package kernel

import (
	"context"
	"emnaservices/webapi/internal/database"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

// Application is our general purpose Application struct
type Application struct {
	Server *http.Server
	Router *http.ServeMux
	QM     *database.QueriesManager
}

// Run will run the Application server
func (app *Application) Run() {
	fmt.Println("[!] - Server running: http://localhost" + app.Server.Addr)
	err := app.Server.ListenAndServe()
	if err != nil {
		fmt.Println(err)
	}
}

// WaitForShutdown is a graceful way to handle server shutdown events
func WaitForShutdown(application *Application) {
	// Create a channel to listen for OS signals
	interruptChan := make(chan os.Signal, 1)
	signal.Notify(interruptChan, os.Interrupt, os.Kill, syscall.SIGINT, syscall.SIGTERM)

	<-interruptChan

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()
	application.Server.Shutdown(ctx)
	os.Exit(0)
}
