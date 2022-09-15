
import { getPreFixCls } from "../../util/getPrefixCls"
import "./index.less"
import Violet from "../../static/picture/violet.jpg"
import { Icon } from "minereactcomponentlibrary"
export const Envelope = (props:{
    // 用vw来进行标识
    size : number
    // 定位属性
    left? : string
    top? : string
    right? : string
    bottom? : string
}) => {
    const {size, left, top, right, bottom} = props
    const prefixCls = getPreFixCls("envelope")
    return (<div className={`${prefixCls}-container`} id={"container"}
        style={{
            width: `${size}vw`,
            // height: `${size * 0.825}vw`,
            position: "fixed",
            left: left,
            right: right,
            top: top,
            bottom: bottom
        }}>
        <div id="content" className={`${prefixCls}-content`} style={{
            bottom: `9vw`
        }}>
            <img src={Violet}></img>
            <Icon size="18px" style={{
                display: "inline",
                filter: "invert(12%) sepia(84%) saturate(6670%) hue-rotate(344deg) brightness(101%) contrast(105%)",
                cursor: "pointer"
            }} src="link" onClick={() => {
                let sumWidth = window.screen.width * 0.09 + window.screen.height * 0.7 - size * 0.01 * 0.6 * window.screen.width
                // console.log(window.screen.width, window.screen.height)
                let ele =  document.getElementById("content")
                let container = document.getElementById("container")
                let i = 0
                let Timer = setInterval(() => {
                    if(i === 400) {
                        clearInterval(Timer)
                        let j = 0
                        let OpacityTimer = setInterval(() => {
                            if(j === 200) clearInterval(OpacityTimer)
                            j++
                            container!.style.opacity = `${1 - j * 0.005}`
                        })
                    }
                    ele!.style.bottom = `calc(${size * 0.3}vw - ${i * 1 / 400 * sumWidth}px) `
                    i++
                }, 5)
            }}></Icon>
            <p style={{
                display: "inline-block"
            }}>来自<div contentEditable="true">陌生人</div>的留言</p>
            <div contentEditable="true"></div>
            <div id="input" contentEditable>写下你想要说的话吧</div>
            <div id="tips">
                <p className="tip">你要是有空的话，不如陪陪我</p>
                <p className="tip">我想与你一起，细数万千繁星</p>
            </div>
        </div> 
    </div>)
}