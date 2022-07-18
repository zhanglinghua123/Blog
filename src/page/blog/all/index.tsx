import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { Card, CardProps } from '../../../component/Card/Card'
import { Tip, TipProps } from '../../../component/Tip/tip'
import AxiosInstance from '../../../network/axios'
import { getPreFixCls } from '../../../util/getPrefixCls'
import './index.less'
export const Blog = (props: { theme: boolean }) => {
    const { theme } = props
    

    // 用来显示的Tip数据
    const [TipArray, SetTipArray] = useState<TipProps[]>([])
    const [CardArray, SetCardArray] = useState<CardProps[]>([])
    const PrefixCls = getPreFixCls('blog')
    // 获取Blog信息
    useEffect(() => {
        AxiosInstance.request<{color:string, category:string}[], {color:string, category:string}[]>({url: "/blog/getBlogAllCateGory"}).then((val) => {
            SetTipArray(val.map(value => {
                return {
                    content: value.category,
                    color: "white",
                    backgroundColor: value.color
                }
            }))
        })
        AxiosInstance.request<{title:string, _id:string, time:string, category?:{color:string, category:string}[]}[], {title:string, _id:string, time:string, category:{color:string, category:string}[]}[] >({url: "/blog/getAllBlog"}).then(val => {
            SetCardArray(val.map(value => {
                return {
                    title: value.title,
                    titleurl: value._id,
                    time: value.time,
                    tipArray: value?.category?.map(val => {
                        return {
                            color: "white",
                            backgroundColor: val.color,
                            content: val.category
                        }
                    })
                }      
            }))
        }) 
    }, [])
    return (
        <div className={classNames(`${PrefixCls}-container`, theme ? 'night' : 'light')}>
            <div className={`${PrefixCls}-tip-container`}>
                {TipArray.map(val => {
                    return (
                        <Tip
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
                {CardArray?.map(value => {
                    return (
                        <Card
                            key={value.title || ""+value.titleurl}
                            className=""
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
        </div>
    )
}
