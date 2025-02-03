---
date: 2018-11-23
summary: Tutorial on how to collect metrics using the DataDog agent, running locally in a docker container
tags:
  - cloud
  - DataDog
  - Docker
  - metrics
  - monitoring
title: Install DataDog Agent as a docker container
aliases:
  - /blog/datadog_agent_docker/
---

[DataDog](https://www.datadoghq.com/) is a monitoring service for cloud-scale applications, in the following guide we'll see how to create a docker container with the [DataDog agent](https://docs.datadoghq.com/agent/?tab=agentv6) and how to use it to publish custom metrics.

<!--more-->

## Requirements

In the following article we assume that yuo have:

* a [DataDog](https://www.datadoghq.com/) account with a valid API key; you can get the key from [Integrations > API](https://app.datadoghq.com/account/settings#api);
* [Docker installed](https://docs.docker.com/install/).

## Setup docker container

As first thing, we create an environment variable that we'll use to pass the API key to the docker container:

```bash
DD_API_KEY=<API_KEY>
```

Then we run the container with the agent with:

```bash
docker run --rm -d -v /var/run/docker.sock:/var/run/docker.sock:ro -v /proc/:/host/proc/:ro -v /sys/fs/cgroup/:/host/sys/fs/cgroup:ro -e DD_API_KEY=$DD_API_KEY --name dd-agent datadog/agent:latest
```

The previous command should be enough for the most common cases, but if for specific reasons you need to send metrics from your host machine to the [DataDog agent](https://docs.datadoghq.com/agent/?tab=agentv6), you should run the following:

```bash
$ docker run \
  --rm \
  -d \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -v /proc/:/host/proc/:ro \
  -v /sys/fs/cgroup/:/host/sys/fs/cgroup:ro \
  -e DD_API_KEY=$DD_API_KEY \
  -e DD_DOGSTATSD_NON_LOCAL_TRAFFIC=true \
  -p 8125:8125/udp \
  --name dd-agent \
  datadog/agent:latest
```

This way the container port is exposed to the local machine.

You can refer to the [official documentation](https://docs.datadoghq.com/agent/basic_agent_usage/docker/) for more specific configurations.

## Test the agent

In order to test if the agent works properly we're going to [send a custom metric from the command line](https://help.datadoghq.com/hc/en-us/articles/206441345-Send-metrics-and-events-using-dogstatsd-and-the-shell).

If the container exposes the port to the host, it is possible to use one the following:

```bash
# Linux
echo -n "custom_metric:20|g|#shell" > /dev/udp/localhost/8125
# macOS
echo -n "custom_metric:20|g|#shell" | nc -4u -w0 localhost 8125
```

It is also possible to send a metric from within the container itself:

```bash
# open a shell in the container
docker exec -i -t dd-agent /bin/bash

# send the custom metrics using the container's shell
echo -n "custom_metric:20|g|#shell" > /dev/udp/localhost/8125
```
