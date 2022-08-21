import MarkdownNavbar from '../../component/MarkdownNavbar/index'
import { useEffect, useState } from 'react'
import { getPreFixCls } from '../../util/getPrefixCls'
import MarkdownView from '../../component/MarkdownView'
// 导入用于测试的Makedown文件
import './index.less'
import classNames from 'classnames'
import { List, ListContent } from '../../component/List'
import AxiosInstance from '../../network/axios'
import { message } from 'antd'
export const Live = (props: { theme?: string }) => {
    const { theme } = props
    // 控制Markdown的显示内容
    const [content, setContent] = useState<string>('')
    // 控制当前的Markdown对应的Url
    const [url, SetUrl] = useState<string>('')
    // 设置List显示的内容
    const [ListContent, SetListContent] = useState<ListContent[]>([])
    const prefixCls = getPreFixCls('live')
    // 设置加载状态
    const [Loading, SetLoading] = useState<boolean>(true)
    // 获取对应的 List数据
    useEffect(() => {
        AxiosInstance.request<ListContent[], ListContent[]>({url: "/life/getLifeInfo"}).then((val) => {
            SetListContent(val)
        })
    }, [])
    // 获取对应的Makedown文件
    useEffect(() => {
        setContent("")
        SetLoading(true)
        AxiosInstance.request<{markdown:string}, {markdown:string}>({url: "/life/getLife", params: { id: url}}).then((val) => {
            setContent(val.markdown)
            SetLoading(false)
        })
    }, [url])
    const deleteConfirm = () => {
        AxiosInstance({url: "/life/deleteLife", params: {_id: url}}).then(() => {
            message.success("删除成功", 3)
        })
    }
    return (
        <div className={classNames(`${prefixCls}-container`, theme)}>
            <div className={`${prefixCls}-total`}>
                <List
                    onClick={(url: string) => SetUrl(url)}
                    content={ListContent}
                ></List>
            </div>
            <div className={`${prefixCls}-box`}>
                <MarkdownView
                    deleteIcon
                    deleteConfirm = {deleteConfirm}
                    modifyUrl={`//modify/${url}`}
                    loading={Loading}
                    textContent={content}
                    darkMode={true}
                    className={`${prefixCls}-view`}
                ></MarkdownView>
                <MarkdownNavbar theme={theme === "night"?"dark":""} className={`${prefixCls}-navbar`} source={content}></MarkdownNavbar>
            </div>
        </div>
    )
}
