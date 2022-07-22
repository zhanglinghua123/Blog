import { createRoot } from "react-dom/client"
import "./index.less"
import {ReactComponent as  Heart} from '../../static/svg/heartfill.svg'
export const getRandom = function() {
    let allType = '0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f' // 16进制颜色
    let allTypeArr = allType.split(',') // 通过','分割为数组
    let color = '#'
    for (let i = 0; i < 6; i++) {
        // 随机生成一个0-16的数
        let random = Math.floor(Math.random() * allTypeArr.length)
        
        color += allTypeArr[random]
    }
    return color // 返回随机生成的颜色
}
export function AddClickOnHeart() {
    document.addEventListener("click", (e) => {
        const img = document.createElement("div")
        img.setAttribute("id", "click-heart")
        img.style.position = "fixed"
        img.style.top =  `${e.clientY +0}px`
        img.style.left = `${e.clientX +0}px`
        img.style.animation = "remove 2.1s"
        img.style.width = "20px"
        let count = 0
        setInterval(() => {
            if(img && count !== 100)
            {
                img.style.top =  `${e.clientY - count}px`
                count++
            }else if(count === 100) 
                img.remove()
        }, 20)
        document.body.appendChild(img)
        createRoot(img).render(<Heart style={{fill: getRandom()}}></Heart>)
    })
}