import { Input, List, message, Modal, TimePicker } from "antd"
import { Button } from "minereactcomponentlibrary"
import "./index.less"
import { useEffect, useState } from "react"
import AxiosInstance from "../../../../network/axios"
import moment from "moment"
type Props = Partial<{
    // 用作更新的函数
    // upLoad : (content:string[], date:Date)=>void,
    // 对应的日期
    month:number,
    day:number,
    visible : boolean,
    // 当关闭的 回调函数
    onClose:()=>void,
    // 当新增列表项目的时候的回调函数
    onAdd : ()=>void
    // 当删除整个列表项目的时候的回调函数
    onDelete: ()=>void
}>
export type CalendarItem = {
    content : string,
    date : string,
}
export const CalendarItemEdit = (props : Props) => {
    const {month, day,  visible, onClose, onAdd, onDelete} = props
    // 控制是否展示面板
    const [isVisible, setisVisible] = useState<boolean>(false)
    // 所有事务信息的数据源
    const [dataSource, setDataSource] = useState<CalendarItem[]>([])
    // 用来控制Add 界面的hooks
    const [isAdd, setIsAdd] = useState<boolean>(false)
    const [inputValue, setInputValue] = useState<string>("")
    const [timeValue, setTimeValue] = useState<string|null>("00:00:00")
    const onAddCall = () => {
        setIsAdd(true)
    }
    console.log(month, day)
    const ComputedAllNeedData = (month:number, day:number):Date[] => {
        function addDate(date:Date, day:number) {
            return new Date(date.setDate(date.getDate() + day))
        }
        const year = new Date().getFullYear()
        const now = new Date(`${year}-${month}-${day}`)
        const reviewArray = [1, 2, 4, 7, 10, 13]
        return reviewArray.map(val => addDate(now, val))
    }
    const onDeleteCall = () => {
        AxiosInstance.request<{month:string, day:string, schedule:CalendarItem[]}, {month:string, day:string, schedule:CalendarItem[]}>
        ({url: "/life/calendar/delete", params: {
            month: month,
            day: day
        }}).then(() => {
            message.success("删除成功")
        })
        onDelete?.()
    }
    const onUpdate = () => {
        AxiosInstance.request<{month:string, day:string, schedule:CalendarItem[]}, {month:string, day:string, schedule:CalendarItem[]}>
        ({url: "/life/calendar/modify",
            method: "post",
            data: {
                month: month,
                day: day,
                schedule: dataSource
            }}).then(() => {
            message.success("更新成功")
        })
    }
    useEffect(() => {
        setisVisible(false)
        if(month && (day || -1)>=0)
        { 
            const fetch = async () => {
                await AxiosInstance.request<{month:string, day:string, schedule:CalendarItem[]}, {month:string, day:string, schedule:CalendarItem[]}>
                ({url: "/life/calendar/get", params: {
                    month: month,
                    day: day
                }}).then(val => {
                    if(val)
                        setDataSource(val.schedule)
                    else
                        setDataSource([])
                    setisVisible(visible || false)
                    console.log("当前的schedule为", val.schedule)
                })
            }
            fetch()
        }
    }, [month, day])
    return (<div>
        <Modal 
            closable={false}
            onCancel={() => {
                setisVisible(false)
                onClose?.()
            } }
            visible={isVisible}
            footer={[
                <Button key="back" onClick={onAddCall} style={{
                    marginRight: "10px"
                }}>
                  Add
                </Button>,
                <Button key="back" onClick={onUpdate} style={{
                    marginRight: "10px"
                }}>
                  Update
                </Button>,
                <Button key="submit" type="primary" onClick={onDeleteCall}>
                  Delete
                </Button>
            ]}>
            <List
                header={<div>您今日的日程清单</div>}
                bordered
                dataSource={dataSource}
                renderItem={(item, index) => (
                    <List.Item >
                        <Input value={item.content} onChange={(value) => {
                            let copy =  dataSource.slice()
                            copy[index].content = value.target.value
                            setDataSource(copy)
                        }}></Input>
                        <TimePicker onChange={(value) => {
                            let copy =  dataSource.slice()
                            copy[index].date = value?.format("HH:mm:ss") || "00:00:00"
                            setDataSource(copy)
                        }} value={moment(item.date, "HH:mm:ss")} />
                    </List.Item>
                )}
            />
            <Modal 
                className="add-modal"
                footer={[
                    <Button key="Add" onClick={() => {
                        AxiosInstance.request<string, string>({
                            url: "/life/calendar/add", 
                            method: "post",
                            data: {
                                month,
                                day,
                                schedule: [
                                    ...dataSource, {content: inputValue, date: timeValue}
                                ]
                            }}).then(() => {
                            setInputValue("")
                            setTimeValue("00:00:00")
                            message.success("添加成功")
                            onAdd?.()
                        })
                    }}>Add</Button>,
                    <Button key="newWords" onClick={() => {
                        Promise.all(ComputedAllNeedData(month, day).map(val => {
                            return AxiosInstance.request<string, string>({
                                url: "/life/calendar/add", 
                                method: "post",
                                data: {
                                    month: val.getMonth(),
                                    day: val.getDay(),
                                    schedule: [
                                        ...dataSource, {content: inputValue, date: timeValue}
                                    ]
                                }})
                        })).then(() => {
                            setInputValue("")
                            setTimeValue("00:00:00")
                            message.success("添加成功")
                            onAdd?.()
                        })
                    }}>NewWords</Button>,
                    <Button key="Cancel" onClick={() => setIsAdd(false)}>Cancel</Button>
                ]}
                title={"新增事项"}
                visible={isAdd}>
                <p>输入你预定的事项:</p>
                <Input value={inputValue} onChange={(value) => setInputValue(value.target.value)}></Input>
                <p>输入事项的时间:</p>
                <TimePicker value={moment(timeValue, "HH:mm:ss")} onChange={(value) => setTimeValue(value!.format("HH:mm:ss"))}></TimePicker>
            </Modal>
        </Modal>
    </div>)
}