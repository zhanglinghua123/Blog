// 一维OTSU图像处理算法
function OTSUAlgorithm(id:string) {
    var m_pFstdHistogram = new Array()// 表示灰度值的分布点概率
    var m_pFGrayAccu = new Array()// 其中每一个值等于m_pFstdHistogram中从0到当前下标值的和
    var m_pFGrayAve = new Array()// 其中每一值等于m_pFstdHistogram中从0到当前指定下标值*对应的下标之和
    var m_pAverage=0// 值为m_pFstdHistogram【256】中每一点的分布概率*当前下标之和
    var m_pHistogram = new Array()// 灰度直方图
    var i, j
    var temp=0, fMax=0// 定义一个临时变量和一个最大类间方差的值
    var nThresh = 0// 最优阀值
    // 获取灰度图像的信息
    var imageInfo = GetGrayImageInfo(id)
    if(imageInfo === null) {
        // eslint-disable-next-line no-alert
        window.alert("图像还没有转化为灰度图像！")
        return
    }
    // 初始化各项参数
    for(i=0; i<256; i++) {
        m_pFstdHistogram[i] = 0
        m_pFGrayAccu[i] = 0
        m_pFGrayAve[i] = 0
        m_pHistogram[i] = 0
    }
    // 获取图像信息
    var canvasData = imageInfo[0]
    // 获取图像的像素
    var pixels = canvasData.data
    // 下面统计图像的灰度分布信息
    for(i=0; i<pixels.length; i+=4) {
        // 获取r的像素值，因为灰度图像，r=g=b，所以取第一个即可
        var r = pixels[i]
        m_pHistogram[r]++
    }
    // 下面计算每一个灰度点在图像中出现的概率
    var size = canvasData.width * canvasData.height
    for(i=0; i<256; i++) 
        m_pFstdHistogram[i] = m_pHistogram[i] / size
    
    // 下面开始计算m_pFGrayAccu和m_pFGrayAve和m_pAverage的值
    for(i=0; i<256; i++) {
        for(j=0; j<=i; j++) {
            // 计算m_pFGaryAccu[256]
            m_pFGrayAccu[i] += m_pFstdHistogram[j]
            // 计算m_pFGrayAve[256]
            m_pFGrayAve[i] += j * m_pFstdHistogram[j]
        }
        // 计算平均值
        m_pAverage += i * m_pFstdHistogram[i]
    }
    // 下面开始就算OSTU的值，从0-255个值中分别计算ostu并寻找出最大值作为分割阀值
    for (i = 0 ; i < 256 ; i++) {
        temp = (m_pAverage * m_pFGrayAccu[i] - m_pFGrayAve[i]) 
          * (m_pAverage * m_pFGrayAccu[i] - m_pFGrayAve[i]) 
          / (m_pFGrayAccu[i] * (1 - m_pFGrayAccu[i]))
        if (temp > fMax)
        {
            fMax = temp
            nThresh = i
        }
    }
    // 下面执行二值化过程 
    for(i=0; i<canvasData.width; i++) {
        for(j=0; j<canvasData.height; j++) {
            // 取得每一点的位置
            var ids = (i + j*canvasData.width)*4
            // 取得像素的R分量的值
            var r = canvasData.data[ids]
            // 与阀值进行比较，如果小于阀值，那么将改点置为0，否则置为255
            var gray = r>nThresh?255:0
            canvasData.data[ids+0] = gray
            canvasData.data[ids+1] = gray
            canvasData.data[ids+2] = gray
        }
    }
    // 显示二值化图像
    var newImage = (document.getElementById(id) as HTMLCanvasElement).getContext('2d')
    newImage.putImageData(canvasData, 0, 0)
}  
  
// 获取图像的灰度图像的信息
function GetGrayImageInfo(id:string):[ImageData, CanvasRenderingContext2D ] {
    var canvas = document.getElementById(id) as HTMLCanvasElement
    var ctx = canvas.getContext('2d')
    var canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    if(canvasData.data.length===0) 
        return null
   
    return [canvasData, ctx]
}
// 下面对灰度图像进行处理，将目标信息分割出来
function DividedTarget() {
    // 读取二值化图像信息
    var imageInfo = document.getElementById('myCanvasThreshold') as HTMLCanvasElement
    if(imageInfo === null) {
        // eslint-disable-next-line no-alert
        window.alert("没有发现二值化图像信息！")
        return
    }
    // 取得上下文
    var ctx = imageInfo.getContext('2d')
    // 获取图像数据
    var canvasData = ctx.getImageData(0, 0, imageInfo.width, imageInfo.height)
    // 取得图像的宽和高
    var width = canvasData.width
    var height = canvasData.height
    // 算法开始
    var cursor = 2
    for(var x=0; x<width; x++) {
        for(var y=0; y<height; y++) {
            // 取得每一点的位置
            var ids = (x + y*canvasData.width)*4
            // 取得像素的R分量的值
            var r = canvasData.data[ids]
            // 如果是目标点
            if(r===0) 
                continue
        }
    }
    
}
export {
    OTSUAlgorithm
}