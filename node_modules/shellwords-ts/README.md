# Shellwords-TS

[![Build Status](https://travis-ci.org/marques-work/shellwords.svg?branch=master)](https://travis-ci.org/marques-work/shellwords)

A JavaScript port of the [Ruby module of the same name](https://ruby-doc.org/stdlib-2.7.0/libdoc/shellwords/rdoc/Shellwords.html), with TypeScript typings. Shellwords provides functions to manipulate strings according to the word parsing rules of the UNIX Bourne shell. Originally forked from [shellwords](https://github.com/jimmycuadra/shellwords), this package is updated to be at parity with a modern reference implementation (Ruby 2.7.0 at the time of writing) and implements `Shellwords.join()`, which was missing from the original package. The goal of this is to maintain parity with the Ruby `Shellwords` module, so if there is a discrepancy, please file a [bug](https://github.com/marques-work/shellwords/issues/new) (or even better, a [PR](https://github.com/marques-work/shellwords/pull/new/master)).

## Installation

Add "shellwords-ts" to your `package.json` file and run `npm install`.

## Example

```javascript
import Shellwords from "shellwords-ts";

Shellwords.split("foo 'bar baz'"); // ["foo", "bar baz"]
Shellwords.escape("What's up?"); // "What\\'s\\ up\\?"
Shellwords.join(["find", "~/Library/Application Support", "-name", "*.plist"]); // "find \\~/Library/Application\\ Support -name \\*.plist"

Shellwords.split("foo 'bar baz' quu", (rawPart) => {
  // have access to the chunks of the raw string as it is scanned
});
```

## Breaking changes as of 3.0.0:

- `Shellwords.escape()` no longer escapes `+`; see [this commit in the GitHub Ruby repo](https://github.com/ruby/ruby/commit/43a16c98df392e726040f0331a3e09d00c53d513).
