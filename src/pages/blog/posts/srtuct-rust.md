---
title: 'How each member of `struct` in Rust is stored in the memory?'
description: ""
publishDate: 'Saturday, Oct. 1 2022'
author: '@togami2864'
layout: '../../../layouts/BlogPost.astro'
lang: 'en'
i18: ''
filename: 'struct-rust'
---

In Rust, `struct` is the one of the custom data type.

According to [The Rust Reference](https://doc.rust-lang.org/reference/items/structs.html#structs),
> The precise memory layout of a struct is not specified. One can specify a particular layout using the repr attribute.

So how does it work?

## In C
Before getting started, let's run the code in C language.
```c
// gcc 8.3
#include <stdio.h>

struct Sample {
    unsigned short a; // 2bytes. Equivalent to u8 in Rust
    unsigned int b; // 4bytes. Equivalent to u32 in Rust
    unsigned short c; // 2bytes
};

int main() {
    struct Sample s;
    printf("a: %p\n", &(s.a));
    printf("b: %p\n", &(s.b));
    printf("c: %p\n", &(s.c));
    printf("total memory size %d\n", sizeof(struct Sample));
}
```

```
a: 0x7ffe1d660abc
b: 0x7ffe1d660ac0
c: 0x7ffe1d660ac4
total memory size 12
```
It's intuitive. The order of values in ASC is **a -> b -> c**.


## Observation
Let's see what it's like in Rust.
Here's my local `rustc` version.
```
$ rustc --version
$ rustc 1.62.0 (a8314ef7d 2022-06-27)
```

```rust
#[derive(Default)]
struct Sample {
    a: u8, // 2bytes
    b: u32, // 4bytes
    c: u8, // 2bytes
}

fn main(){
    let s: Sample = Default::default();
    println!("a: {:p}\nb: {:p}\nc: {:p}\ntotal memory size: {}",&s.a, &s.b, &s.c, std::mem::size_of::<Sample>() );
}
```

```
a: 0x7ffeed2b1724
b: 0x7ffeed2b1720
c: 0x7ffeed2b1725
total memory size: 8
```
You might be a little confusing 🤔 The order in ASC is **b -> a -> c**, and you can also find that the total memory size is less than in C.

Why don't the compiler bring the value `a: u8` to the beginning? The key is **optimization**.

## Alignment

The x86_64 architecture requires integer to be aligned to an address that is a multiple of 4 for efficient memory access.[^1]

ex) putting the value `a:u8` at the head makes the memory to use 4bytes to represent u8 value despite of u8 is 2bytes.
![before](/images/struct-rust/before.png)

However, the total memory size can be reduced by the better placement.
![after](/images/struct-rust/after.png)


This is why doesn't Rust compiler bring `a: u8` to the beginning.
Indeed, the Compiler doesn't have a particular memory layout of struct, it allows `rustc developers` to optimize to minimize the total memory size.[^2]


## #[repr(C)]
Finally, Let's check it out by adding `#[repr(C)]`, one of the repr attribution to the struct.
What `#[repr(C)]` does is really simple. From [The rustnomicon](https://doc.rust-lang.org/nomicon/other-reprs.html#reprc),
> This is the most important repr. It has fairly simple intent: do what C does.

```rust
#[derive(Default)]
#[repr(C)]
struct Sample {
    a: u8, // 2bytes
    b: u32, // 4bytes
    c: u8, // 2bytes
}

fn main(){
    let s: Sample = Default::default();
    println!("a: {:p}\nb: {:p}\nc: {:p}\ntotal memory size: {}",&s.a, &s.b, &s.c, std::mem::size_of::<Sample>() );
}
```

```
a: 0x7ffec9b9c870
b: 0x7ffec9b9c874
c: 0x7ffec9b9c878
total memory size: 12
```
The order is a -> b -> c. It's the same as the C example, at the beginning of this article. And the total memory size is apparently bigger than the case without `#[repr(c)]`.

## What I Learned
- Rust doesn't have any specific memory layout of the struct
- Rust compiler automatically optimizes the memory layout of the struct to minify the total memory size as much as possible
- By adding attribute, uses can specify the memory layout

[^1]: constraints are varied from hardware to hardware.
[^2]: If you use an very earlier version of the compiler, you might get different results. As far as I know, v1.17.0(56124baa9 2017-04-24) is the last version doesn't optimize the layout. Compiler has improved by contributes!!