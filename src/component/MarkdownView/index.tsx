import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import remarkGfm from 'remark-gfm'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { FourSphereRotate, Icon, Spin } from 'minereactcomponentlibrary'
import { useNavigate } from 'react-router-dom'
import "./index.less"
import classNames from 'classnames'
import { Popconfirm } from 'antd'
// darcula webstorm
// vscDarkPlus vscode暗色主题

type tProps = {
    textContent: string;
    darkMode?: boolean; // markdown文本
    ContainerStyle?: React.CSSProperties;
    className: string;
    // 是否正在加载
    loading?:boolean;
    // 当存在的时候 出现修改符号可以进行修改操作
    modifyUrl?:string;
    // 当存在的时候 出现修改符号可以进行修改操作
    deleteIcon?:boolean;
    // 确认删除的回调函数
    deleteConfirm?: ()=>void
};

const MarkdownView = (props: tProps) => {
    const navigate =  useNavigate()
    const { textContent, ContainerStyle: style, className, loading = false, modifyUrl, deleteIcon, deleteConfirm} = props
    return (
        <Spin fontBaseSize={"15px"} spinning={false} delay={loading ?0:10000000} indicator={<FourSphereRotate size="large" direction="left" SpinColor="#ACFCCC"></FourSphereRotate>}>
            <div style={style} className={classNames(className, 'blog-markdown')}>
                {
                    modifyUrl && <span style={{position: "absolute", right: "48px", cursor: "pointer"}} onClick={() => {
                        navigate(modifyUrl)
                    }}>
                        <Icon size='20px' src="edit"></Icon>
                    </span>
                }
                {
                    deleteIcon && <span style={{position: "absolute", right: "24px", cursor: "pointer"}} >
                        <Popconfirm
                            placement="bottomRight"
                            title={"是否确定删除"}
                            onConfirm={deleteConfirm}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Icon size='20px' src="delete_"></Icon>
                        </Popconfirm>
    
                    </span>
                }
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    // className="blog-markdown"
                    components={{
                    // eslint-disable-next-line no-unused-vars
                        code({  inline, className, children, style, ...props }) {
                            const match = /language-(\w+)/.exec(className || '')
                            // eslint-disable-next-line multiline-ternary
                            return !inline && match ? (
                                <SyntaxHighlighter
                                    // 不知道为啥需要连续的两个才能进行成功解析 ?
                                // eslint-disable-next-line react/no-children-prop
                                    children={String(children).replace(/\r\n/g, '\r\n\r\n').replace(/\n/g, "\n\n")}
                                    style={vscDarkPlus}
                                    language={match[1]}
                                    PreTag="div"
                                    // showLineNumbers
                                    {...props}
                                ></SyntaxHighlighter>
                            ) : (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            )
                        }
                    }}
                >
                    {textContent}
                </ReactMarkdown>
            </div>
        </Spin>
    )
}

export default MarkdownView
