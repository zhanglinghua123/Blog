import { Button, Input, message, Modal, notification } from "antd"
import { useEffect, useState } from "react"
import { DreamGraph } from "../../../component/DreamGraph"
import AxiosInstance from "../../../network/axios"
import Girl from "../../../static/picture/女孩-removebg-preview.png"
import "./index.less"
type DreamMessage = {
    data:{todo:string}[]
    "begin-time":number
    _id:string
}
export const Dream = () => {
    // 控制Modal是否显示
    const [isModel, SetIsModel] = useState<boolean>(false)
    // 输入的新的心愿
    const [InputValue, SetInputValue] =useState<string>("")
    const [data, setdata] = useState<{todo:string}[]>([])
    // 除了todo之外的其他数据
    const [OtherData, SetOtherData] = useState<{"id":string, "begin-time":number}>({"id": "0", "begin-time": new Date().getTime()})
    // 弹出框的内容
    const close = (deleteval:string) => {
        const mid =  data.filter(val => {return val.todo !== deleteval}).map((val) => {return {todo: val.todo}})
        AxiosInstance.request(
            {
                url: "/dream/delete",
                method: "post", 
                data: {
                    Data: mid,
                    BeginTime: OtherData["begin-time"],
                    _id: OtherData["id"]
                }}).then((val) => {
            message.success("更新数据成功", 3)
            setdata(val.data)
            notification.close(deleteval+`open${OtherData["id"]}`)
        })}
    // 用来添加心愿的网络请求
    const imgClick = (newtodo:string) => {
        SetIsModel(false)
        AxiosInstance.request(
            {
                url: "/dream/new",
                method: "post", 
                data: {
                    Data: [...data.map(val => {return {todo: val.todo}}), {todo: newtodo}],
                    BeginTime: OtherData["begin-time"],
                    _id: OtherData["id"]
                }}).then((val) => {
            message.success("更新数据成功", 3)
            setdata(val.data)
        })
    }
    const circleClickEvent = (event:any, d:any) => {
        const btn = (
            <Button type="primary" size="small" onClick={() => close(d.todo)}>
          Confirm
            </Button>
        )
        notification.open({
            message: '心愿达成',
            description:
              '你确定当初的愿望已经实现了吗',
            btn,
            key: d.todo+`open${OtherData["id"]}`
        })
    }
    // 等待DOM 加载完毕后进行渲染SVG
    useEffect(() => {
        const test = async () => { AxiosInstance.request<DreamMessage, DreamMessage>({url: "/dream/all"}).then(val => {
            setdata(val.data)
            SetOtherData({"begin-time": val["begin-time"], id: val["_id"]})
        })}
        // 设置心愿图中的数据
        test()
    }, [])
    return (
        <>
            <div id="live">
                <DreamGraph clickEvent={circleClickEvent} data={data} ContainerId={"live"}></DreamGraph>
                <div className="Dream-img">
                    <span className="Dream-content">
                        <p>{`已经过去了${Math.floor((new Date().getTime()-OtherData["begin-time"])/86400000)}天`}</p>
                        <p>{`你许下了${data.length}个愿望`}</p>
                    </span>
                    <img onClick={() => SetIsModel(true)} src={Girl}></img>
                </div>
            </div>
            <Modal title="点亮新的心愿" centered mask visible={isModel} onOk={() => imgClick(InputValue)} onCancel={() => {SetInputValue(""); SetIsModel(false) }}>
                <Input placeholder="编辑新的心愿" value={InputValue} onChange={val => SetInputValue(val.target.value)} />
            </Modal>
        </>)
}