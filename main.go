package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	connect "github.com/bufbuild/connect-go"
	"github.com/nuntiodev/nuntio-go-api/api/v1/project"
	"github.com/nuntiodev/nuntio-go-sdk"
)

func main() {
	log.Println("Hello world!")
	http.HandleFunc("/", root)
	http.HandleFunc("/test", test)
	err := http.ListenAndServe(":3333", nil)
	if err != nil {
		log.Fatal(err)
	}
}

func root(w http.ResponseWriter, r *http.Request) {
	log.Println("Got pinged")
	w.Write([]byte("Ping12!"))
}

func test(w http.ResponseWriter, r *http.Request) {
	client := nuntio.NewClient()
	resp, err := client.Project().Get(context.Background(), connect.NewRequest(&project.GetRequest{}))
	var s string
	if err != nil {
		s = fmt.Sprintf("failed to project: %q\n", err)
	} else {
		s = fmt.Sprintf("projectid: %s\n", resp.Msg.Project.ProjectId)
	}
	log.Printf(s)
	w.Write([]byte(s))
}
