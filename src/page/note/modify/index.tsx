import Vditor from 'vditor'
import classNames from 'classnames'
import 'vditor/dist/index.css'
import { getPreFixCls } from '../../../util/getPrefixCls'
import './index.less'
import MakedownNavbar from '../../../component/MarkdownNavbar'
import React, { useEffect, useState } from 'react'
import AxiosInstance from '../../../network/axios'
import { Input, message, Modal, Select } from 'antd'
import { useParams } from 'react-router-dom'
import { TimeoutRetry } from '../../../util/timeoutretry'
type NoteMessage = {
    markdown:string,
    title:string,
    category:string,
    _id:string,
}
type NoteProps = Partial<{
    // 当完成编写的时候 进行的回调函数
    onComplete: () => void;
    // 初始化的显示文字
    placeholder: string;
    // 是否为dark主题
    theme: boolean;
    // 初始化的src
    src:string
    // upload 图片的ip地址 
    uploadUrl : string
    // 修改的上传地址
    modifyUploadUrl : string
    // 初始化的时候的ip地址
    initUrl:string
    // esc后的回调函数
}>;
export const ModifyNote = (props: NoteProps) => {
    const { placeholder, onComplete, theme, src = ""} = props
    // Select value:Category
    const [SelectValue, SetSelectValue] = useState<string|undefined>(undefined)
    // Input value:Title
    const [Title, SetTitle] = useState<string|undefined>(undefined)
    const { Option } = Select
    // 类名前缀
    const prefixCls = getPreFixCls('note-modify')
    //  Vditor对象
    const [vd, setVd] = React.useState<Vditor>()
    let vditor:any
    // 当前的目录信息
    const [category, setcategory] = useState<string[]>()
    // 用来规定具体的narbar导航解析内容
    const [content, setContent] = useState<string>(
        placeholder || '编辑你想要的内容,完成的时候输入esc'
    )
    const [isModalVisible, setIsModalVisible] = useState(false)
    //  当前修改界面对应的数据id
    const url = useParams()

    const handleOk = () => {
        setIsModalVisible(false)
        AxiosInstance.request<any, any>({url: "/note/updateNote", method: "post", data: {
            title: Title,
            category: SelectValue,
            markdown: vd?.getValue(),
            _id: url.id
        }}).then(() => {
            message.success('笔记修改成功!')
        }).catch(() => {
            message.error("笔记未修改成功,请联系管理员进行修正!")
        })
    }
  
    const handleCancel = () => {
        setIsModalVisible(false)
    }
    useEffect(() => {
        vditor = new Vditor('vditor', {
            minHeight: window.innerHeight - 60,
            after: () => {
                // saveAs()
                vditor.setValue(src)
                setVd(vditor)
            },
            esc: () => {
                onComplete?.()
                setIsModalVisible(true)
            },
            ctrlEnter: () => {
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
    useEffect(() => {
        const Timer = setInterval(() => {
            if(vd.getValue()) {
                AxiosInstance.request<any, any>({url: "/note/updateNote", method: "post", data: {
                    title: Title,
                    category: SelectValue,
                    markdown: vd?.getValue(),
                    _id: url.id
                }}).then(() => {
                    message.success('笔记更新成功!')
                }).catch(() => {
                    message.error("笔记未修改成功,请联系管理员进行修正!")
                })
            }
        }, 180000)
        return () => {
            clearInterval(Timer)
        }
    }, [vd])
    //  根据修改的id 初始化对应的内容
    useEffect(() => {
        let ignore = false
        TimeoutRetry<NoteMessage>(() => 
            AxiosInstance.request<NoteMessage, NoteMessage>({url: "/note/getNote", params: { id: url.id}}
            ), 5).then((val) => {
            if(!ignore) {
                vditor.setValue(val.markdown)
                setVd(vditor)
                SetTitle(val.title)
                SetSelectValue(val.category)
            }
        })
        return () => {
            ignore = true
        }
    }, [])
    // 获取当前的目录信息
    useEffect(() => {
        AxiosInstance.request<string[], string[]>({url: "/note/getNoteAllCateGory"}).then((val) => {
            setcategory(val)
        })
    }, [isModalVisible])
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
            </Modal>
        </div>
    )
}
