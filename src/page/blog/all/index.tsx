import { FourSphereRotate, Spin } from 'minereactcomponentlibrary'
// import { Spin } from 'antd'
import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { Card, CardProps } from '../../../component/MyCard/Card'
import { Tip, TipProps} from '../../../component/MyTip/tip'
import AxiosInstance from '../../../network/axios'
import { getPreFixCls } from '../../../util/getPrefixCls'
import './index.less'
type TitleProps = {
    [key:string]:{color:string, backgroundColor : string }
}
export const Blog = (props: { theme: boolean }) => {
    const { theme } = props
    
    // 用来实现滚动加载
    const [PageSize, SetPageSize] = useState<number>(1)
    // eslint-disable-next-line no-unused-vars
    const [PageLoading, SetPageLoading] = useState<boolean>(true)
    const PageLoadingRef = useRef<boolean>(PageLoading)
    const TipLoadingRef = useRef<boolean>(true)
    // 用来显示的Tip数据
    const [activeTip, setActiveTip] = useState<string>("")
    const [TipArray, SetTipArray] = useState<TipProps[]>([])
    const TitleMap = useRef<TitleProps>({})
    const [CardArray, SetCardArray] = useState<CardProps[]>([])
    const PrefixCls = getPreFixCls('blog')
    // 获取Blog信息
    useEffect(() => {
        AxiosInstance.request<{color:string, category:string}[], {color:string, category:string}[]>({url: "/blog/getBlogAllCateGory"})
            .then((val) => {
                let obj : TitleProps = {}
                val.forEach(value => {
                    obj[value.category] = {
                        color: "white",
                        backgroundColor: value.color 
                    }
                })
                SetTipArray(val.map(value => {
                    return {
                        content: value.category,
                        color: "white",
                        backgroundColor: value.color
                    }
                }))
                TitleMap.current = obj
            })}, [])
    //  请求具体的博客内容
    useEffect(() => {
        const fetchData = async () => { 
            await AxiosInstance.request<{title:string, _id:string, time:string, category?:{color:string, category:string}[]}[], {title:string, _id:string, time:string, category:{color:string, category:string}[]}[] >({url: "/blog/getAllBlog", params: {
                page: PageSize,
                tip: activeTip
            }}).then(newVal => {
                if(newVal) 
                {
                    PageLoadingRef.current  = false
                    TipLoadingRef.current = false
                    SetCardArray(pre => [...pre, ...newVal.map(value => {
                        return {
                            title: value.title,
                            titleurl: value._id,
                            time: value.time,
                            tipArray: value?.category?.map(val => {
                                return {
                                    color: "white",
                                    backgroundColor: TitleMap.current[val.category].backgroundColor,
                                    content: val.category
                                }
                            })
                        }      
                    })]) 
                }
            })
        }
        // console.log(PageLoadingRef.current, TipLoadingRef.current, "----")
        if(PageLoadingRef.current || TipLoadingRef.current)
        {
            fetchData()
            PageLoadingRef.current = false
            TipLoadingRef.current = false
        }
    }, [activeTip, PageSize])
    //  进行网络请求
    useEffect(() => {
        window.addEventListener("scroll", () => {
            var scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
            // 滚动条滚动距离
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
            // 窗口可视范围高度
            var clientHeight = window.innerHeight || Math.min(document.documentElement.clientHeight, document.body.clientHeight)
            if(clientHeight + scrollTop >= 0.9 * scrollHeight &&(PageLoadingRef.current === false)) 
            {
                PageLoadingRef.current = true
                SetPageSize(value => value+1)
            }
        })
    }, [])
    return (
        <div className={classNames(`${PrefixCls}-container`, theme ? 'night' : 'light')}>
            <div className={`${PrefixCls}-tip-container`}>
                {[{content: "全部", backgroundColor: "rgb(62, 175, 124)"}, ...TipArray].map(val => {
                    return (
                        <Tip
                            cursor='pointer'
                            onClick={() => {
                                setActiveTip(val.content ? 
                                    val.content === "全部"?"":val.content
                                    :"") 
                                SetPageSize(1)
                                SetCardArray([])
                                TipLoadingRef.current = true
                            }}
                            key={val.content}
                            fontSize={14}
                            style={{
                                marginLeft: '4px',
                                marginBottom: '10px',
                                padding: '4px 8px',
                                fontSize: '16px'
                            }}
                            {...val}
                        ></Tip>
                    )
                })}
            </div>
            <div>
                <Spin fontBaseSize={"14px"} spinning={false} delay={TipLoadingRef.current ? 0:10000000} indicator={<FourSphereRotate size="large" direction="left" SpinColor="#ACFCCC"></FourSphereRotate>}>
                    <div style={{marginTop: "30px", minHeight: "60vh", minWidth: "46vw" }}>
                        {CardArray?.map(value => {
                            return (
                                <Card
                                    key={value.title || ""+value.titleurl}
                                    // className=""
                                    titlestyle={{
                                        fontSize: '20px',
                                        fontWeight: '400'
                                    }}
                                    timestyle={{
                                        fontSize: '16px',
                                        margin: '4px 0'
                                    }}
                                    style={{
                                        marginTop: '30px',
                                        borderRadius: '10px',
                                        marginBottom: '30px'
                                    }}
                                    {...value}
                                ></Card>
                            )
                        })}
                    </div>
                
                </Spin>
                
            </div>
        </div>
    )
}
