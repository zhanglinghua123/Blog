/* eslint-disable no-useless-escape */
import "./index.less"
import { Input } from 'antd'
import { getPreFixCls } from "../../../util/getPrefixCls"

const { TextArea } = Input
export const Words = () => {
    const prefix = getPreFixCls("words")
    const onPressEnterCallBack = (e) => {
        console.log(e.target.value)
        const words =  (Array.from(e.target.value.matchAll(/\"[A-Za-z \t\-]+\"\n|[A-Za-z \t\-]+/g)).flat() as string[]).map(val => val.replaceAll(/\t|\"|\n/g, ""))
        console.log(words)
        words.sort(() => 0.5-Math.random())
        window.open("words/recite?word=" + words)
    }
    return (<div>
        <br />
        <br />
        <TextArea className={`${prefix}-Input`} autoSize={{ minRows: 6, maxRows: 12 }} onPressEnter={onPressEnterCallBack} placeholder="click the enter and begin to the write words" />
    </div>)
}
