package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	fmt.Println("Hello world!")
	http.HandleFunc("/", root)
	err := http.ListenAndServe(":3333", nil)
	if err != nil {
		log.Fatal(err)
	}
}

func root(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Got pinged")
	w.Write([]byte("Ping2!"))
}
