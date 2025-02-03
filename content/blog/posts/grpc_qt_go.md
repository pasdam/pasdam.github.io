---
date: 2017-07-24
summary: Tutorial on how to use gRPC/protobuf with a C++ client and Go server
tags:
  - C++
  - development
  - Go
  - gRPC
  - protoc
  - Protocol buffer
  - Tutorial
title: Use gRPC/protobuf with C++ and Go
aliases:
  - /blog/grpc_qt_go/
---

In this guide I will show you how to use [gRPC](http://www.grpc.io/) to write a simple client (in C++) and server (in Go) for your service.

For this tutorial we will use the code available in the following Github project: [pasdam/grpcExample](https://github.com/pasdam/grpcExample).

For the client, in this article I'll show how to write a command line one, but in the repository there is also a GUI client written with the [Qt framework](https://www.qt.io).

<!--more-->

## Requirements

* gRPC 1.4.2;
* Go 1.8.3;
* Protobuf 3.3.2;
* g++.

Note: the code might works also with previous versions, but it was tested only with the specified ones.

## Installation

To install the C++ version on MacOS, if you have brew installed just open a terminal and execute:

```bash
brew install grpc pkg-config
```

it will install also the protobuf compiler, protoc.

Now we need to install the go plugin with the command:

```bash
go get -u github.com/golang/protobuf/protoc-gen-go
```

For other language-specific installation instructions for gRPC runtime, please refer to the [official guide](https://github.com/grpc/grpc/blob/master/INSTALL.md).

## Project

The folders structure is be the following:

```none
- client
  |- cli
  |- core
  |- qt
- protocol
- server
```

In the _client/cli_ folder we will create the command line c++ client, whereas the Qt one is in _client/qt_; common files will be stored in _client/core_. The _protocol_ folder will contains the proto/grpc definitions. And finally the _server_ directory will contains the server written in Go.

### Proto

We are going to define a simple greeting service in the file _protocol/greeting.proto_:

`gist:pasdam/98fb5343cb2ed9c3be55148413ae755b`

This service has only one method that accept a string parameter and replies with another string.

Then we need to generate the code to use on both the client and the server, so from the project root execute the following:

```bash
PROTOS_PATH=./protocol
OUT_DIR=./gen
OUT_GO=$OUT_DIR/go
mkdir -p $OUT_GO
protoc -I $PROTOS_PATH --cpp_out=$OUT_DIR --go_out=plugins=grpc:$OUT_GO --grpc_out=$OUT_DIR --plugin=protoc-gen-grpc=`which grpc_cpp_plugin` protocol/*.proto
```

and then compile it:

```bash
cd $OUT_DIR
g++ -I/usr/local/include -pthread -std=c++11 -c *.cc
```

Note: On Windows, for the last command the include path should be changed.

### Server

The next step is to implement the service in Go, in the file _server/main.go_:

`gist:pasdam/d05af20fdb57da156af62ea914396611`

Nothing complex here, just a couple of things: first we implemented the RPC method, that simply takes the input string and reply prepending "Hello " to that. In the _main_ method the first thing we have to do is to specify the port on which the server should respond (we will use it later with the client). Then the last thing to do is to create the server, register the greeting service and start serving the requests.

To run the server just use the following command from the project root:

```bash
cd server
go get # optional
go run main.go
```

Note: the `go get` command is optional, and it's required only the first time to force the download of all dependencies (all the imported packages).

### Client

As first thing we will create a wrapper for the stub, that will hide all the complexity for each RPC call.

`gist:pasdam/5cc0b4f15ca136485a90da2f528760d2`

In particular in the `hello` method we create the gRPC request and its context, then we perform the RPC and retrieve the response.

One thing to notice: this class holds a reference to a stub of the service, created in the constructor using a specified [channel](https://grpc.io/docs/guides/concepts.html#channels) (more on this later). Such stub is used to deliver the request to the actual service, and hides all the communication logic (i.e. serialization/deserialization).

The command line client is quite simple: it consists of a small `main` method that reads from the standard input, executes the request and prints the result:

`gist:pasdam/8293dec389e09391ac5b6d9eacd748d6`

The only thing to notice here is the [channel](https://grpc.io/docs/guides/concepts.html#channels) creation: we specified the address (`localhost:9001`), and configure it not to use TLS/SSL.

Next step is to compile the code with:

```bash
g++ -I/usr/local/include -pthread -std=c++11 -c -o $OUT_DIR/client-cli.o client/cli/main.cpp
g++ $OUT_DIR/greeting.pb.o $OUT_DIR/greeting.grpc.pb.o $OUT_DIR/client-cli.o -L/usr/local/lib `pkg-config --libs grpc++ grpc` -lgrpc++_reflection -lprotobuf -lpthread -ldl -o $OUT_DIR/client-cli
```

And finally we can execute the client with:

```bash
$ $OUT_DIR/client-cli
Insert name: Thor
Greeter received: Hello Thor
```
