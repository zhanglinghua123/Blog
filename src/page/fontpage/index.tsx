import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { Card, CardProps } from '../../component/Card/Card'
import { Intro } from './component/Intro'
import './style/index.less'
import Image from '../../static/picture/portrait.jpg'
import AxiosInstance from '../../network/axios'
import { PageHead } from '../../component/PageHead'

export const FontPage = (props: { isNight: boolean }) => {
    const { isNight } = props
    const prefixCls = 'fontpage'
    // 博客信息存储的地方
    const [CardArray, SetCardArray] = useState<CardProps[]>()
    //  显示的句子数据
    const [HeadSentence] = useState<[string, string]>([
        '记 录 ,生 命 中 的 美 好',
        "Don't Cry,do laugh"
    ])

    useEffect(() => {
        AxiosInstance.request<{title:string, _id:string, time:string, category?:{color:string, category:string}[]}[], {title:string, _id:string, time:string, category:{color:string, category:string}[]}[] >({url: "/blog/getAllBlog"}).then(val => {
            SetCardArray(val.map(value => {
                return {
                    title: value.title,
                    titleurl: "/blog/" + value._id,
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
        <div>
            <PageHead HeadSentence={HeadSentence}></PageHead>
            <div
                className={classNames(`${prefixCls}-content`, {
                    light: !isNight,
                    night: isNight
                })}
            >
                <div className={`${prefixCls}-card-group`}>
                    {CardArray?.map(value => {
                        return <Card key={value.title} {...value}></Card>
                    })}
                </div>
                <div className={`${prefixCls}-self-intro`}>
                    <Intro
                        portrait={<img src={Image}></img>}
                        hoverColor={'#61dafb'}
                        UserName="冰月二八"
                        iconArray={['githubfill', 'QQcirclefill', 'wechatfill', 'alipaycirclefill']}
                        statistics={[
                            ['文章', '41'],
                            ['评论', '12']
                        ]}
                    ></Intro>
                </div>
                <div></div>
            </div>
        </div>
    )
}
