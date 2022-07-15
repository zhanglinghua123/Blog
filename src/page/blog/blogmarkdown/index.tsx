import classNames from 'classnames'
import raw from 'raw.macro'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import MarkdownNavbar from '../../../component/MarkdownNavbar/index'
import MarkdownView from '../../../component/MarkdownView'
import { getPreFixCls } from '../../../util/getPrefixCls'
import './index.less'
export const BlogPre = (props: Partial<{ theme: boolean }>) => {
    const { theme } = props
    const [Source, SetSource] = useState<string>('')
    //  获取参数
    const params = useParams()
    const prefixCls = getPreFixCls('blogPre')
    useEffect(() => {
        console.log('params', params)
        const test1 = raw('../../../static/makedown/test4.md')
        SetSource(test1)
    }, [])
    return (
        <div
            className={classNames(`${prefixCls}-container`, {
                light: !theme,
                night: theme
            })}
        >
            <MarkdownView textContent={Source} className={`${prefixCls}-view`}></MarkdownView>
            <MarkdownNavbar source={Source} className={`${prefixCls}-navbar`}></MarkdownNavbar>
        </div>
    )
}
