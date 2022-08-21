import {  CSSProperties,  useEffect,  useRef, useState } from "react"
import search from "../../static/svg/search.svg"
import anchor from "../../static/svg/anchor.svg"
import "./index.less"
import classNames from "classnames"
import { Icon } from "minereactcomponentlibrary"
import AxiosInstance from "../../network/axios"
import { getSamePrefix } from "../../util/getSamePrefix"
import { useNavigate } from "react-router-dom"

export type QueryDivProps = Partial<{
    // 最外层的Div样式
    ContainerStyle: CSSProperties,
    // input 的预显示文本
    PlaceHolder: string,
    // 有球必答字体大小 单位为px 通过这个来调整整个组件的高度 
    fontSize: number,
    // 是否记录历史的查询
    RememberHistory: boolean
    // 输入框的样式
    InputStyle:CSSProperties
    // 最多显示几个历史数据
    MaxHistory: number
    // 最多几个补全数据
    MaxCompletion: number
    // InitialValue 初始化QueryDIv的值
    InitialValue: string
}>
export const QueryDiv = (props: QueryDivProps) => {
    const { ContainerStyle, fontSize = 60,  InitialValue = "", PlaceHolder,  MaxCompletion = 6, InputStyle} = props
    // 用来控制input值的hooks
    const [InputValue, SetInputValue] = useState<string>(InitialValue)
    // 通过Ref 来时时刻刻记录当前的值 由于useState 无法获取最新的值
    const InputRef = useRef<string>("")
    // 展示的补全数组
    const [CompleteContent, SetCompleteContent] = useState<{title:string, _id:string}[]>([])
    // 搜索的title信息
    const [TitleMessage, SetTitleMessage] = useState<{title:string, _id:string}[]>([])
    // 用于导航的hook
    const navigate = useNavigate()
    useEffect(() => {
        let ignore = false
        AxiosInstance.request<{title:string, _id:string}[], {title:string, _id:string}[]>({url: "/blog/getAllTitle"}).then(val => {
            if(!ignore) {
                SetTitleMessage(val)
                // SetCompleteContent(val)
                console.log("val----", val)
            }
        })
        return () => {ignore = true}
    }, [])
    //  延时一秒后比较内容
    const getCompleteContent = (now:string) => {
        if(now === InputRef.current) 
            SetCompleteContent(getSamePrefix(TitleMessage, InputRef.current, 6))
        
    }
    const prefixCls = "component"
    // 当输入框内容发生改变的时候
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        InputRef.current = (e.target as any).value
        SetInputValue((e.target as any).value)
        let mid = e.target.value
        setTimeout(() => getCompleteContent(mid), 1000)
    }
    // value={InputValue} onChange={(e) => {console.log(e, "e---"); SetInputValue(e.target.value)}}
    return (<div className={`${prefixCls}-icon`} style={{ fontSize: `${fontSize}px`, ...ContainerStyle }}>
        <div className={`${prefixCls}-query-content`} style={{}}>
            <div className={classNames(`${prefixCls}-queryDiv`, {
                [`${prefixCls}-queryDivNoBottom`]: (CompleteContent.length > 0) && InputValue
            })}>
                <img src={search} alt="" className={`${prefixCls}-search`} ></img>
                <input style={{
                    marginLeft: `${fontSize * 0.2 - 2}px`,
                    height: `${fontSize * 0.5}px`,
                    paddingLeft: `2px`,
                    fontSize: "14px",
                    color: "black",
                    ...InputStyle
                }} placeholder={PlaceHolder} value={InputValue} onChange={onInputChange}></input>
                <img src={anchor} alt="" className={`${prefixCls}-anchor`} onClick={() => {
                    InputRef.current = ""
                    SetInputValue("")
                }}></img>
            </div>
            <ul className={`${prefixCls}-list`}>
                {InputValue && [...CompleteContent.slice(0, MaxCompletion)].map(val => {
                    console.log("val----", val.title, val._id)
                    return (<li key={val.title} 
                        onClick={() => navigate(`/blog/${val._id}`) }
                    >
                        <Icon src="search" style={{
                            height: "0.6em",
                            filter: "invert(66%) sepia(10%) saturate(195%) hue-rotate(169deg) brightness(93%) contrast(94%)"
                            // verticalAlign: "0.125em"
                        }} ></Icon>
                        <span style={{
                            marginLeft: `${0.2 * fontSize}px`,
                            lineHeight: `${fontSize}px`,
                            fontSize: `${0.6 * fontSize}px`
                        }}>{val.title}</span>
                    </li>)
                })}
            </ul>
        </div>
    </div>)
}
