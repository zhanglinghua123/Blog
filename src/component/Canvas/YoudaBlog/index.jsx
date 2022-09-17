export const Drawing = function() {
    // 参考资料：https://zhuanlan.zhihu.com/p/28257724
    document.addEventListener('touchmove', function (e) {
        e.preventDefault()
    })
    var c = document.getElementsByTagName('canvas')[0],
        x = c.getContext('2d')
    var pr = 1,
        w = window.innerWidth,
        h = window.innerHeight,
        f = 90,
        q,
        r = 0,
        u = Math.PI * 2,
        v = Math.cos,
        z = Math.random
    c.width = w * pr
    c.height = h * pr
    x.scale(pr, pr)
    x.globalAlpha = 0.6
    function i() {
        console.log("---")
        let w = window.innerWidth, h = window.innerHeight
        x.clearRect(0, 0, w, h)
        let grd = x.createLinearGradient(0.5*window.innerWidth-140, 65, 0.5*window.innerWidth+140, 135)  // 定义线性渐变对象，设定渐变线起始点和结束点坐标，坐标格式为(起始点x,起始点y,结束点x,结束点y)
        grd.addColorStop(0, "#d37700")   // 定义渐变线起点颜色
        grd.addColorStop(0.5, "yellow")   // 定义渐变线中间点的颜色
        grd.addColorStop(1, "#87CEFA")  // 定义渐变线结束点的颜色
        q = [{x: 0, y: h * .7 + f}, {x: 0, y: h * .7 - f}]
        while (q[1].x < w + f) d(q[0], q[1])
    }
    function d(i, j) {
        x.beginPath()
        x.moveTo(i.x, i.y)
        x.lineTo(j.x, j.y)
        var k = j.x + (z() * 2 - 0.25) * f,
            n = y(j.y)
        x.lineTo(k, n)
        x.closePath()
        r -= u / -50
        x.fillStyle = '#' + (v(r) * 127 + 128 << 16 | v(r + u / 3) * 127 + 128 << 8 | v(r + u / 3 * 2) * 127 + 128).toString(16)
        x.fill()
        q[0] = q[1]
        q[1] = {x: k, y: n}
    }
    function y(p) {
        var t = p + (z() * 2 - 1.1) * f
        return (t > h || t < 0) ? y(p) : t
    }
    document.onclick = i
    document.ontouchstart = i
    window.addEventListener("resize", () => {
        let canvas = document.getElementsByTagName("canvas")[0]
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        i()
    })
    i()
}
