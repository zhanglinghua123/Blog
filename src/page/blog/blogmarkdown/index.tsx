import { message } from 'antd'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import MarkdownNavbar from '../../../component/MarkdownNavbar/index'
import MarkdownView from '../../../component/MarkdownView'
import { PageHead } from '../../../component/PageHead'
import AxiosInstance from '../../../network/axios'
import { getPreFixCls } from '../../../util/getPrefixCls'
import { ImgArray } from '../../../util/returnStaticRandomBackImg'
import './index.less'
// https://js1k.com/2016-elemental/details/2611
export const BlogPre = (props: Partial<{ theme: boolean }>) => {
    const { theme } = props
    const [Source, SetSource] = useState<string>('')
    //  获取参数
    const params = useParams()
    const [Loading, SetLoading] = useState<boolean>(true)
    const prefixCls = getPreFixCls('blogPre')
    // 当前显示的背景图
    const [ImgIndex] =  useState<number>(Math.floor(Math.random()*ImgArray.length))
    useEffect(() => {
        AxiosInstance.request<any, any>({url: "/blog/getBlog", params: {
            id: params.id
        }}).then(val => {
            SetSource((val as any).markdown)
            SetLoading(false)
        })
    }, [params.id])
    return (
        <>
            <PageHead backgroundImg={ImgArray[ImgIndex]} HeadSentence={["记录生活的点滴", "record the moments of life"]}></PageHead>
            <div
                className={classNames(`${prefixCls}-container`, {
                    light: !theme,
                    night: theme
                })}
            >
         
                <MarkdownView deleteIcon deleteConfirm={() => {
                    AxiosInstance({url: "/blog/deleteBlog", params: {id: params.id}}).then(() => {
                        message.success("删除成功", 3)
                    })
                }} modifyUrl={`/blog/modify/${params.id}`} loading={Loading} textContent={Source} className={`${prefixCls}-view`}></MarkdownView>
                <MarkdownNavbar theme={theme?"dark":""} source={Source} className={`${prefixCls}-navbar`}></MarkdownNavbar>
            </div>
        </>

    )
}
