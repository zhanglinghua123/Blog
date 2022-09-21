type Action = {
    type : "letter"
    value: string
}
class ShapeShifter {
    public Drawing : Drawing | undefined
    public Shape : Shape | undefined
    public ShapeBuilder : ShapeBuilder | undefined
    public interval : NodeJS.Timer | undefined
    init() {
        this.Drawing = new Drawing("canvas")
        this.Shape = new Shape()
        this.ShapeBuilder =  new ShapeBuilder()
        this.interval = undefined
        // eslint-disable-next-line consistent-this
        let Shifter = this
        this.Drawing.loop(function () {
            Shifter.Shape.render()
        })
    }
    perFormAction(action:Action) {
        switch(action.type) {
        case "letter":
            this.Shape.switchShape(this.ShapeBuilder.letter(action.value), false)
        }
    }
    // eslint-disable-next-line no-unused-vars
    timeAction(fn:(index:number)=>void, intervalCount:number, max:number, reverse:boolean) {
        clearInterval(this.interval)
        let currentAction = reverse ? max : 1
        fn(currentAction)
        // eslint-disable-next-line consistent-this
        let obj = this
        if (!max || (!reverse && currentAction < max) || (reverse && currentAction > 0)) {
            obj.interval = setInterval(function () {
                currentAction = reverse ? currentAction - 1 : currentAction + 1
                fn(currentAction)
    
                if ((!reverse && max && currentAction === max) || (reverse && currentAction === 0)) 
                    clearInterval(obj.interval)
            
            }, intervalCount)
        }
    }

}
class Point {
    // xy坐标 以及 z代表的半径
    public x : number | undefined
    public y : number | undefined
    public z : number | undefined
    // a代表的是其的透明度
    public a : number | undefined
    // 这个好像是代表的 延迟多少帧 再进行归位
    public h : number  | undefined
    constructor(args: {x?:number, y?:number, z?:number, a?:number, h?:number}) {    
        this.x = args.x
        this.y = args.y
        this.z = args.z
        this.a = args.a
        this.h = args.h
    }
}
interface Color{
    render() : string
}
// eslint-disable-next-line no-redeclare
class Color {
    public r:number
    public g:number
    public b:number
    public a:number
    constructor(r:number, g:number, b:number, a:number) {
        this.r = r
        this.g = g
        this.b = b
        this.a = a
    }
    render() {
        return 'rgba(' + this.r + ',' +  + this.g + ',' + this.b + ',' + this.a + ')'
    }
}
// 用来控制绘制流程的对象
class Drawing {
    // canvas 画板
    public canvas : HTMLCanvasElement 
    // 绘制上下文
    public context : CanvasRenderingContext2D 
    // 渲染函数
    public renderFn : (()=> void) | undefined
    // 用来控制渲染的函数
    public requestFrame 
    constructor(id:string) {
        this.canvas = document.getElementById(id)! as HTMLCanvasElement
        this.context = this.canvas!.getContext('2d')!
        this.renderFn = undefined
        this.requestFrame = window.requestAnimationFrame  ||
                function(callback) {
                    window.setTimeout(callback, 1000 / 60)
                }
        this.init()
        //  window.webkitRequestAnimationFrame ||
        //  window.mozRequestAnimationFrame    ||
        //  window.oRequestAnimationFrame      ||
        //  window.msRequestAnimationFrame     ||
    }
    // 初始化画板
    init() {
        window.addEventListener('resize', () =>
            this.adjustCanvas.bind(this)
        )
        // 当resize的时候 更新canvas的宽高
    }
    adjustCanvas() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
    }
    // 清空canvas 画布
    clearFrame() {
        this.context!.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
    // 获取canvas的区域
    getArea() {
        return { w: this.canvas.width, h: this.canvas.height }
    }
    // 绘制的循环事件
    // eslint-disable-next-line no-unused-vars
    loop(fn?:()=>void) {
        // 如果有render函数 则调用render函数 否则采用参数
        this.renderFn = !this.renderFn ? fn : this.renderFn
        this.clearFrame()
        // eslint-disable-next-line no-unused-expressions
        this.renderFn && this.renderFn()
        // 继续调用该函数进行渲染
        this.requestFrame.call(window, this.loop.bind(this) as any)
    }
    // 在某个地方画个圆
    drawCircle(p:Point, c:Color) {
        this.context.fillStyle = c.render()
        this.context.beginPath()
        this.context.arc(p.x!, p.y!, p.z!, 0, 2 * Math.PI, true)
        this.context.closePath()
        this.context.fill()
    }
}

