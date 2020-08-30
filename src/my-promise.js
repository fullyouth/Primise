class MyPromise {
  constructor(executor) {
    this.executor = executor
    this.data = undefined
    this.reason = undefined
    this.status = 'pending' // pending | fulfilled | rejected
    this.cbs = []
    this.catchs = []
    this.resolve = this.resolve.bind(this)
    this.reject = this.reject.bind(this)
    this.then = this.then.bind(this)
    try{
      executor(this.resolve, this.reject)
    } catch(e) {
      this.reject(e)
    }
  }

  resolve(data) {
    if (this.status === 'pending') {
      this.status = 'fulfilled'
      this.data = data
      this.cbs.forEach(itemFn => {
        itemFn()
      })
    }
  }

  reject(data) {
    if (this.status === 'pending') {
      this.status = 'rejected'
      this.reason = data
      this.catchs.forEach(itemFn => {
        itemFn()
      })
    }
  }

  resolvePromise(p2, x, resolve, reject) {
    if (p2 === x) {
      return reject(new TypeError('循环引用'));
    }

    let called;
    if (x != null && (typeof x === 'object' || typeof x === 'function')) {
      try {
        let then = x.then;
        if (typeof then === 'function') {
          then.call(x, 
            (y) => {
              if (called) return
              called = true
              this.resolvePromise(p2, y, resolve, reject); 
          }, err => {
            if (called) return
            called = true
            reject(err)
          })
        } else {
          resolve(x)
        }
      } catch(err) {
        if (called) return
        called = true
        reject(err)
      }
    } else {
      resolve(x)
    }
  }
  

  then(resolveFn, rejectFn){
    resolveFn = typeof resolveFn === 'function' ? resolveFn : value => value;
    rejectFn = typeof rejectFn === 'function' ? rejectFn : err => {
      throw err
    };

    let p2 = new MyPromise((resolve, reject) => {
      if (this.status === 'fulfilled') {
        setTimeout(() => {
          try {
            const x = resolveFn(this.data)
            this.resolvePromise(p2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      }

      if (this.status === 'rejected') {
        setTimeout(() => {
          try {
            const x = rejectFn(this.reason)
            this.resolvePromise(p2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      }

      if (this.status === 'pending') {
        if (resolveFn) {
          this.cbs.push(() => {
            setTimeout(() => {
              try {
                const x = resolveFn(this.data)
                this.resolvePromise(p2, x, resolve, reject)
              } catch (error) {
                reject(error)
              }
            }, 0)
          })
        }

        if (rejectFn) {
          this.catchs.push(() => {
            setTimeout(() => {
              try {
                const x = rejectFn(this.reason)
                this.resolvePromise(p2, x, resolve, reject)
              } catch (error) {
                reject(error)
              }
            }, 0)
          })
        }
      }
      
    })
    
    return p2
  }
}

MyPromise.defer = MyPromise.deferred = function () {
  let dfd = {}
  dfd.promise = new MyPromise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
}

module.exports = MyPromise
