---
date: 2019-04-27
summary: Tutorial to show how to call Go code from a c/c++ application
tags:
  - C
  - C++
  - development
  - Go
  - Tutorial
title: Use Go code in c/c++ applications
aliases:
  - /blog/go_library_for_c_cpp_applications/
---

This simple tutorial will show how is possible to call [GoLang](https://golang.org/) functions from a c/c++ code.

<!--more-->

The code written for this example is in a [Github repo](https://github.com/pasdam/hello-world-c-go).

## Go library

First thing to do is to write the code for our [Go](https://golang.org/) library, in this example it will just contain a simple method that will print a custom hello message based on the input.

So create a `main.go` file in your project root:

```go
package main

import (
  "C"
  "fmt"
)

//export HelloWorld
func HelloWorld(name string) {
  fmt.Printf("Hello %s\n", name)
}

func main() {}
```

Note the `//export HelloWorld` comment, it is used to tell the go compiler to export the specified function, so that it will be available externally.

The library must use the package `main` and have an empty `main` function, otherwise it will fail to compile.

To generate the library to use in your c/c++ code use:

```bash
go build -buildmode=c-archive -o build/golib.a main.go
```

The output library will be in `build/golib.a`, the compiler will also generate an header file (`golib.h`) to include in the C++ code.

## C++ application

```cpp
#include "golib.h"

int main(int argc, char **argv) {
  char message[] = "World!!!";
  GoString goMessage = {message, sizeof(message)};
  HelloWorld(goMessage);
  return 0;
}
```

This is a simple c++ main that includes the library and only creates a string to pass to the library method.

To build and link it against the [Go](https://golang.org/) library just run:

```bash
gcc -I build -pthread main.c build/golib.a -o build/test
```

The output will be the application executable `build/test`, that can be easily run:

```bash
build/test
```

---

Source: [https://stackoverflow.com/questions/32215509/using-go-code-in-an-existing-c-project](https://stackoverflow.com/questions/32215509/using-go-code-in-an-existing-c-project)
