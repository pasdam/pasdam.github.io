---
date: 2019-02-11
summary: Guide on how to uninstall older Java versions from macOS
tags:
  - Java
  - macOS
title: Uninstall older versions of Java from macOS
aliases:
  - /blog/remove_old_java_macos/
---

Sometimes it happens that after installing different versions of Java you want
to remove the old/unused ones: in this brief tutorial we'll see how to list all
the installed versions and remove the one that are not required anymore from
macOS.

<!--more-->

First we need to list all the installed version using the command
`/usr/libexec/java_home -V`:

```shell
$ /usr/libexec/java_home -V
Matching Java Virtual Machines (5):
  11.0.2,           x86_64: "Java SE 11.0.2"  /Library/Java/JavaVirtualMachines/jdk-11.0.2.jdk/Contents/Home
  10.0.2,           x86_64: "Java SE 10.0.2"  /Library/Java/JavaVirtualMachines/jdk-10.0.2.jdk/Contents/Home
  1.8.0_181,        x86_64: "Java SE 8"       /Library/Java/JavaVirtualMachines/jdk1.8.0_181.jdk/Contents/Home
  1.6.0_65-b14-468, x86_64: "Java SE 6"       /Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home
  1.6.0_65-b14-468, i386:   "Java SE 6"       /Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home
```

It will list all the installed versions (JRE and JDK) with the related path.

Next and last thing to do is to remove the version we don't need anymore with
the following command:

```shell
sudo rm -rf /Library/Java/JavaVirtualMachines/<version_to_remove>
```

For instance:

```shell
sudo rm -rf /Library/Java/JavaVirtualMachines/jdk-10.0.2.jdk
sudo rm -rf /Library/Java/JavaVirtualMachines/1.6.0.jdk
```

Then it will result in:

```shell
$ /usr/libexec/java_home -V
Matching Java Virtual Machines (2):
  11.0.2,    x86_64: "Java SE 11.0.2"  /Library/Java/JavaVirtualMachines/jdk-11.0.2.jdk/Contents/Home
  1.8.0_181, x86_64: "Java SE 8"       /Library/Java/JavaVirtualMachines/jdk1.8.0_181.jdk/Contents/Home
```
