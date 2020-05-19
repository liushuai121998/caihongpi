import fetch from '@system.fetch'
import prompt from '@system.prompt';
let BASE_URL = 'http://api.tianapi.com/txapi'

if(process.env.NODE_ENV === 'production') {
  BASE_URL = "http://api.tianapi.com/txapi"
}
const http = {
  get: function (url, params, options = {}) {
    return request({ url: BASE_URL + url, data: params, method: 'GET', ...options })
  },
  post: function (url, data, options = {}) {
    try {
      options.header = {
        "Content-Type": 'application/x-www-form-urlencoded'
      }
      return request({ url: BASE_URL + url, data, method: 'POST', ...options })
    } catch (e) {
		console.log(e)
    }
  },
  request: request
}


function request(options = {}) {
  const { url, data, header = {}, method = 'GET', responseType = 'json' } = options
  let abort = null
  const abortPromise = new Promise((resolve, reject) => { abort = reject })
  const requestPromise = new Promise((resolve, reject) => {
    if (!url) {
      reject(new Error('地址不存在。'))
      return
    }
    fetch.fetch({
      url,
      data,
      header,
      method,
      responseType,
      success(response) {
        resolve(response)
      },
      fail(error, code) {
        // prompt.showToast({
        //   message: error
        // })
        reject(error, code)
      },
      complete(data) {
        // console.log(data, 'complete')
      }
    })
  })
  const promise = Promise.race([requestPromise, abortPromise])
  promise.abort = abort
  return promise
}

export default http