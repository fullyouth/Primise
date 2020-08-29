class MyPromise {
  constructor(executor) {
    this.executor = executor
    this.data = null
    this.reason = null
    this.status = 'pending' // pending | fulfilled | rejected
    this.cbs = []
    this.catchs = []
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

  resolve = (data) => {
    this.status = 'fulfilled'
    this.data = data
    this.cbs.forEach(itemFn => {
      itemFn(this.data)
    })
  }

  reject = (data) => {
    this.status = 'rejected'
    this.data = data
    this.catchs.forEach(itemFn => {
        itemFn(this.reason)
    })
  }

  then = (resolveFn, rejectFn) => {
      return new MyPromise((resolve, reject) => {
        if (resolveFn) {
          this.cbs.push(() => {
            let reason
            let ret
            try {
              ret = resolveFn(this.data)
            } catch (error) {
              debugger
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

  resolvePromise = () => {

  }

  catch = (fn) => {
    return new MyPromise((resolve, reject) => {
      this.catchs.push(() => {
        const ret = fn(this.data) // TODO: data or Promise
        if (ret instanceof MyPromise) {
          ret.then(resolve)
        } else {
          resolve(ret)
        }
      })
    })
  }
}

const p1 = () => {
  return new MyPromise((resolve, reject) => {
    throw new Error('p11111')
  })
}

const a = p1()
a.then(
  (res) => {
      console.log(`success ${res}`)
      return 1
  },
  (err) => {
    console.log(`error ${err}`)
    return new MyPromise((resolve, reject) => {
      setTimeout(() => {
        resolve('111111')
      }, 1000)
    })
  }
).then(
  (res) => {
    console.log(`success ${res}`)
    throw new Error('22222')
    return 22222
  },
  (err) => {
    console.log(`error ${err}`)
  }
).then(
  (res) => {
      console.log(`success ${res}`)
  },
  (err) => {
    console.log(`error ${err}`)
  }
)

console.log(a)

/** 
try {
  new Promise((res, rej) => {
    setTimeout(() => {
      try {
        throw new Error(13123)
        
        rej(1)
      } catch (error) {
        
      }
    
    })
  }).then(
    res => {
      console.log('succcess1', res)
    },
    err => {
      console.log('err1', err)
      return 2
    }
  ).then(
    res => {console.log('succcess2', res)},
    err => {console.log('err2', err)}
  )
  .then(
    res => {console.log('succcess3', res)},
    err => {console.log('err3', err)}
  )
} catch (error) {
  
}

// */



