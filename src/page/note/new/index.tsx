import Vditor from 'vditor'
import classNames from 'classnames'
import 'vditor/dist/index.css'
import { getPreFixCls } from '../../../util/getPrefixCls'
import './index.less'
import { saveAs } from '../../../util/downloadfile'
import MakedownNavbar from '../../../component/MarkdownNavbar'
import React, { useEffect, useState } from 'react'
type NoteProps = Partial<{
    // 当完成编写的时候 进行的回调函数
    onComplete: () => void;
    // 初始化的显示文字
    placeholder: string;
    // 是否为dark主题
    theme: boolean;
}>;
export const NewNote = (props: NoteProps) => {
    const { placeholder, onComplete, theme } = props
    const prefixCls = getPreFixCls('note-new')
    const [vd, setVd] = React.useState<Vditor>()
    // 用来规定具体的narbar导航解析内容
    const [content, setContent] = useState<string>(
        placeholder || '编辑你想要的内容,完成的时候输入esc'
    )
    useEffect(() => {
        const vditor = new Vditor('vditor', {
            minHeight: window.innerHeight - 60,
            after: () => {
                vditor.setValue(placeholder || '编辑你想要的内容,完成的时候输入esc')
                setVd(vditor)
            },
            esc: value => {
                onComplete?.()
                saveAs(value, 'test5.md')
            },
            theme: theme ? 'dark' : 'classic'
        })
        vd?.setTheme(
            theme ? 'dark' : 'classic',
            theme ? 'dark' : 'classic',
            theme ? 'dark' : 'classic'
        )
    }, [])
    useEffect(() => {
        vd?.setTheme(
            theme ? 'dark' : 'classic',
            theme ? 'dark' : 'classic',
            theme ? 'dark' : 'classic'
        )
    }, [theme])
    //  第一次渲染的时候 设置定时器
    useEffect(() => {
        const Timer = setInterval(() => {
            console.log('文件当前的之为-----', vd, vd?.getValue() || '')
            setContent(vd?.getValue() || '')
        }, 5000)
        return () => {
            console.log('Timer----', vd, vd?.getValue() || '')
            clearInterval(Timer)
        }
    }, [vd])
    return (
        <div
            style={
                vd?.getCurrentMode() === 'sv'
                    ? {
                          paddingLeft: '10%'
                      }
                    : undefined
            }
            className={classNames(`${prefixCls}-container`, {
                light: !theme,
                night: theme
            })}
        >
            <div
                id="vditor"
                style={
                    vd?.getCurrentMode() === 'sv'
                        ? {
                              width: '70vw'
                          }
                        : undefined
                }
                className={classNames('vditor', `${prefixCls}-vditor`)}
            />
            <MakedownNavbar theme={theme?"dark":""} className={`${prefixCls}-navbar`} source={content}></MakedownNavbar>
        </div>
    )
}
