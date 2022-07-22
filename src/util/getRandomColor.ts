export const getRandom = function() {
    let allType = '0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f' // 16进制颜色
    let allTypeArr = allType.split(',') // 通过','分割为数组
    let color = '#'
    for (let i = 0; i < 6; i++) {
        // 随机生成一个0-16的数
        let random = Math.ceil(Math.random() * allTypeArr.length)
        color += allTypeArr[random]
    }
    return color // 返回随机生成的颜色
}