FROM golang:1.20

WORKDIR /usr/src/app

COPY go.mod main.go go.sum ./

CMD ["go", "mod", "tidy"]
CMD ["go", "run", "main.go"]
