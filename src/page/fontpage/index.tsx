/* eslint-disable react/jsx-key */
import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { Card, CardProps } from '../../component/MyCard/Card'
import { Intro } from './component/Intro'
import './style/index.less'
import Image from '../../static/picture/portrait.jpg'
import AxiosInstance from '../../network/axios'
import { PageHead } from '../../component/PageHead'
import { ImgArray } from '../../util/returnStaticRandomBackImg'
import { Spin, FourSphereRotate, Icon } from 'minereactcomponentlibrary'
import { notification } from 'antd'
import { NotifyAliPay, NotifyGithub, NotifyQQ, NotifyWeChat} from './component/Notification'
import { TurnPicture } from '../../component/TurnPicture'
type UserMessage = {
    blog:number,
    note:number,
    AliPay:string,
    Wechat : string,
    QQ:string,
    Github:string
}
type TitleProps = {
    [key:string]:{color:string, backgroundColor : string }
}
export const FontPage = (props: { isNight: boolean }) => {
    const { isNight } = props
    const prefixCls = 'fontpage'
    // 博客信息存储的地方
    const [CardArray, SetCardArray] = useState<CardProps[]>([])
    //  显示的句子数据
    const [HeadSentence] = useState<[string, string]>([
        '记 录 ,生 命 中 的 美 好',
        "Don't Cry,do laugh"
    ])
    // 用户的介绍信息
    const [userMessage, setUserMessage] = useState<UserMessage>()
    // 用户简介的Notify
    // eslint-disable-next-line no-unused-vars
    const [api, content] = notification.useNotification()
    // 用来实现滚动加载
    const [PageSize, SetPageSize] = useState<number>(1)
    // eslint-disable-next-line no-unused-vars
    const [PageLoading, SetPageLoading] = useState<boolean>(true)
    const PageLoadingRef = useRef<boolean>(PageLoading)
    const [ImgIndex] = useState<number>(Math.floor(Math.random()*ImgArray.length))
    const TitleMap = useRef<TitleProps>({})
    // 滚动监听的函数
    const Listener = () => {
        var scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
        // 滚动条滚动距离
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        // 窗口可视范围高度
        var clientHeight = window.innerHeight || Math.min(document.documentElement.clientHeight, document.body.clientHeight)
        if(clientHeight + scrollTop >= 0.9 * scrollHeight && Math.ceil((userMessage?.blog || 0)/10) >= PageSize) 
        {
            console.log(PageSize, "---", Math.ceil((userMessage?.blog || 0)/10))
            window.removeEventListener("scroll", Listener)
            SetPageSize(value => value+1)
        }
    }
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
                
                TitleMap.current = obj
            })}, [])
    // 网络请求
    useEffect(() => {
        let ignore = false
        const fetchData = async () => {
            await AxiosInstance.request<{title:string, _id:string, time:string, category?:{color:string, category:string}[]}[], {title:string, _id:string, time:string, category:{color:string, category:string}[]}[] >({url: "/blog/getAllBlog", params: {
                page: PageSize
            }}).then(val => {
                // 加载完毕后再进行监听函数
                window.addEventListener("scroll", Listener)
                if (val && !ignore)
                {
                    PageLoadingRef.current = false
                    SetCardArray(pre => [...pre, ...val.map(value => {
                        return {
                            title: value.title,
                            titleurl: "/blog/" + value._id,
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
            }) }
        fetchData()
        return () => {ignore = true}
    }, [PageSize])
    // 获取用户个人介绍的信息
    useEffect(() => {
        let ignore = false
        AxiosInstance.request<UserMessage, UserMessage>({url: "/user/admin"}).then(val => {
            if(!ignore) 
                setUserMessage(val)
        })
        return () => { ignore = true}
    }, [])
    // 进行滚动加载
    useEffect(() => {
        window.addEventListener("scroll", Listener)
        return () => window.removeEventListener("scroll", Listener)
    }, [])
    return (
        <div>
            <PageHead backgroundImg={ImgArray[ImgIndex]} HeadSentence={HeadSentence}></PageHead>
            <div
                className={classNames(`${prefixCls}-content`, {
                    light: !isNight,
                    night: isNight
                })}
            >
                <div className={`${prefixCls}-card-group`}>
                    {CardArray?.map(value => {
                        return <Card key={1} {...value}></Card>
                    })}
                    <Spin fontBaseSize={"14px"} spinning={false} delay={PageLoadingRef.current ? 0:10000000} indicator={<FourSphereRotate size="large" direction="left" SpinColor="#ACFCCC"></FourSphereRotate>}>
                        <div style={{ 
                            width: "calc(100% - 330px)",
                            height: "200px"
                        }
                        }></div>
                    </Spin>
                </div>
                
                <div className={`${prefixCls}-self-intro`}>
                    <Intro
                        portrait={<img src={Image}></img>}
                        hoverColor={'#61dafb'}
                        UserName="冰月二八"
                        iconArray={[<Icon src="githubfill" onClick={() => NotifyGithub({link: userMessage?.Github || ""})}></Icon>, 
                            <Icon src='QQcirclefill' onClick={() => NotifyQQ({placement: "bottomLeft", msg: `QQ号: ${userMessage?.QQ}`})}></Icon>, 
                            <Icon src='wechatfill' onClick={() => NotifyWeChat({placement: "bottomLeft", msg: `微信号: ${userMessage?.Wechat}`})}></Icon>, 
                            <Icon src='alipaycirclefill' onClick={() => NotifyAliPay({placement: "bottomLeft", src: userMessage?.AliPay||""})}></Icon>]}
                        statistics={[
                            ['博客', (userMessage?.blog || 0).toString()],
                            ['笔记', (userMessage?.note || 0).toString()]
                        ]}
                    ></Intro>
                    <TurnPicture
                        hasTimer
                        period={4}
                        WindowStyle={{
                            width: "300px",
                            height: "300px"
                        }}
                        ContainerStyle={{
                            width: "300px",
                            height: "300px"
                        }}
                        itemArray={[
                            {
                                backImg: ImgArray[2],
                                Title: "笔记",
                                Text: "记录学习的一脚一步"
                            },
                            {
                                backImg: ImgArray[4],
                                Title: "博客",
                                Text: "记录生活的思考"
                            },
                            {
                                backImg: ImgArray[5],
                                Title: "笃信",
                                Text: "相信自己的决定"
                            }
                        ]}></TurnPicture>
                </div>
                <div></div>
            </div>
        </div>
    )
}
