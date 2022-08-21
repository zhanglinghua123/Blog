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
import { Tip } from '../../../component/MyTip/tip'
import { dateFormat } from '../../../util/getTime'
import { useParams } from 'react-router-dom'
type NoteMessage = {
    markdown:string,
    title:string,
    category:{color:string, category:string}[],
    _id:string,
}
type ModifyProps = Partial<{
    // 当完成编写的时候 进行的回调函数
    onComplete: () => void;
    // 初始化的显示文字
    placeholder: string;
    // 是否为dark主题
    theme: boolean;
}>;
export const ModifyBlog = (props: ModifyProps) => {
    const { placeholder, onComplete, theme } = props
    const prefixCls = getPreFixCls('life-modify')
    const { Option } = Select
    //  Select Value
    const [SelectValue, SetSelectValue] = useState<{color:string, category:string}[]>([])
    // Input value:Title
    const [Title, SetTitle] = useState<string|undefined>(undefined)
    // 当前的目录信息
    const [category, setcategory] = useState<string[]>()
    const [vd, setVd] = React.useState<Vditor>()
    let vditor:any
    // 用来规定具体的narbar导航解析内容
    const [content, setContent] = useState<string>(
        placeholder || '编辑你想要的内容,完成的时候输入esc'
    )
    // 设置弹窗是否显示的变量
    const [isModalVisible, setIsModalVisible] = useState(false)
    //  当前修改界面对应的数据id
    const url = useParams()
    // 设置颜色的变量
    const [Color, SetColor] = useState<string>("rgb(121, 201, 155)")
    const handleOk = () => {
        setIsModalVisible(false)
        AxiosInstance.request<any, any>({url: "/life/updateLife", method: "post", data: {
            title: Title,
            category: SelectValue,
            time: dateFormat("dd,mm,YYYY", new Date()),
            markdown: vd?.getValue(),
            _id: url.id
        //   time: 
        }}).then(() => {
            message.success('博客修改成功!')
        }).catch(() => {
            message.error("博客未修改成功,请联系管理员进行修正!")
        })
    }
    
    const handleCancel = () => {
        setIsModalVisible(false)
    }
    
    // 获取当前的目录信息
    useEffect(() => {
        AxiosInstance.request<string[], string[]>({url: "/life/getLifeAllCateGory"}).then((val) => {
            setcategory(val)
        })
    }, [isModalVisible])
    // 设置Vditor
    useEffect(() => {
        vditor = new Vditor('vditor', {
            minHeight: window.innerHeight - 60,
            after: () => {
                vditor.setValue(placeholder || '编辑你想要的内容,完成的时候输入esc')
                setVd(vditor)
            },
            esc: () => {
                onComplete?.()
                setIsModalVisible(true)
            },
            theme: theme ? 'dark' : 'classic',
            upload: {
                // url: "http://124.220.201.171:9205/img/upload",
                url: `http://101.35.56.56:9205/img/upload?token=${sessionStorage.getItem("token")||""}`,
                success: (editor:HTMLPreElement, msg:string) => { 
                    const imgArray = msg.split("@@@")
                    const str = "\n" +imgArray.join("\n")
                    // console.log(msg, imgArray, str,  vditor.getValue())
                    vditor.setValue(vditor.getValue()+str)
                    setVd(vditor)
                },
                error: () => {message.error("文件可能有重名,请变更后继续上传", 3)},
                headers: {
                    token: sessionStorage.getItem("token")||"",
                    Authorization: sessionStorage.getItem("token")||""
                },
                fieldName: "file",
                multiple: true
            }
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
    //  根据修改的id 初始化对应的内容
    useEffect(() => {
        AxiosInstance.request<NoteMessage, NoteMessage>({url: "/life/getLife", params: { id: url.id}}).then((val) => {
            vditor.setValue(val.markdown)
            setVd(vditor)
            SetTitle(val.title)
            SetSelectValue(val.category)
        })
    }, [])
    // 当颜色发生变化的时候 更新最后一个的颜色
    useEffect(() => {
        if(SelectValue.length>=1)
        {SetSelectValue(value => {
            value.splice(value.length-1, 1, {color: Color, category: value[value.length-1].category})
            return value
        })}
    }, [Color])
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
                        : {
                            width: '50vw'
                        }
                }
                className={classNames('vditor', `${prefixCls}-vditor`)}
            />
            <MakedownNavbar theme={theme?"dark":""} className={`${prefixCls}-navbar`} source={content}></MakedownNavbar>
            <Modal title="编辑笔记标题以及分类" centered mask visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>

                <Select mode="tags" style={{ width: '100%', marginBottom: "15px" }} value={SelectValue.map(val => val.category)} placeholder="选择笔记对应的分类"
                    onSelect={(value:any) => {SetSelectValue(val => [...val, {color: Color, category: value}])}}
                    onDeselect={(SelectValue: any) => {SetSelectValue(val => val.filter(value => value.category!==SelectValue))}}
                >
                    {category?.map(val => {
                        return <Option key={(val as any).category}>{(val as any).category}</Option>
                    })}
                </Select>
                <Input placeholder="编辑笔记的标题" value={Title} onChange={val => SetTitle(val.target.value)} />
                <ColorPicker style={{marginTop: "15px", marginBottom: "15px"}} color={Color} setColor={SetColor}></ColorPicker>
                <span style={{marginRight: "4px"}}>当前设置的Tip为</span>
                {SelectValue.map(val => {
                    return (
                        <Tip color={"white"} 
                            key={val.category} 
                            style={{
                                marginLeft: '4px',
                                marginBottom: '10px',
                                padding: '4px 8px',
                                fontSize: '16px'
                            }} 
                            backgroundColor={val.color} content={val.category}></Tip>)
                })}
            </Modal>
        </div>
    )
}
