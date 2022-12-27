Bagpipe(风笛) [English](https://github.com/JacksonTian/bagpipe/blob/master/README.md)
=======
You are the bagpiper.

## 起源
在Node中我们可以十分方便利用异步和并行来提升我们的业务速度。但是，如果并发量过大，我们的服务器却可能吃不消，我们需要限制并发量。尽管`http`模块自身有[http.Agent](http://nodejs.org/docs/latest/api/http.html#http_class_http_agent)这样的玩意，用于控制socket的数量，但是通常我们的异步API早就封装好了。改动API的内部agent是不现实的，那么我们自己在逻辑层实现吧。

## 安装
```
npm install bagpipe
```

## API
`Bagpipe`暴露的API只有构造器和实例方法`push`。

在原始状态下，我们执行并发可能是如下这样的，这会形成100个并发异步调用。

```
for (var i = 0; i < 100; i++) {
  async(function () {
    // 异步调用
  });
}
```
如果需要限制并发，你的方案会是怎样？

`Bagpipe`的方案是如下这样的：

```
var Bagpipe = require('bagpipe');
// 设定最大并发数为10
var bagpipe = new Bagpipe(10);
for (var i = 0; i < 100; i++) {
  bagpipe.push(async, function () {
    // 异步回调执行
  });
}
```

是的，调用方式仅仅是将方法、参数、回调分拆一下通过`push`交给`bagpipe`即可。

这个方案与你预想的方案相比，如何？

### 选项

- `refuse`，当队列填满时，拒绝新到来的异步调用。执行异步调用的回调函数，传递一个`TooMuchAsyncCallError`异常。默认为`false`。
- `timeout`，设置全局异步调用超时时间，经过`push`后执行的异步调用，如果在超时时间内没有返回执行，将会执行异步调用的回调函数，传递一个`BagpipeTimeoutError`异常。默认为`null`不开启。

## 原理
`Bagpipe`通过`push`将调用传入内部队列。如果活跃调用小于最大并发数，将会被取出直接执行，反之则继续呆在队列中。当一个异步调用结束的时候，会从队列前取出调用执行。以此来保证异步调用的活跃量不高于限定值。
当队列的长度大于1时，Bagpipe对象将会触发它的`full`事件，该事件传递队列长度值。该值有助于评估业务性能参数。示例如下：

```
bagpipe.on('full', function (length) {
  console.warn('底层系统处理不能及时完成，排队中，目前队列长度为:' + length);
});
```

如果队列的长度也超过限制值，这里可以通过`refuse`选项控制，是直接传递异常拒绝服务还是继续排队。默认情况`refuse`为`false`。如果设置为`true`，新的异步调用将会得到`TooMuchAsyncCallError`异常，而被拒绝服务。

```
var bagpipe = new BagPipe(10, {
  refuse: true
});
```

如果异步调用的超时不可预期，可能存在等待队列不均衡的情况，为此可以全局设置一个超时时间，对于过长的响应时间，提前返回超时状态。

```
var bagpipe = new BagPipe(10, {
  timeout: 1000
});
```

## 模块状态
单元测试通过状态：[![Build Status](https://secure.travis-ci.org/JacksonTian/bagpipe.png)](http://travis-ci.org/JacksonTian/bagpipe)。单元测试覆盖率[100%](http://html5ify.com/bagpipe/coverage.html)。

## 最佳实践
- 确保异步调用的最后一个参数为回调参数
- 监听`full`事件，以增加你对业务性能的评估
- 目前异步方法未支持上下文。确保异步方法内部没有`this`引用。如果存在`this`引用，请用`bind`方法传递正确的`this`上下文
- 异步调用应当具备timeout的业务处理，无论业务是否完成，总在一定的时间内保证返回

## 实际案例
当你需要遍历文件目录的时候，异步可以确保充分利用IO。你可以轻松发起成千上万个文件的读取。但是，系统文件描述符是有限的。不服的话，遇见下面这个错误再来重读此文。

```
Error: EMFILE, too many open files
```
也有人会考虑用同步方法来进行处理。但是，同步时，CPU与IO并不能并行利用，一定情况下，性能是不可弃的一项指标。用上`Bagpipe`，可以轻松享受并发，也能限制并发。

```
var bagpipe = new Bagpipe(10);

var files = ['这里有很多很多文件'];
for (var i = 0; i < files.length; i++) {
  // fs.readFile(files[i], 'utf-8', function (err, data) {
  bagpipe.push(fs.readFile, files[i], 'utf-8', function (err, data) {
    // 不会因为文件描述符过多出错
    // 妥妥的
  });
}
```

## License
在[MIT](https://github.com/JacksonTian/bagpipe/blob/master/MIT-License)许可证下发布，欢迎享受开源

