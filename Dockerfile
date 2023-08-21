FROM golang:1.20

WORKDIR /usr/src/app

COPY go.mod main.go
RUN go mod download

CMD ["go", "run", "main.go"]
