import MarkdownNavbar from '../../../component/MarkdownNavbar/index'
import { useEffect, useState } from 'react'
import { getPreFixCls } from '../../../util/getPrefixCls'
import MarkdownView from '../../../component/MarkdownView'
// 导入用于测试的Makedown文件
import './style/all.less'
import raw from 'raw.macro'
import classNames from 'classnames'
import { List, ListContent } from '../../../component/List'
export const AllNote = (props: { theme?: string }) => {
    const { theme } = props
    // 控制Markdown的显示内容
    const [content, setContent] = useState<string>('')
    // 控制当前的Markdown对应的Url
    const [url] = useState<string>('')
    // 设置List显示的内容
    const [ListContent, SetListContent] = useState<ListContent[]>([])
    const prefixCls = getPreFixCls('note')
    // 获取对应的 List数据
    useEffect(() => {
        SetListContent([
            {
                title: 'Vue',
                titleUrl: '/ds'
            },
            {
                title: 'JS',
                titleUrl: '/ds',
                list: [
                    { label: 'sasas', url: 'sas' },
                    { label: 'sasas', url: 'sas' },
                    { label: 'sasas', url: 'sas' },
                    { label: 'sasas', url: 'sas' },
                    { label: 'sasas', url: 'sas' }
                ]
            },
            {
                title: 'CSS',
                titleUrl: '/ds'
            }
        ])
    }, [])
    // 获取对应的Makedown文件
    useEffect(() => {
        // 通过网络请求获取对应的Markdown文件内容
        // const test1 = article;
        const test1 = raw('../../../static/makedown/test4.md')
        setContent(test1)
    }, [url])
    return (
        <div className={classNames(`${prefixCls}-container`, theme)}>
            <div className={`${prefixCls}-box`}>
                <div className={`${prefixCls}-total`}>
                    <List
                        onClick={(url: string) => console.log('当前点击的是', url)}
                        content={ListContent}
                    ></List>
                </div>
                <MarkdownView
                    textContent={content}
                    darkMode={true}
                    className={`${prefixCls}-view`}
                ></MarkdownView>
                <MarkdownNavbar theme={theme?"dark":""} className={`${prefixCls}-navbar`} source={content}></MarkdownNavbar>
            </div>
        </div>
    )
}
