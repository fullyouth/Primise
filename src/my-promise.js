class MyPromise {
  constructor(executor) {
    this.executor = executor
    this.data = null
    this.reason = null
    this.status = 'pending' // pending | fulfilled | rejected
    this.cbs = []
    this.catchs = []
    this.resolve = this.resolve.bind(this)
    this.reject = this.reject.bind(this)
    this.then = this.then.bind(this)
    this.catch = this.catch.bind(this)
    try{
      executor(this.resolve, this.reject)
    } catch(res) {
      this.status = 'rejected'
      this.reason = res
      setTimeout(() => {
        this.reject()
      }, 0)
    }
  }

  resolve(data) {
    this.status = 'fulfilled'
    this.data = data
    this.cbs.forEach(itemFn => {
      itemFn(this.data)
    })
  }

  reject(data) {
    this.status = 'rejected'
    this.reason = data || this.reason
    this.catchs.forEach(itemFn => {
        itemFn(this.reason)
    })
  }

  then(resolveFn, rejectFn){
      return new MyPromise((resolve, reject) => {
        if (resolveFn) {
          this.cbs.push(() => {
            let reason
            let ret
            try {
              ret = resolveFn(this.data)
            } catch (error) {
              reason = error
            }
            if (ret instanceof MyPromise) {
              reason ? ret.then(() => reject(reason)) : ret.then(resolve)
            } else {
              reason ? reject(reason) : resolve(ret)
            }
          })
        }

        if (rejectFn) {
          this.catchs.push(() => {
            let reason
            let ret
            try {
              ret = rejectFn(this.reason)
            } catch (error) {
              reason = error
            }
            if (ret instanceof MyPromise) {
              reason ? ret.then(() => reject(reason)) : ret.then(resolve)
            } else {
              reason ? reject(reason) : resolve(ret)
            }
          })
        }
        
      })
    
  }

  catch(fn){
    return new MyPromise((resolve, reject) => {
      this.catchs.push(() => {
        const ret = fn(this.data) 
        if (ret instanceof MyPromise) {
          ret.then(resolve)
        } else {
          resolve(ret)
        }
      })
    })
  }
}