// interface Dot {
//     clone : ()=>Dot,
//     draw : ()=>void,
//     moveTowards : (newPoint:Point)=>void,
//     update : ()=>void,
//     move:(newPosition:Point, aviod?:boolean)=>void,
//     distance:(newPoint:Point, getDetail:boolean)=>void,
//     render:()=>void,
// }
// eslint-disable-next-line no-redeclare
class Dot {
    //  位置
    public position : Point
    // 每次变换的距离s
    public speed : number
    //  该节点是否为组成文字的节点
    public stop : boolean
    // 颜色
    public color : Color
    // 最近的渲染状态
    public next : Point
    // 该节点接下来所有的渲染状态
    public nextStatus :Point []
    constructor(x:number, y:number) {
        //  p -> position
        this.position = new Point(
            {x,
                y,
                z: 5,
                a: 1,
                h: 0
            }
        )
        this.speed = 0.07
        this.stop = true
        this.color = new Color(255, 255, 255, this.position.a!)
        this.next = this.clone()
        this.nextStatus = []
    }
    // 复制出来一个相同的Dot
    clone() {
        return new Point({
            x: this.position.x,
            y: this.position.y,
            z: this.position.z,
            a: this.position.a,
            h: this.position.h}
        )
    }
    // 绘制到当前的Canvas中
    draw() {
        this.color.a = this.position.a
        S.Drawing.drawCircle(this.position, this.color)
    }
    // 大概就是更新位置
    moveTowards(newPosition:Point) {
        var details = this.distanceTo(newPosition, true),
            dx = details[0],
            dy = details[1],
            d = details[2],
            e = this.speed * d
        // 这里的h 似乎应该是用来避免浮点变化的
        if (this.position.h === -1) {
            this.position.x = newPosition.x
            this.position.y = newPosition.y
            return true
        }
        // 如果说距离大于1 则向目标接近 e大小的距离 小于1则一步到位
        if (d > 1) {
            this.position.x -= ((dx / d) * e)
            this.position.y -= ((dy / d) * e)
        } else {
            if (this.position.h > 0) 
                this.position.h--
            else 
                return true
          
        }

        // this.p.h !== -1 and (d > 1 || this.p.h > 0)
        return false
    }
    
