# 异步编程
异步编程的路线：callback -> Promise -> Generator -> async / await  
Promise是对callback方式的优化

## callback  
callback的痛点  
1. 信任危机  
2. 执行顺序与大脑的思考方式是相违和的  
3. 错误捕获  

__信任危机__  
最重要的问题就是信任危机，这是最不显眼却又最重要的问题  
第三方api可能存在的问题
1. 多次调用
2. 不调用
3. 顺序问题：同步或者异步

__执行顺序与大脑的思考方式是相违和的__  
`这才是“回调地狱”想表达的！嵌套/缩进基本上一个余兴表演，转移注意力的东西。`  
`我们顺序的，阻塞的大脑规划行为和面向回调的异步代码不能很好地匹配。这就是需要清楚地阐明的关于回调的首要缺陷：它们在代码中表达异步的方式，是需要我们的大脑不得不斗争才能保持一致的。`  
`嵌套/缩进`不是造成回调地狱的根本原因，罪魁祸首是回调表达异步的方式的问题

__错误捕获__  
异步回调的错误是无法使用try catch捕获的，所以不要想着包一层try catch就万事大吉了。  
原因：异步回调会添加在`宏任务`或者`微任务`中，执行栈中清空后才会将队列添加至执行栈中，这时原函数已经出栈了，所以try catch也就已经不存在了。

## Promise👏  
庆幸的是我们有了Promise
控制反转在反转!!

__信任危机__  
1. 多次调用问题：Promise的状态只能`pending` -> `fulfilled`， `pending` -> `rejected`，并且状态改变后任何操作都不能更改状态。 
2. 不调用问题： Promise.race
3. 同步或者异步：无论Promise中的任务是同步还是异步，Promise都会将其变成`微任务`  
PromiseA+ 规范：`实践中要确保 onFulfilled 和 onRejected 方法异步执行，且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行。`

__执行顺序__   
Promise的执行顺序是跟大脑的思维方式是一致的

__错误捕获__  
Promise会吞掉所有错误，将错误返回在catch函数。  
但是Promise依然有很多问题,如：如果一个then返回的Promise没有注册错误事件，也没有被try catch，那么它的错误就会暴露在控制台。  
相信后面的js会有更好的解决方案~  


### 参考文章
阮一峰老师的 <a href='https://es6.ruanyifeng.com/#docs/promise'>Promise 对象</a>  
冴羽大佬的 <a href='https://github.com/mqyqingfeng/Blog/issues/98'>ES6 系列之我们来聊聊 Promise</a>  
中文翻译<a href='http://gdut_yy.gitee.io/doc-ydkjs/async&performance/ch3.html'>你不知道的javascript</a>  
英文原文 Kyle Simpson 的<a href='https://github.com/getify/You-Dont-Know-JS'>You-Dont-Know-JS</a>  


### 面试题
<a href='./src/my-promise.js'>手写Promise，通过Promise A+ 规范 </a>
<a href='./src/cancel-promise/index.js'>取消Promise</a>  
<a href='./src/await-promise/index.js'>串行Promise</a>  
<a href='./src/async-promise/index.js'>并行Promise</a>  
<a href='./src/面试题1.md'>一道字节跳动的Promise的面试题</a>    
<a href='./src/面试题2.md'>stackOverflow上的一道Promse题（resolve(thenable) and resolve('non-thenable-object')）--附带赠送面试题</a>    
<a href='./src/面试题3.md'>一道蚂蚁金服异步串行的面试题</a>   
<a href='./src/面试题4.md'>node eventLoop 与 浏览器的不同</a>   
<a href='./src/eventLoop.md'>eventLoop</a>   












