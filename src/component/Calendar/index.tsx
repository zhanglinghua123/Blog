import { CalendarItem } from "./component/CalendarItem"
import { getPreFixCls } from "../../util/getPrefixCls"
import "./index.less"
export const Calendar = () => {
    const prefix = getPreFixCls("calendar-component")
    return (<div className={`${prefix}-container`}>
        <CalendarItem tips="声明在于运动" tipColor="white" day={new Date()}></CalendarItem>
    </div>)

}