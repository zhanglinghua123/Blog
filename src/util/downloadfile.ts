export const saveAs = (data: string, filename: string) => {
    const blob = new Blob([data])
    var link = document.createElement('a')
    var body = document.querySelector('body')
    /* window.URL.createObjectURL可以用于在浏览器上预览本地图片或者视频,创建一个url*/
    link.href = window.URL.createObjectURL(blob) // 为Blob对象创建一个url地址
    link.download = filename
    /*
如果不设置download属性的话，呢么如果是jpg、txt等浏览器支持打开的属性，就会在浏览器打开该文件而不是下载下来
*/

    // fix Firefox
    link.style.display = 'none'
    body!.appendChild(link)

    link.click()
    body!.removeChild(link)

    window.URL.revokeObjectURL(link.href) // 释放地址
}
