import axios from "axios"
const AxiosInstance =  axios.create({
    // 基础的url
    baseURL: "http://localhost:9205",
    // 超时配置
    timeout: 5000,
    headers: {

    }
})
// 添加请求拦截器
AxiosInstance.interceptors.request.use(config => {
    // loadingInstance = Loading.service({
    //   lock: true,
    //   text: 'loading...'
    // })
    return config
  })
  // 添加响应拦截器
AxiosInstance.interceptors.response.use(response => {
    // loadingInstance.close()
    // console.log(response)
    return response.data
  }, error => {
    // console.log('TCL: error', error)
    // const msg = error.Message !== undefined ? error.Message : ''
    // Message({
    //   message: '网络错误' + msg,
    //   type: 'error',
    //   duration: 3 * 1000
    // })
    // loadingInstance.close()
    return Promise.reject(error)
  })

export default AxiosInstance