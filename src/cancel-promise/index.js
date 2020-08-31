/**
 * Promise 支持外部resolve reject
 * @param {Promse} p 
 * @return {Promise} x
 */
function promseWrap(p) {
  let xResolve, xReject
  const x = new Promise((resolve, reject) => {
    xResolve = resolve
    xReject = reject
  })

  x.resolve = xReject
  x.reject = xResolve
  p.then(xResolve, xReject)
  return x
} 
