---
date: 2020-05-21
summary: Tutorial on how to deploy OpenFaaS to kubernetes, using minikube
tags:
  - Docker
  - Kubernetes
  - Minikube
  - OpenFAAS
title: Deploy OpenFaas to minikube
aliases:
  - /blog/deploy_openfaas_to_minikube/
---

[OpenFaas](https://www.openfaas.com/) is an open source
[FaaS](https://en.wikipedia.org/wiki/Function_as_a_service) platform that
allows to deploy event-driven functions and microservices to Kubernetes quickly.

In this tutorial we will see how to deploy it. In particular we will use
[minikube](https://github.com/kubernetes/minikube), which implements a simple
local k8s cluster.

<!--more-->

Source: [OpenFaas Doc](https://docs.openfaas.com/deployment/kubernetes/#c-deploy-using-kubectl-and-plain-yaml-for-development-only)

## Requirements

This are the tools used, in parenthesis the version used for the tutorial:

* [docker](https://www.docker.com) (19.03.8);
* [helm](https://helm.sh) (3.2.1);
* [minikube](https://github.com/kubernetes/minikube) (1.10.1);
* [openfaas cli](https://github.com/openfaas/faas-cli#get-started-install-the-cli)
  (0.12.4).

Please refer to the respective documentation on how to install them.

## Start minikube

We will use minikube with the docker driver so that the k8s node will be
running in a container:

```shell
minikube start --driver=docker
```

## Deploy OpenFaas

First thing to do is to create the required namespaces:

```shell
$ kubectl apply -f https://raw.githubusercontent.com/openfaas/faas-netes/master/namespaces.yml
namespace/openfaas created
namespace/openfaas-fn created
```

Then we should create credentials for the [gateway](https://docs.openfaas.com/architecture/gateway/):

```shell
PASSWORD=$(head -c 12 /dev/urandom | shasum | cut -d' ' -f1)
kubectl -n openfaas create secret generic basic-auth \
  --from-literal=basic-auth-user=admin \
  --from-literal=basic-auth-password="$PASSWORD"
```

At this point we need to add the repository to be able to download the helm
template:

```shell
helm repo add openfaas https://openfaas.github.io/faas-netes/
helm repo update
```

Now we can generate the deployment files using Helm and apply it:

```shell
helm template \
  openfaas openfaas/openfaas \
  --namespace openfaas \
  --set basic_auth=true \
  --set functionNamespace=openfaas-fn \
  --set faasnetes.imagePullPolicy="IfNotPresent" \
  --set ingress.enabled=true > openfaas.yaml
kubectl apply -f openfaas.yaml
```

OpenFaas should be deployed now:

```shell
$ kubectl get pods -n openfaas
NAME                                 READY   STATUS    RESTARTS   AGE
alertmanager-9668b5785-2ftwn         1/1     Running   0          10m
basic-auth-plugin-56c84b75b6-khhkx   1/1     Running   0          10m
faas-idler-6c9b9cb54f-fnr89          1/1     Running   0          10m
gateway-6bff97c6cd-twfpv             2/2     Running   0          10m
nats-58d4d5db8d-k22kp                1/1     Running   0          10m
prometheus-8b754b655-lmfft           1/1     Running   0          10m
queue-worker-744c85f647-qkb2t        1/1     Running   0          10m
```

Next step is to port-forward the gateway to the local machine:

```shell
kubectl port-forward svc/gateway -n openfaas 31112:8080 &
```

so that we can login:

```shell
export OPENFAAS_URL=http://127.0.0.1:31112
echo -n $PASSWORD | faas-cli login --password-stdin
```

and eventually open the web ui at [localhost:31112](http://localhost:31112).

## Deploy custom function

In order to deploy local function to the cluster, it's necessary to point your
shell to use minikube's docker deamon:

```shell
eval $(minikube docker-env)
```

This step is necessary as during the deploy OpenFaas needs to pull the function's
image, but the host's daemon is not available inside the cluster, hence it won't
be possible to pull the image from it.

So now we can build the function (refer to the
[official documentation](https://docs.openfaas.com/cli/templates/) to see how
to write one):

```shell
faas build
```

This last command will build the image inside the minikube container itself, so
the image will be available to OpenFaas when we will perform the deploy with:

```shell
faas deploy
```
