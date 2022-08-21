/* eslint-disable react/no-array-index-key */
import classNames from "classnames"
import { CSSProperties, useEffect, useState } from "react"
import { getPreFixCls } from "../../util/getPrefixCls"
import { ImgArray } from "../../util/returnStaticRandomBackImg"
import "./index.less"
type TurnPictureProps = {
    WindowStyle?:CSSProperties
    ContainerStyle?: CSSProperties
    TitleStyle?: CSSProperties
    TextStyle?: CSSProperties
    itemArray: Item[],
    //  是否有定时器 周期是多长时间
    hasTimer? : boolean
    period?:number
}
type Item = {
    backImg : string
    Title:string | undefined
    Text: string| undefined
}
export const TurnPicture = (props:TurnPictureProps) => {
    const [relativePosition, setRelativePosition, hasTimer = false, period = 4] = useState<number>(0)
    const prefixCls = getPreFixCls("turn-picture")
    const {WindowStyle, ContainerStyle, TitleStyle, TextStyle, itemArray} = props
    // 设置定时器
    useEffect(() => {
        let Timer :any
        if(hasTimer) {
            Timer = setInterval(() => {
                setRelativePosition(val => val === itemArray.length -1 ?0:val+1)
            }, period*1000)
        }
        return () => { if(hasTimer)clearInterval(Timer)}
    }, [ImgArray])
    return (<div className={classNames(`${prefixCls}-window`)} style={{...WindowStyle}}>
        <div className={`${prefixCls}-span-array`}>
            {new Array(itemArray.length).fill(1).map((val, index) => <span className={relativePosition ===index?`${prefixCls}-span`: "" } onClick={() => {setRelativePosition(index)}} key={index}></span>)}
        </div>
        {itemArray?.map(value => {
            return (<div className={classNames(`${prefixCls}-container`)} style={{transform: `translateY(${relativePosition * -100}%)`, backgroundImage: `url(${value.backImg})`, ...ContainerStyle}} key={value.backImg}>
                <div className={classNames(`${prefixCls}-text-container`)}>
                    <h2 style={{...TitleStyle}}>{value.Title}</h2>
                    <p style={{...TextStyle}}>{value.Text}</p>
                </div>
            </div>)
        })}
    </div>)

}