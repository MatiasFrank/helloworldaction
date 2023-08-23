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
	test()
	fmt.Println("Hello world!")
	http.HandleFunc("/", root)
	err := http.ListenAndServe(":3333", nil)
	if err != nil {
		log.Fatal(err)
	}
}

func test() {
	client := nuntio.NewClient()
	resp, err := client.Project().Get(context.Background(), connect.NewRequest(&project.GetRequest{}))
	if err != nil {
		fmt.Printf("failed to project: %q\n", err)
	} else {
		fmt.Printf("projectid: %s\n", resp.Msg.Project.ProjectId)
	}
}

func root(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Got pinged")
	w.Write([]byte("Ping2!"))
}
