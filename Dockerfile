FROM golang:1.20

WORKDIR /usr/src/app

COPY go.mod main.go

CMD ["go", "run", "main.go"]
