import classNames from "classnames"
import { getPreFixCls } from "../../util/getPrefixCls"
import "./index.less"

export const PageHead = (props:{HeadSentence:[string, string], backgroundImg:string}) => {
    const {HeadSentence, backgroundImg} = props
    const prefixCls = getPreFixCls("pageHead")
    return (<div style={{backgroundImage: `url(${backgroundImg})`}}
        className={classNames(`${prefixCls}-head`)}>
        <div className={`${prefixCls}-head-sentence`}>
            <div>{HeadSentence[0]}</div>
            <div>{HeadSentence[1]}</div>
        </div>
    </div>)
}