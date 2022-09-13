type CalendarItemProps  = Partial<{
    picture : string,
    tips : string,
    tipColor : string,
    day : Date
    shedule : string[]
}>
import { getPreFixCls } from "../../../../util/getPrefixCls"
import "./index.less"
import backOne from "../../../../static/picture/backOne.jpg"
import { getCalendarData } from "../../../../util/getCalendarData"
import {  useEffect, useState } from "react"
import { CalendarItemEdit } from "../CalendarItemEdit"
import AxiosInstance from "../../../../network/axios"
export  const CalendarItem = (props : CalendarItemProps) => {
    const {picture = backOne,  tipColor, day} = props

    // 类名称
    const prefix = getPreFixCls("calendar-item")
    // 数据源
    const [dataSource, setDataSource] = useState<number[]>([])
    // 控制retry的hooks
    const [retry, setRetry] = useState<boolean>(false)
    useEffect(() => {
        let isRetry = false
        AxiosInstance.request<{day:number}[], {day:number}[]>
        ({url: "/life/calendar/getAll",
            method: "get",
            params: {
                month: day?.getMonth()! + 1
            }}).then((val) => {
            if(!isRetry) {
                console.log(val.map(value => value.day), "datasource---")
                if(val)
                    setDataSource(val.map(value => value.day))
                else setDataSource([])
            }
            setRetry(false)
        })
        return () => {
            isRetry = true
        }
    }, [retry])
    // 当前可以展示的日历项
    const [activeIndex, setActiveIndex] = useState<number>(-1)
    return (<div className={`${prefix}-container`}>
        <div className={`${prefix}-picture`} style={{
            backgroundImage: `url(${picture})`
        }}>
            <div className={`${prefix}-month`}>{day?.getMonth()! + 1}</div>
            <div className={`${prefix}-year`}>{day?.getFullYear()}</div>
        </div>
        <div className={`${prefix}-tip`} style={{
            backgroundColor: tipColor
        }}>
            {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(val => {
                return <span key={val}>{val}</span>
            })}
        </div>
        <div className={`${prefix}-shedule`}>
            { 
                getCalendarData().map(val => {
                    return (<div className={`${prefix}-shedule-item`} 
                        onClick={() => {console.log(val.day);  setActiveIndex(val.day)}}
                        style={{
                            color: val.weekday === 7 ? "rgb(220, 57, 20)" : "auto",
                            background: dataSource.includes(val.day) ? "#bed742" : ""
                        }} key={val.day + val.weekday}>
                        <span>{val.day !== 0 ? val.day:""}</span>
                    </div>)
                }) }
        </div>
        <CalendarItemEdit onAdd={() => setRetry(true)} onDelete={() => setRetry(true)} month={day?.getMonth()! + 1} day={activeIndex} visible={activeIndex !== -1} onClose={() => setActiveIndex(-1)} />
    </div>)
}