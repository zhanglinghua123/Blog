import Vditor from 'vditor'
import classNames from 'classnames'
import 'vditor/dist/index.css'
import { getPreFixCls } from '../../../util/getPrefixCls'
import './index.less'
import MakedownNavbar from '../../../component/MarkdownNavbar'
import React, { useEffect, useState } from 'react'
import AxiosInstance from '../../../network/axios'
import {message, Modal, Select} from "antd"
import { Input } from 'antd'
import { ColorPicker } from '../../../component/ColorPicker'
import { Tip } from '../../../component/Tip/tip'
type NoteProps = Partial<{
    // 当完成编写的时候 进行的回调函数
    onComplete: () => void;
    // 初始化的显示文字
    placeholder: string;
    // 是否为dark主题
    theme: boolean;
}>;
export const NewBlog = (props: NoteProps) => {
    const { placeholder, onComplete, theme } = props
    const prefixCls = getPreFixCls('note-new')
    const { Option } = Select
     // Select value:Category
    const [SelectValue, SetSelectValue] = useState<string|undefined>(undefined)
     // Input value:Title
    const [Title, SetTitle] = useState<string|undefined>(undefined)
     // 当前的目录信息
    const [category, setcategory] = useState<string[]>()
    const [vd, setVd] = React.useState<Vditor>()
    // 用来规定具体的narbar导航解析内容
    const [content, setContent] = useState<string>(
        placeholder || '编辑你想要的内容,完成的时候输入esc'
    )
    // 设置弹窗是否显示的变量
    const [isModalVisible, setIsModalVisible] = useState(false)
    // 设置颜色的变量
    const [Color, SetColor] = useState<string>("rgb(121, 201, 155)")
    const handleOk = () => {
        setIsModalVisible(false)
        AxiosInstance.request<any, any>({url: "/note/newNote", method: "post", data: {
          title: Title,
          category: SelectValue,
          markdown: vd?.getValue()
      }}).then(() => {
          message.success('博客添加成功!')
      }).catch(() => {
          message.error("博客未添加成功,请联系管理员进行修正!")
      })
      }
    
      const handleCancel = () => {
        setIsModalVisible(false)
      }
     // 获取当前的目录信息
     useEffect(() => {
        AxiosInstance.request<string[], string[]>({url: "/note/getNoteAllCateGory"}).then((val) => {
            setcategory(val)
        })
    }, [isModalVisible])
    // 设置Vditor
    useEffect(() => {
        const vditor = new Vditor('vditor', {
            minHeight: window.innerHeight - 60,
            after: () => {
                vditor.setValue(placeholder || '编辑你想要的内容,完成的时候输入esc')
                setVd(vditor)
            },
            esc: () => {
                onComplete?.()
                setIsModalVisible(true)
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
            setContent(vd?.getValue() || '')
        }, 5000)
        return () => {
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
            <Modal title="编辑笔记标题以及分类" centered mask visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>

            <Select mode="tags" maxTagCount={1} style={{ width: '100%', marginBottom: "15px" }} value={SelectValue} placeholder="选择笔记对应的分类"
                onChange={(value) => {
                    if (value.length > 1)
                    SetSelectValue(value[1])
                    else
                    SetSelectValue(value[0])
                }}
            >
                {category?.map(val => {
                    return <Option key={val}>{val}</Option>
                })}
            </Select>
            <Input placeholder="编辑笔记的标题" value={Title} onChange={val => SetTitle(val.target.value)} />
            <ColorPicker style={{marginTop: "15px", marginBottom: "15px"}} color={Color} setColor={SetColor}></ColorPicker>
            <span style={{marginRight: "4px"}}>当前设置的Tip为</span>
            <Tip color={"white"}  
                style={{
                                marginLeft: '4px',
                                marginBottom: '10px',
                                padding: '4px 8px',
                                fontSize: '16px'
                            }} 
                backgroundColor={Color} content={SelectValue||"范例"} ></Tip>
            </Modal>
        </div>
    )
}
