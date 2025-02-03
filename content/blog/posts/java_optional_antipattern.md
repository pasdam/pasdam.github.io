---
date: 2019-09-27
summary: Article to show few cases when using Optional in Java is an anti-pattern
tags:
  - antipattern
  - engineering
  - Java
  - pattern
title: The Optional anti-patterns in Java
aliases:
  - /blog/optional_antipatterns_in_java/
---

Traditionally, Java programs have returned null as a way to represent that a value isn’t present. The version 8 of the SDK includes a new class which was made specifically to manage missing values.

I won't describe the details of the [Optional](https://docs.oracle.com/javase/8/docs/api/java/util/Optional.html) class, but very briefly it's   a container object which may or may not contain a non-null value. Therefore, it is possible to manipulate null values as if they were normal instances without necessarily having to perform a null check at every step.

In this article, I'm going to talk about experiences I gathered while working with Java and describe some anti-patterns I've seen about such class.

<!--more-->

A [Stack Overflow answer by Brian Goetz](http://stackoverflow.com/a/26328555/547365), Java’s language architect, sheds light on Oracle’s intention with the Optional type:

> Of course, people will do what they want. But we did have a clear intention when adding this feature, and it was not to be a general purpose Maybe or Some type, as much as many people would have liked us to do so. Our intention was to provide a limited mechanism for library method return types where there needed to be a clear way to represent "no result", and using null for such was overwhelmingly likely to cause errors.

I generally agree with his statement: `Optional` should be used with care and not as a panacea for all problems. IMHO in most cases `Optional` is just a new name for null.

## Things to keep in mind about Optional

According to the [documentation](https://docs.oracle.com/en/java/javase/12/docs/api/java.base/java/util/Optional.html):

> Use of identity-sensitive operations (including reference equality (==), identity hash code, or synchronization) on instances of Optional may have unpredictable results and should be avoided.
>
> Optional is primarily intended for use as a method return type where there is a clear need to represent "no result," and where using null is likely to cause errors.

### Garbage collection

Also another things to keep in mind is that it creates an extra object for the garbage collector. For server systems running at scale, you definitely don't want lots of little object boxes within your beans.

Interestingly, if `Optional` becomes a value type in a future Java version, then the memory/gc issue goes away.

### Eager operations

When you use `Optional::orElse` method you should remember that it does not behave the same way as `if-else` block. For instance, with:

```java
Optional.ofNullable(content).orElse(logToFile())
```

the `logToFile` method is executed all the time, whereas with:

```java
if (content == null) {
  logToFile();
}
```

it runs only if the condition is met (lazily).

The instruction can be harmless as creating a string, but it can also be a hidden performance killer.

## Use cases

### Optional as method return type

If we have a method that returns something, we must inspect the documentation to find out whether or not it may be null.

```java
public V get(Object key);
```

To overcome this problematic situation, developers invented many methods like annotations (Nullable, NotNull), naming-conventions (e.g. prefixing a method with find instead of get) or just using code-comments to hint that a method may intentionally return null and the invoker should care about this case.

By returning `Optional<V>` instead, there is a clear indication that the method may not return any value at all:

```java
public Optional<V> get(Object key);
```

My personal take on it is in general to prefer null with an annotation, as no additional object is created.

When dealing with collections an anti-pattern is to return an `Optional` of a collection:

```java
public Optional<List<V>> get(Object key) {
  if (this.list != null) {
    return this.list;
  }
  return Optional.empty();
}
```

This can be replaced with a simpler empty collection:

```java
public List<V> get(Object key) {
  if (this.list != null) {
    return this.list;
  }
  return Collections.emptyList();
}
```

#### Streams

The actual use case for `Optionals` is functional programming. If you use this, you will filter, map or reduce data and you will often come to the point where there might be the possibility that no data exists. It’s a good idea to use Optionals here, as you often write this code in a fluent style. A null pointer is really ugly to handle here.

### Optional as class field

This is an anti-pattern, and the main reason is that the `Optional` class is not serializable.

A better solution would be to make store the field with the actual type and make the getter method return an `Optional`:

```java
public class Car {

  private List<Wheel> wheels;

  private Engine engine;

  public Optional<Engine> getEngine() {
    return Optional.ofNullable(engine);
  }
}
```

Keep in mind that with this approach you're creating a new object every time the getter is called.

### Optional as method argument

Having an optional-typed parameter in a function is a code smell: this was an anti-pattern before (having a parameter that can intentionally be null, and is handled differently if it is) and stays an anti-pattern now (having an optional-typed parameter), you either way have some decision to make if you do something with the parameter if it is there, or you do something else if it is not. A method implemented this way shows a design-flaw in every case. I can have one version with and one version without the parameter, and decide in the point of invocation what to do, instead of deciding it hidden in some complex function.

This applies to everything: constructors, setters, or any other method.

### Other anti patterns

A variable whose type is `Optional` should never itself be null; it should always point to a valid instance.

Using `Optional` in collections can be a design smell: there is no need to have `List` of `Optional`s that might or might not have a value; we can have a smaller or even empty `List` of concrete objects instead.

Don't use optional just to check if a value is null:

```java
Optional.ofNullable(value)
  .map(this::doSthWithTheField)
  .orElse(this::doSthElse)
```

in the previous code `value` can be null, and is wrapped with an `Optional` just to decide in a functional way what to do with it, the traditional way would be a better approach:

```java
if (value == null) {
  doSthWithTheField(value);
} else {
  doSthElse(value);
}
```

## Summary

Use Optional with caution:

* do not forget about the eagerness of some operations;
* do not use Optional or its variants if you’re trying to avoid heap allocations, and minimize object creations;
* `Optional`s are ok as method return types and can potentially cause problems if used in fields, parameters and collections;
* keep your `Optional` simple, do not force it to do something it was not designed for;
* avoid having `Optional`s in collections, just fill them with the present values directly; also do not use them to return collections or arrays, favor returning an empty collection/array;
* Avoid `Optional::isPresent` followed by `Optional::get`, use `ifPresentOrElse` instead
