import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import MarkdownNavbar from '../../../component/MarkdownNavbar/index'
import MarkdownView from '../../../component/MarkdownView'
import AxiosInstance from '../../../network/axios'
import { getPreFixCls } from '../../../util/getPrefixCls'
import './index.less'
export const BlogPre = (props: Partial<{ theme: boolean }>) => {
    const { theme } = props
    const [Source, SetSource] = useState<string>('')
    //  获取参数
    const params = useParams()
    const prefixCls = getPreFixCls('blogPre')
    useEffect(() => {
        AxiosInstance.request<any, any>({url: "/blog/getBlog", params: {
            id: params.id
        }}).then(val => SetSource((val as any).markdown))
    }, [])
    return (
        <div
            className={classNames(`${prefixCls}-container`, {
                light: !theme,
                night: theme
            })}
        >
            <MarkdownView textContent={Source} className={`${prefixCls}-view`}></MarkdownView>
            <MarkdownNavbar theme={theme?"dark":""} source={Source} className={`${prefixCls}-navbar`}></MarkdownNavbar>
        </div>
    )
}
