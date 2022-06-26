import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Card, CardProps } from '../../../component/card/Card';
import { Tip, TipProps } from '../../../component/tip/tip';
import { getPreFixCls } from '../../../util/getPrefixCls';
import './index.less';
export const Blog = (props: { theme: boolean }) => {
    const { theme } = props;
    // 用来显示的Tip数据
    const [TipArray, SetTipArray] = useState<TipProps[]>([]);
    const [CardArray, SetCardArray] = useState<CardProps[]>([]);
    const PrefixCls = getPreFixCls('blog');
    useEffect(() => {
        SetTipArray([
            {
                content: 'vue',
                color: 'white',
                backgroundColor: '#17FA04',
            },
            {
                content: 'vue',
                color: 'white',
            },
            {
                content: 'vue',
                color: 'white',
            },
            {
                content: 'vue',
                color: 'white',
            },
            {
                content: 'vue',
                color: 'white',
            },
            {
                content: 'vue',
                color: 'white',
            },
            {
                content: 'vue',
                color: 'white',
            },
            {
                content: 'vue',
                color: 'white',
            },
            {
                content: 'vue',
                color: 'white',
            },
            {
                content: 'vue',
                color: 'white',
            },
            {
                content: 'vue',
                color: 'white',
            },
            {
                content: 'vue',
                color: 'white',
            },
        ]);
        SetCardArray([
            {
                title: '测试',
                time: '08,06,2022',
                tipArray: [
                    {
                        content: 'vue',
                        color: 'white',
                    },
                    {
                        content: 'vue',
                        color: 'white',
                    },
                ],
            },
            {
                title: '测试',
                time: '08,06,2022',
                tipArray: [
                    {
                        content: 'vue',
                        color: 'white',
                    },
                    {
                        content: 'vue',
                        color: 'white',
                    },
                ],
            },
            {
                title: '测试',
                time: '08,06,2022',
                tipArray: [
                    {
                        content: 'vue',
                        color: 'white',
                    },
                    {
                        content: 'vue',
                        color: 'white',
                    },
                ],
            },
            {
                title: '测试',
                time: '08,06,2022',
                tipArray: [
                    {
                        content: 'vue',
                        color: 'white',
                    },
                    {
                        content: 'vue',
                        color: 'white',
                    },
                ],
            },
            {
                title: '测试',
                time: '08,06,2022',
                tipArray: [
                    {
                        content: 'vue',
                        color: 'white',
                    },
                    {
                        content: 'vue',
                        color: 'white',
                    },
                ],
            },
        ]);
    }, []);
    return (
        <div className={classNames(`${PrefixCls}-container`, theme ? 'night' : 'light')}>
            <div className={`${PrefixCls}-tip-container`}>
                {TipArray.map(val => {
                    return (
                        <Tip
                            style={{
                                marginLeft: '4px',
                                marginBottom: '10px',
                                padding: '4px 8px',
                                fontSize: '16px',
                            }}
                            {...val}
                        ></Tip>
                    );
                })}
            </div>
            <div>
                {CardArray?.map(value => {
                    return (
                        <Card
                            className=""
                            titlestyle={{
                                fontSize: '20px',
                                fontWeight: '400',
                            }}
                            timestyle={{
                                fontSize: '16px',
                                margin: '4px 0',
                            }}
                            style={{
                                marginTop: '30px',
                                borderRadius: '10px',
                                marginBottom: '30px',
                            }}
                            {...value}
                        ></Card>
                    );
                })}
            </div>
        </div>
    );
};
