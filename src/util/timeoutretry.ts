export function TimeoutRetry<T>(promiseFn:() => Promise<T>, time:number):Promise<T> {
    return new Promise((resolve, reject) => {
        let fn = function () {
            promiseFn().then(res => {
                resolve(res)
            }).catch(err => {
                if (time > 0) {
                    console.log(`倒数第${time}次重试`)
                    time--
                    fn()
                } else {
                    console.log('重试次数使用完毕，依然失败')
                    reject(err)
                }
            })
        }
        fn()
    })
}
