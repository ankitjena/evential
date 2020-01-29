package db

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	// "go.mongodb.org/mongo-driver/mongo/readpref"
)

var client *mongo.Client
var ctx context.Context
var cancel context.CancelFunc

//Connect function establishes connection to the mongo url specified
func Connect(mongoURL string) {
	var err error
	client, err = mongo.NewClient(options.Client().ApplyURI(mongoURL))
	if err != nil {
		log.Fatal(err)
	}
	ctx, cancel = context.WithTimeout(context.Background(), 10 * time.Second)
	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Database connected")
}

//Disconnect function disconnects from the database
func Disconnect() {
	fmt.Println("Disconnecting")
	client.Disconnect(ctx)
	cancel()
}