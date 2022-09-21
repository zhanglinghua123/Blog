import { Calendar } from "../../component/Calendar"
import { getPreFixCls } from "../../util/getPrefixCls"
import "./index.less"


export const CalendarPage = () => {
    const prefix =  getPreFixCls("calendar")
    return (<div className={`${prefix}-container`} >
        <Calendar></Calendar>
        {/* <p>{refValue.current}</p> */}
    </div>)
}