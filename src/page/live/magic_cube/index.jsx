import { useEffect } from "react"
import { getPreFixCls } from "../../../util/getPrefixCls"
import "./index.less"
import { BlockCoordinateSystem} from "../../../util/MatrixMulti"
import { Button } from "minereactcomponentlibrary"
// props 
// size 代表魔方的大小
// ContainerStyle 代表最外层容器的自定义样式
export const Cube = (props) => {
    const {size = 240} = props
    const prefixCls = getPreFixCls("life-cube")
    function z(t, e) {
        return t? e? t.appendChild(e) : "width:"+t+"px;height:"+t+"px;position:absolute;" : document.createElement("div")
    }

    // var t = 0
    // var x = 0
    // function w() {
    //     // eslint-disable-next-line no-unused-expressions
    //     ++t
    //     // 转够一圈后 让其变更方向
    //     if(t === 360)
    //     {
    //         t=0
    //         x=++x%3
    //     }
    //     // 由于整个魔方的一面是通过绝对定位来进行设置的 因而 可以通过给最外层的容器添加旋转效果来让其具备转动效果
    //     // eslint-disable-next-line no-unused-expressions
    //     for (const i in m) 2 === m[i][s[x]] ? m[i][u]["transform"] = "rotate"+s[x]+"(" + t + "deg)" : 0
    //     // 给整个魔方添加 转动效果
    //     c[u][a] = "rotate3d(1,1,1," + t + "deg)"
    //     requestAnimationFrame(w)
    // }
    var a = "transform",
        u = "style",
        v = "cssText",
        B = z(),
        c = z(),
        // eslint-disable-next-line no-unused-vars
        d, e, f, g, h, k, l, m = [], n, i, r="rotate", s = ["X", "Y", "Z"]
    // 用来进行点击旋转的数组 存储位于相同x轴或者是y轴的元素
    let xSameArray = new Array(3).fill({}).map(() => {
        return []
    })
    let ySameArray = new Array(3).fill({}).map(() => {
        return []
    })
    // 设置外层的容器节点
    B.classList.add(`${prefixCls}-background`)
    c.classList.add(`${prefixCls}-container`)
    
    // 对外层容器设置样式
    c.style.width = `${size}px`
    c.style.height = `${size}px`
    c.style.left = `calc(50vw - ${size/2}px)`
    c.style.top = `calc(50vh - ${size/2}px)`
    B.appendChild(c)
    // 安置二十七个小方块
    for (l = 27; l--;c.appendChild(f)) {
        //  g,h,k 代表的是 x,y,z轴的层数
        // X Y Z vector 代表的是 小方块平面上面的法向量
        // X Y rotateDeg 代表的是 小方块平面针对于世界坐标系的旋转角度
        f = document.createElement("div")
        f[u][v] = "transform-style:preserve-3d;"+ z(size)
        g = l % 3
        // f.X = g
        // f.NowX = g 
        h = (l - g) % 9 / 3
        // f.Y = h 
        // f.NowY = h
        // 利用~~ 将浮点数转换为 整数 k 代表其所在的z轴层数
        k = ~~(l / 9)
        // f.Z = k
        // f.NowZ = k
        console.log(g-1, h-1, k-1)
        f.Block = new BlockCoordinateSystem(g-1, h-1, k-1)
        f.style.transition = "transform 2s"
        f.style.transform = "rotateX(0deg) rotateY(0deg)"
        // // 统计节点 返回对应的y坐标
    
        xSameArray[g].push(f)
        ySameArray[h].push(f)
        e = document.createElement("div")
        // 确定最外层的小方块的位置
        e[u][v] = "transform-style:preserve-3d;" + z(size/3) +a+":translate3d(" + size/3 * g + "px," + size/3 * h + "px," + size/3 * (k-1) + "px)"
        for (n = 6; n--; e.appendChild(d)) 
        {
            // 让每个小方块 映射成为正方体
            d = document.createElement("div")
            d[u][v] = "transform-style:preserve-3d;"  + z(size * 17 / 60) + 
            `border-radius:${size * 3 / 80}px;border:${size/40}px solid #000;opacity:0.9;`+
            "transform"+":"+"rotateX(" + (4 > n ? 90 * n : 0) + "deg)"+"rotateY(" + (4 > n ? 0 : 4 === n ? -90 : 90) + "deg) translateZ(40px);"+
            "background-color:"+ (0===n&&2===k?"#05C":1===n&&0===h?"#FD0":2===n&&0===k?"#0A6":3===n&&2===h?"#FFF":4===n&&0===g?"#F60":5===n&&2===g?"#C24":"#000")}
        f.appendChild(e) 
        m.push(f)
    }
    // w()

    // 只进行一次挂载
    useEffect(() => {
        const cube = document.getElementById("blog-cube")
        cube.appendChild(B)
        return () => cube.removeChild(B)
    }, [])
    // 为每个正方体注册点击事件
    for(const item of m) {
        let Timer = 0
        item.addEventListener("click", (e) => {
            e.preventDefault()
            e.stopPropagation()
            // 利用定时器来进行避免双击单击事件的相互影响
            clearTimeout(Timer)
            Timer = setTimeout(() => {
                for(const ele of xSameArray[item.Block.WorldX + 1]) {
                    let OldYNumber = ele.Block.WorldY
                    // 根据当前的X转动角度进行更新
                    let mid = ele.Block.World_Rotate(90, "X")
                    // 更新样式 Y轴法向量 相同的小方块数组 最新的Y轴坐标
                    ySameArray[OldYNumber + 1].splice(ySameArray[OldYNumber + 1].indexOf(ele), 1)
                    ySameArray[ele.Block.WorldY + 1].push(ele)
                    ele.style["transform"] = ele.style["transform"] + mid.rotate
                }
            }, 500)
        })
        item.addEventListener("dblclick", () => {
            clearTimeout(Timer)
            for(const ele of ySameArray[item.Block.WorldY + 1]) {
                let OldXNumber = ele.Block.WorldX
                // 根据当前的X转动角度进行更新
                let mid = ele.Block.World_Rotate(90, "Y")
                // 更新X轴坐标, X轴相同的小方块数组, 最新的X轴坐标
                xSameArray[OldXNumber + 1].splice(xSameArray[OldXNumber + 1].indexOf(ele), 1)
                xSameArray[ele.Block.WorldX + 1].push(ele)
                ele.style["transform"] = ele.style["transform"] + mid.rotate
            } 
            // ySameArray[item.Y]["value"] %= 4
        })
    }
    // 给最外层容器注册拖拽事件
    useEffect(() => {
        let xN = 45 
        let yN = 35
        let XMid = 45
        let YMid = 35
        const cube = document.getElementById("blog-cube")
        const cubeContainer = document.getElementsByClassName(`${prefixCls}-container`)[0]
        cubeContainer.style.transform = `rotateX(${-yN}deg) rotateY(${xN}deg)`
        function OnMouseDown(e) {
            e.preventDefault()
            e.stopPropagation()
            var x = e.clientX
            var y = e.clientY
            cube.addEventListener('mousemove', move)
            cube.addEventListener('mouseup', up)
            function move(e) {
                e.preventDefault()
                e.stopPropagation()
                var x1 = e.clientX
                var y1 = e.clientY
                XMid =  xN + (x1 - x)*0.4
                YMid = yN + (y1 - y)*0.4
                cubeContainer.style.transform = `rotateX(${-YMid}deg) rotateY(${XMid}deg) `
                // box.style.transform = 'translateZ(-150px) rotateY(' + xN + 'deg) rotateX(' + -yN + 'deg)'
            }
            function up() {
                xN = XMid
                yN = YMid
                cube.removeEventListener('mousemove', move)
            }
        }
        cube.addEventListener('mousedown', OnMouseDown)
        return () => cube.removeEventListener("mousedown", OnMouseDown)
    }, [])
    return (<div id="blog-cube"  >
        <div className={"blog-cube-button-group"}>
            <Button type="primary">打乱</Button>
            <Button type="primary">帮助</Button>
        </div>
    </div>)
}