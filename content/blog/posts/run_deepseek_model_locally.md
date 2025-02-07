---
date: 2025-02-01T19:49:54+01:00
summary: Guide on how to spin up ChatUI, using Deepseek model from Ollama library, on docker
tags:
  - AI
  - ChatUI
  - Deepseek
  - Docker
  - LLM
  - Ollama
  - Tutorial
title: "Run your own private AI assistant locally with Chat-UI and Deepseek on Docker"
---

Want to harness the power of
[Deepseek](https://ollama.com/library/deepseek-r1:1.5b) LLM without relying on
external APIs or worrying about data privacy? Running it locally is the answer!
This guide will walk you through setting up all you need on your own machine
using the user-friendly [Chat UI](https://github.com/huggingface/chat-ui) and
the containerization magic of Docker. Get ready to chat with your very own
private AI assistant!

<!--more-->

## TLDR

Check out my [repo](https://github.com/pasdam/docker-ollama-deepseek-chatui) and
then run:

```shell
make compose-up
```

and wait for the images and the model to be downloaded, it might take some
minutes.

## Why run DeepSeek locally?

There might be few reasons why one would want to use a local assistan rather
than using one of the many services available on the internet:

* *privacy*: keep your conversations and data completely private and avoid
  sending sensitive information to external servers;
* *cost*: no API usage fees or rate limit, you can use it as much as you want;
* *offline access*: use the assistant even without an internet connection;
* *customization*: fine-tune and customize the model to your specific needs.

## Prerequisites

Please refer to the official documentations to install all the required tools:

* [docker](https://docs.docker.com/get-started/get-docker/).

You'll also need sufficient resources on the machine you're executing the model
on: LLM models can be resource-intensive. Ensure your machine has enough RAM (at
least 16GB recommended, more for larger models) and disk space (depending on the
model size).

DeepSeek offers various models, start with a smaller one if you're limited on
resources. For the purpose of this tutorial we are using
[deepseek-r1:1.5b](https://ollama.com/library/deepseek-r1:1.5b), which is relatively
performant and small, but other verions are available with different number of
parameters.

You can find more models to test in the
[Ollama library](https://ollama.com/library).

## Limitations

A dedicated GPU would be highly recommended for reasonable performance, but
unfortunately, according to the
[docker official documentation](https://docs.docker.com/desktop/features/gpu/):

> Currently GPU support in Docker Desktop is only available on Windows with the
WSL2 backend.

If you encounter memory or resource errors, try using a smaller model,
increasing the resources allocated to Docker, or stopping other running
containers.

## Code

Here's the docker compose configuration to run all the needed components:

```yaml
services:

  ollama:
    image: ollama/ollama:0.5.7
    volumes:
      - ./ollama/data:/root/.ollama

  ollama-init:
    image: alpine/curl:8.11.1
    command: -X POST http://ollama:11434/api/pull -d '{"model":"deepseek-r1:1.5b"}'
    depends_on:
      - ollama

  chat-ui:
    image: ghcr.io/huggingface/chat-ui-db:sha-31344ad
    volumes:
      - ./chat-ui/db:/data/db
    environment:
      MODELS: >
        [
          {
            "name": "Ollama DeepSeek",
            "chatPromptTemplate": "",
            "parameters": {
              "stop": ["</s>"]
            },
            "endpoints": [
              {
                "type": "ollama",
                "url" : "http://ollama:11434",
                "ollamaName" : "deepseek-r1:1.5b"
              }
            ]
          }
        ]
    ports:
      - 3000:3000
    depends_on:
      - ollama-init
```

The first service, `ollama`, is the [model manager](https://ollama.com/). For
this we need to attach a volume, `.ollama/data`, where the model(s) will be
saved.

`ollama-init` is a simple container that will simply use the
[Ollama APIs](https://github.com/ollama/ollama/blob/main/docs/api.md#pull-a-model)
to request `ollama` service to download the required model. This container is
not strictly required if you prefer to perform the downlaod manually separately,
but just remember to save the file in `.ollama/data`, the model folder we
mounted as volume in `ollama`.

To be able to ask question we can use the
[chat web UI](https://github.com/huggingface/chat-ui) provided by
[HuggingFace](https://huggingface.co/chat), in the `chat-ui` service.

First thing we need here is to mount the folder where search data can be stored,
`./chat-ui/db`. Then we need to configure the models list, that only contains
one for this tutorial. In particular we need to make sure to match the value in
`ollamaName` to the model we download in `ollama-init`.

## Access Chat-UI

You can start the services as per usual with:

```shell
docker compose up -d
```

Then you can open your web browser and go to
[http://localhost:3000](http://localhost:3000) and ask questions to your
personal assistant.

Note that depending on the hardware and the chosen model, it might take some
time to provide an answer, so be patient ;).

## Conclusion

By setting up Ollama locally using Docker, you can experiment with the DeepSeek
model without relying on cloud services. This approach offers control over
resources and allows you to test different configurations. However, it is
limited by your hardware capabilities during training and execution.
