import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import remarkGfm from 'remark-gfm'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { FourSphereRotate, Spin } from '@zhanglinghua123/minereactcomponentlibrary'
// darcula webstorm
// vscDarkPlus vscode暗色主题

type tProps = {
    textContent: string;
    darkMode?: boolean; // markdown文本
    ContainerStyle?: React.CSSProperties;
    className: string;
    // 是否正在加载
    loading?:boolean;
};

const MarkdownView = (props: tProps) => {
    const { textContent, ContainerStyle: style, className, loading = false} = props
    return (
        <Spin fontBaseSize={"15px"} spinning={false && loading} delay={loading ?0:10000000} indicator={<FourSphereRotate size="large" direction="left" SpinColor="#ACFCCC"></FourSphereRotate>}>
            <div style={style} className={className}>
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
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
