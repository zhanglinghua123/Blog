import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { Card, CardProps } from '../../component/Card/Card'
import { Intro } from './component/Intro'
import './style/index.less'
import Image from '../../static/picture/portrait.jpg'

export const FontPage = (props: { isNight: boolean }) => {
    const { isNight } = props
    const prefixCls = 'fontpage'
    // 博客信息存储的地方
    const [CardArray, SetCardArray] = useState<CardProps[]>()
    //  显示的句子数据
    const [HeadSentence, SetHeadSentence] = useState<string[]>([
        '记 录 ,生 命 中 的 美 好',
        "Don't Cry,do laugh"
    ])

    useEffect(() => {
        SetCardArray([
            {
                title: '测试',
                time: '08,06,2022',
                tipArray: [
                    {
                        content: 'vue',
                        color: 'white'
                    },
                    {
                        content: 'vue',
                        color: 'white'
                    }
                ]
            },
            {
                title: '测试',
                time: '08,06,2022',
                tipArray: [
                    {
                        content: 'vue',
                        color: 'white'
                    },
                    {
                        content: 'vue',
                        color: 'white'
                    }
                ]
            },
            {
                title: '测试',
                time: '08,06,2022',
                tipArray: [
                    {
                        content: 'vue',
                        color: 'white'
                    },
                    {
                        content: 'vue',
                        color: 'white'
                    }
                ]
            },
            {
                title: '测试',
                time: '08,06,2022',
                tipArray: [
                    {
                        content: 'vue',
                        color: 'white'
                    },
                    {
                        content: 'vue',
                        color: 'white'
                    }
                ]
            },
            {
                title: '测试',
                time: '08,06,2022',
                tipArray: [
                    {
                        content: 'vue',
                        color: 'white'
                    },
                    {
                        content: 'vue',
                        color: 'white'
                    }
                ]
            }
        ])
    }, [])
    return (
        <div>
            <div className={classNames(`${prefixCls}-head`)}>
                <div className={`${prefixCls}-head-sentence`}>
                    <div>{HeadSentence[0]}</div>
                    <div>{HeadSentence[1]}</div>
                </div>
            </div>
            <div
                className={classNames(`${prefixCls}-content`, {
                    light: !isNight,
                    night: isNight
                })}
            >
                <div className={`${prefixCls}-card-group`}>
                    {CardArray?.map(value => {
                        return <Card {...value}></Card>
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
