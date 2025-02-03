---
date: 2020-04-18
summary: Tutorial to show how to configure Grafana to pull metrics from Prometheus, using a docker compose setup
tags:
  - Grafana
  - Prometheus
  - Telegraf
  - metrics
  - StatsD
title: Configure Grafana to pull metrics from Prometheus
aliases:
  - /blog/metrics_with_grafana_prometheus_and_docker/
---

[Grafana](https://grafana.com/) is a great tool to create dashboards to
visualize data, it can use different sources to pull data from. In this article
we're going to use [Prometheus](https://prometheus.io/) for this role.

We won't investigate all the features of it, for example it can be used
for alerting as well, but in this post we're going to use it simply as a data
source.

We're going to setup the whole stack using docker-compose. For the impatient the
code is in a
[github repo](https://github.com/pasdam/docker-stack-grafana-prometheus).

<!--more-->

## Flow

The metrics publishing flow is the following:

```text
+---------+   +-------------------+   +------------+   +---------+
| Service +-->| Prometheus client +-->+ Prometheus +-->+ Grafana |
+---------+   +-------------------+   +------------+   +---------+
```

1. the *service* reports the metrics to the *prometheus client*;
2. the *Prometheus client* exposes a page with all the metrics that *Prometheus*
   pulls;
3. *Grafana* queries data from *Prometheus* to visualize graphs.

For the sake of simplicity we're going to skip the service and use the command
line to create metrics.

## Configure the prometheus client

There are different clients to export metrics, for instance a simple
[statsD-exported](https://github.com/prometheus/statsd_exporter), but in this
article we're going to use
[Telegraf](https://www.influxdata.com/time-series-platform/telegraf/) as it can
get metrics from different sources (i.e. StatsD, file, ...), and output them in
different formats, we of course are going to use the *Prometheus* one.

Note that since we're skipping the service we use
[StatsD plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/statsd)
to enable the
[StatsD protocol](https://github.com/statsd/statsd#usage) in
[Telegraf](https://www.influxdata.com/time-series-platform/telegraf/).

So let's create a docker-compose file with the client:

```yaml
version: "2"

services:
  telegraf:
    image: telegraf:1.14.1
    ports:
      - 8125:8125/udp
      - 9273:9273
    volumes:
      - ./telegraf/telegraf.conf:/etc/telegraf/telegraf.conf
```

There are few things to notice here: there are two exposed ports, and we're
mounting the configuration from the local filesystem.

About the ports, we are exposing the following:

- *8125*: this is the port on which the [StatsD](https://github.com/statsd/statsd)
  client is listening to in order to receive the metrics;
- *9273*: on this port the client is exposing the web page Prometheus will pull
  to get the metrics.

The configuration is mounted as volume. The content of `./telegraf/telegraf.conf`
is the following:

```toml
[[inputs.statsd]]
  metric_separator = "."
  service_address = ":8125"

[[outputs.prometheus_client]]
  listen = ":9273"
  metric_version = 2
```

Nothing fancy here, we're enabling the
[StatsD input](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/statsd)
and the
[Prometheus Client](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/prometheus_client)
output.

If we did everything right *Telegraf* opening
[localhost:9273/metrics](http://localhost:9273/metrics) you should see something
like:

```text
# HELP go_goroutines Number of goroutines that currently exist.
# TYPE go_goroutines gauge
go_goroutines 37
# HELP go_info Information about the Go environment.
# TYPE go_info gauge
go_info{version="go1.13.8"} 1
# HELP go_memstats_alloc_bytes Number of bytes allocated and still in use.
# TYPE go_memstats_alloc_bytes gauge
go_memstats_alloc_bytes 7.887336e+06
# HELP go_memstats_alloc_bytes_total Total number of bytes allocated, even if freed.
# TYPE go_memstats_alloc_bytes_total counter
go_memstats_alloc_bytes_total 6.165966528e+09
```

To send test metrics you can use the following:

```shell
echo -n "custom_metric:20|g|#shell" > /dev/udp/localhost/8125
```

Or on macOS

```shell
echo -n "custom_metric:20|g|#shell" | nc -4u -w0 localhost 8125
```

where `20` is the value, `g` is the type (gauge), and `#shell` is the tag. If
you refresh the web page, now you should see `custom_metric` with the expected
value.

## Configure Prometheus

At this point we can configure *Prometheus*. Just add the component to the
docker-compose file:

```yaml
services:
  # telegraf ...

  prometheus:
    image: prom/prometheus:v2.17.1
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - ./prometheus/volumes/data:/prometheus
```

The port will be used by *Grafana* to pull metrics.

Also in this case we're mounting the configuration as a volume, plus we're also
mounting a local folder in which the application data will be stored. The
configuration is:

```yaml
global:
  scrape_interval: 5s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
  - job_name: 'telegraf'
    static_configs:
      - targets: ['telegraf:9273']
```

Here we're configuring the interval with which it should pull the metrics, 5
seconds, and then we're specifying from where:

- `localhost:9090` all we're doing here is reading the metrics Prometheus
  exposes itself;
- `telegraf:9273`, this is the configuration to enable Prometheus to pull data
  from the Telegraf container.

To test that everything went well, try to connect to the
[Prometheus web UI](http://localhost:9090).

## Configure Grafana

Only the last piece of the puzzle is missing: Grafana.

Let's add the service to the docker-compose file:

```yaml
services:
  # telegraf ...
  # prometheus ...
  grafana:
    image: grafana/grafana:6.7.2
    ports:
      - "3000:3000"
    volumes:
      - ./grafana/volumes/data:/var/lib/grafana
```

As before we're exposing the port on which the app is listening, and mounting a
local directory as data folder.

So now we can open Grafana: [localhost:3000](http://localhost:3000). We didn't
configure any security settings so the default login is `admin`/`admin` (it will
ask you to change the password at the first access, but you can skip it for
test setups).

Next step it to add a data source to pull metrics from. Go to
`Settings > Data sources`, and [add](http://localhost:3000/datasources/new) a
new Prometheus one. The only thing to specify is the url,
[http://prometheus:9090](http://prometheus:9090), leave the rest as default and
click on `Save and test`.

At this point it's possible to import Prometheus default dashboards, opening the
newly created data source, and click on the import button on each row in the
`Dashboards` tab.

Now you can play with Grafana and create your own dashboard.
