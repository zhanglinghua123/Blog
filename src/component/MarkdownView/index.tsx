import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import remarkGfm from 'remark-gfm'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
// darcula webstorm
// vscDarkPlus vscode暗色主题

type tProps = {
    textContent: string;
    darkMode?: boolean; // markdown文本
    ContainerStyle?: React.CSSProperties;
    className: string;
};

const MarkdownView = (props: tProps) => {
    const { textContent, ContainerStyle: style, className } = props
    return (
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
                                children={String(children).replace(/\r\n/g, '\r\n\r\n')}
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
    )
}

export default MarkdownView
