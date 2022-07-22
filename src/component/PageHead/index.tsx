import classNames from "classnames"
import { getPreFixCls } from "../../util/getPrefixCls"
import "./index.less"
import Img from "../../static/picture/fontpageback3.jpg"
export const PageHead = (props:{HeadSentence:[string, string]}) => {
    const {HeadSentence} = props
    const prefixCls = getPreFixCls("pageHead")
    return (<div style={{backgroundImage: `url(${Img})`}}
        className={classNames(`${prefixCls}-head`)}>
        <div className={`${prefixCls}-head-sentence`}>
            <div>{HeadSentence[0]}</div>
            <div>{HeadSentence[1]}</div>
        </div>
    </div>)
}