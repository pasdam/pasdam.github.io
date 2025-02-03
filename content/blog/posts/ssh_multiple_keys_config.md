---
date: 2018-12-12
summary: Tutorial on how to use different SSH keys for different domains
tags:
  - bash
  - OpenSSL
  - SSH
  - Tutorial
title: How to use different SSH keys
aliases:
  - /blog/ssh_multiple_keys_config/
---

As a developer you might have to deal with SSH keys to access specific API/machines, and a common approach is to have one key for everything. For security reasons it's good to use different ones so that if one of them is compromised the other services are safe and you don't need to revoke and regenerate the keys for all your API/machines.

In this guide I will show you how to use a different SSH keys for each domain.

<!--more-->

## Requirements

* SSH.

## Creates keys

Following [best practices](https://linux-audit.com/using-ed25519-openssh-keys-instead-of-dsa-rsa-ecdsa/), you should always favor [ED25519](https://en.wikipedia.org/wiki/EdDSA) SSH keys, since they are more secure and have better performance over the other types.

The command is:

```bash
ssh-keygen -t ed25519 -C "email@example.com"
```

In order to have a different key for each domain, my pattern is actually:

```bash
ssh-keygen -t ed25519 -C "<my_name>@<domain>"
```

for example:

```bash
$ ssh-keygen -t ed25519 -C "pasdam@mydomain.com"
Generating public/private ed25519 key pair.
Enter file in which to save the key (/Users/username/.ssh/id_ed25519): /Users/username/.ssh/mydomain.com
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /Users/username/.ssh/mydomain.com.
Your public key has been saved in /Users/username/.ssh/mydomain.com.pub.
```

For an extra layer of security you could specify a password for the private key, but that would mean to have to enter it everytime you want to use the key.

If you prefer the old RSA keys, because for instance you have to login on a legacy system that doesn't support [ED25519](https://en.wikipedia.org/wiki/EdDSA), you can generate the key pair with:

```bash
ssh-keygen -o -t rsa -b 4096 -C "email@example.com"
```

Once created the key pair, you can store the public one into the service/server you want to access.

For instance to open an SSH connection to a VPS just run:

```bash
ssh <username>@<domain_or_ip> -i <private_key>
```

i.e.

```bash
ssh pasdam@mydomain.com -i ~/.ssh/mydomain.com
```

Note: if you only have one key, the last part (`-i ~/.ssh/mydomain.com`) is not needed.

## Configure SSH

Instead of specifying for each domain which key to use every time we use the `ssh` command, we can configure it to automatically load the correct one.

To do so, we need to create/edit the file [~/.ssh/config](https://www.ssh.com/ssh/config/). In it there should be an entry for each domain/host:

```text
IdentityFile ~/.ssh/deault

Host github.com
  HostName github.com
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/github

Host mydomain1.com
  HostName mydomain1.com
  AddKeysToAgent yes
  UseKeychain yes
  User myuser
  IdentityFile ~/.ssh/mydomain1

Host mydomain2.com
  HostName mydomain2.com
  AddKeysToAgent yes
  UseKeychain yes
  User myuser
  IdentityFile ~/.ssh/mydomain2
```

To note, for some hosts the username is specified, so that it would be possible to create an ssh connection using only the domain, like this:

```bash
ssh mydomain1.com
```

instead of:

```bash
ssh myuser@mydomain1.com
```