    update () {
        if (this.moveTowards(this.next)) {
            // 
            var p = this.nextStatus.shift()
    
            if (p) {
                this.next.x = p.x || this.position.x
                this.next.y = p.y || this.position.y
                this.next.z = p.z || this.position.z
                this.next.a = p.a || this.position.a
                this.position.h = p.h || 0
            } else {
                // 如果不为组成文字的节点 则进行随机运动
                if (this.stop) {
                    this.position.x -= Math.sin(Math.random() * 3.142)
                    this.position.y -= Math.sin(Math.random() * 3.142)
                } else {
                    // 这里表达的是 在50，50的范围内部进行随机运动
                    this.move(new Point({
                        x: this.position.x + (Math.random() * 50) - 25,
                        y: this.position.y + (Math.random() * 50) - 25})
                    )
                }
            }
        }
    
        let d = this.position.a - this.next.a
        this.position.a = Math.max(0.1, this.position.a - (d * 0.05))
        d = this.position.z - this.next.z
        this.position.z = Math.max(1, this.position.z - (d * 0.05))
    }
    // 然后当前需要变更的坐标长度 以及 返回相距的距离及其具体的信息  
    distanceTo (newPosition:Point, details?:boolean) {
        var dx = this.position.x - newPosition.x!,
            dy = this.position.y - newPosition.y!,
            d = Math.sqrt(dx * dx + dy * dy)
    
        return details ? [dx, dy, d] : d
    }
    // 
    move (newPosition:Point, avoidStatic?:boolean) {
        if (!avoidStatic || (avoidStatic && this.distanceTo(newPosition) > 1)) 
            this.nextStatus.push(newPosition)
    }
    // 渲染函数
    render() {
        this.update()
        this.draw()
    }
}
class Shape {
    public dots : Dot[]
    public cx : number
    public cy : number
    public width : number
    public height : number
    constructor() {
        this.dots = []
        this.cx = 0
        this.cy = 0
        this.width = 0
        this.height = 0
    }
    // 
    compensate() {
        var a = S.Drawing.getArea()
        // 大概是绘制的起点吧
        this.cx = a.w / 2 - this.width / 2
        this.cy = a.h / 2 - this.height / 2
    }
    // 让每个dot 进行渲染
    render() {
        for (var d = 0; d < this.dots.length; d++) 
            this.dots[d].render()
    
    }
    shuffleIdle () {
        var a = S.Drawing.getArea()
        // 大概就是让每个Dot 进行随机的移动
        for (var d = 0; d < this.dots.length; d++) {
            if (!this.dots[d].stop) 
                this.dots[d].move(new Point({x: Math.random() * a.w, y: Math.random() * a.h}))
            
        }
    }
    // n 代表的是 绘制的节点信息 fast代表的是 大概意思是是否进行快速的迭代？
    switchShape(n:{points:Point[], w : number, h : number}, fast:boolean) {
        var size,
            a = S.Drawing.getArea()

        this.width = n.w
        this.height = n.h

        this.compensate()
        // 如果当前需要的dot 多于现存的dot 则新建这些dots
        if (n.points.length > this.dots.length) {
            size = n.points.length - this.dots.length
            for (let d = 1; d <= size; d++) 
                this.dots.push(new Dot(a.w / 2, a.h / 2))
      
        }

        let d = 0,
            i = 0

        while (n.points.length > 0) {
            // 不按照先后顺序进行更新 而是进行随机的节点更新操作
            i = Math.floor(Math.random() * n.points.length)
            this.dots[d].speed = fast ? 0.25 : (this.dots[d].stop ? 0.14 : 0.11)
            // 为节点添加随机放大的效果
            if (this.dots[d].stop) {
                this.dots[d].move(new Point({
                    // TODO: 这边跟源码处理不一样      
                    z: Math.random() * 20 + 10,
                    a: Math.random(),
                    h: 18}
                ))
            } else {
                this.dots[d].move(new Point({
                    z: Math.random() * 5 + 5,
                    h: fast ? 18 : 30
                }))
            }
            //  然后变为Stop的dot
            this.dots[d].stop = true
            // 再转移到新的位置
            this.dots[d].move(new Point({
                x: n.points[i].x! + this.cx,
                y: n.points[i].y! + this.cy,
                a: 1,
                z: 5,
                h: 0
            }))
            // 删除i个节点 
            n.points = n.points.slice(0, i).concat(n.points.slice(i + 1))
            d++
        }
        // 让当前多出来的节点变为背景中自由的节点
        for (let i = d; i < this.dots.length; i++) {
            if (this.dots[i].stop) {
                this.dots[i].move(new Point({
                    z: Math.random() * 20 + 10,
                    a: Math.random(),
                    h: 20
                }))

                this.dots[i].stop = false
                this.dots[i].speed = 0.04
                this.dots[i].move(new Point({ 
                    x: Math.random() * a.w,
                    y: Math.random() * a.h,
                    a: 0.3, // .4
                    z: Math.random() * 4,
                    h: 0
                }))
            }
        }
    }
}
class ShapeBuilder {
    public gap = 13
    public shapeCanvas = document.createElement('canvas')!
    public shapeContext = this.shapeCanvas.getContext('2d')!
    public fontSize = 500
    public fontFamily = 'Avenir, Helvetica Neue, Helvetica, Arial, sans-serif'
    constructor(gap?:number) {
        if(gap)
            this.gap = gap
        // 进行初始化
        this.init()
    }
    fit() {
        // 格式化宽度 并且让绘制的文字放置在中心
        this.shapeCanvas.width = Math.floor(window.innerWidth / this.gap) * this.gap
        this.shapeCanvas.height = Math.floor(window.innerHeight / this.gap) * this.gap
        this.shapeContext.fillStyle = 'red'
        this.shapeContext.textBaseline = 'middle'
        this.shapeContext.textAlign = 'center'
    }
    // 设置当前Canvas的字体大小
    setFontSize(s:number) {
        this.shapeContext.font = 'bold ' + s + 'px ' + this.fontFamily
    }
    // 判断是否为合格的数字
    isNumber(n:number) {
        return isFinite(n)
    }
    // 当窗口发生变换的时候 进行实时的更新
    init() {
        this.fit()
        window.addEventListener('resize', this.fit)
    }
    forMatString(str:string) {
        var s = 0

        this.setFontSize(this.fontSize)
        // 如果是数字就只有一行
        s = Math.min(this.fontSize,
            (this.shapeCanvas.width / this.shapeContext.measureText(str).width) * 0.8 * this.fontSize, 
            (this.shapeCanvas.height / this.fontSize) * (this.isNumber(parseInt(str)) ? 1 : 0.45) * this.fontSize)
        this.setFontSize(s)

        this.shapeContext.clearRect(0, 0, this.shapeCanvas.width, this.shapeCanvas.height)
        this.shapeContext.fillText(str, this.shapeCanvas.width / 2, this.shapeCanvas.height / 2)
    }
    letter(str:string) {
        let s = 0
  
        this.setFontSize(this.fontSize)
        s = Math.min(this.fontSize,
            (this.shapeCanvas.width / this.shapeContext.measureText(str).width) * 0.8 * this.fontSize, 
            (this.shapeCanvas.height / this.fontSize) * (this.isNumber(parseInt(str)) ? 1 : 0.45) * this.fontSize)
        this.setFontSize(s)
  
        this.shapeContext.clearRect(0, 0, this.shapeCanvas.width, this.shapeCanvas.height)
        this.shapeContext.fillText(str, this.shapeCanvas.width / 2, this.shapeCanvas.height / 2)
  
        return this.processCanvas()
    }
    // 将文字转换为 节点
    processCanvas() {
        let pixels = this.shapeContext.getImageData(0, 0, this.shapeCanvas.width, this.shapeCanvas.height).data
        let dots = [],
            x = 0,
            y = 0,
            fx = this.shapeCanvas.width,
            fy = this.shapeCanvas.height,
            w = 0,
            h = 0    
        // 像素点 四个为一个数组 因而需要 4 * gap的处理
        for (var p = 0; p < pixels.length; p += (4 * this.gap)) {
            if (pixels[p + 3] > 0) {
                dots.push(new Point({
                    x: x,
                    y: y
                }))
                // 分别记录 x 坐标 y 坐标的最大最小值
                w = x > w ? x : w
                h = y > h ? y : h
                fx = x < fx ? x : fx
                fy = y < fy ? y : fy
            }
            x += this.gap
            // 处理间距
            if (x >= this.shapeCanvas.width) {
                x = 0
                y += this.gap
                p += this.gap * 4 * this.shapeCanvas.width
            }
        }

        return { points: dots, w: w + fx, h: h + fy }
    }

}
export {
    S,
    ShapeShifter
}
var S : ShapeShifter = new ShapeShifter()