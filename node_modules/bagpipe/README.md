Bagpipe [中文](https://github.com/JacksonTian/bagpipe/blob/master/README_CN.md)
=======
You are the bagpiper.

## Introduction
It is convenient for us to use asynchronism or concurrent to promote our business speed in Node. While, if the amount of concurrent is too large, our server may not support, such that we need to limit the amount of concurrent. Though, the http module contains [http.Agent](http://nodejs.org/docs/latest/api/http.html#http_class_http_agent) to control the amount of sockets, usually, our asynchronous API has packaged in advance. It is not realistic to change the inner API agent, let’s realize it on our own logical layer.

## Installation
```
npm install bagpipe
```

## API
The APIs exposed by Bagpipe only include constructor and instance methods `push`.

Under original status, we may execute concurrent like this, forming 100 concurrent asynchronous invokes.

```
for (var i = 0; i < 100; i++) {
  async(function () {
    // Asynchronous call
  });
}
```
If need to limit concurrency, what is your solution?
Solution from Bagpipe as follows:

```
var Bagpipe = require('bagpipe');
// Sets the max concurrency as 100
var bagpipe = new Bagpipe(10);
for (var i = 0; i < 100; i++) {
  bagpipe.push(async, function () {
    // execute asynchronous callback
  });
}
```

Yes, invoke method only splits method、parameter and callback, then delivery it to bagpipe through `push`.

How does it like compared with your anticipated solution?

### Options

- `refuse`, when queue is fulled, bagpipe will refuse the new async call and execute the callback with a `TooMuchAsyncCallError` exception. default `false`.
- `timeout`, setting global ansyn call timeout. If async call doesn't complete in time, will execute the callback with `BagpipeTimeoutError` exception. default `null`.

## Principles
Bagpipe delivers invoke into inner queue through `push`. If active invoke amount is less than max concurrent, it will be popped and executed directly, or it will stay in the queue. When an asynchronous invoke ends, a invoke in the head of the queue will be popped and executed, such that assures active asynchronous invoke amount no larger than restricted value.

When the queue length is larger than 1, Bagpipe object will fire its `full` event, which delivers the queue length value. The value helps to assess business performance. For example:

```
bagpipe.on('full', function (length) {
  console.warn('Button system cannot deal on time, queue jam, current queue length is:’+ length);
});
```

If queue length more than limit, you can set the `refuse` option to decide continue in queue or refuse call. The `refuse` default `false`. If set as `true`, the `TooMuchAsyncCallError` exception will pass to callback directly:

```
var bagpipe = new BagPipe(10, {
  refuse: true
});
```

If complete the async call is unexpected, the queue will not balanced. Set the timeout, let the callback executed with the `BagpipeTimeoutError` exception:

```
var bagpipe = new BagPipe(10, {
  timeout: 1000
});
```

## Module status
The unit testing status: [![Build Status](https://secure.travis-ci.org/JacksonTian/bagpipe.png)](http://travis-ci.org/JacksonTian/bagpipe). Unit test coverage [100%](http://html5ify.com/bagpipe/coverage.html).

## Best Practices
- Ensure that the last parameter of the asynchronous invoke is callback.
- Listen to the `full` event, adding your business performance assessment.
- Current asynchronous method has not supported context yet. Ensure that there is no `this` reference in asynchronous method. If there is `this` reference in asynchronous method, please use `bind` pass into correct context.
- Asynchronous invoke should process method to deal with timeout, it should ensure the invoke will return in a certain time no matter whether the business has been finished or not.

## Real case
When you want to traverse file directories, asynchrony can ensure `full` use of IO. You can invoke thousands of file reading easily. But, system file descriptors are limited. If disobedient, read this article again when occurring errors as follows.

```
Error: EMFILE, too many open files
```

Someone may consider dealing it with synchronous method. But, when synchronous, CPU and IO cannot be used concurrently, performance is an indefeasible index under certain condition. You can enjoy concurrent easily, as well as limit concurrent with Bagpipe.

```
var bagpipe = new Bagpipe(10);

var files = ['Here are many files'];
for (var i = 0; i < files.length; i++) {
  // fs.readFile(files[i], 'utf-8', function (err, data) {
  bagpipe.push(fs.readFile, files[i], 'utf-8', function (err, data) {
    // won’t occur error because of too many file descriptors
    // well done
  });
}
```

## License
Released under the license of [MIT](https://github.com/JacksonTian/bagpipe/blob/master/MIT-License), welcome to enjoy open source.
