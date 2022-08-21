import { Icon } from 'minereactcomponentlibrary'
import { CSSProperties } from 'react'
import { getPreFixCls } from '../../util/getPrefixCls'
import './tip.less'
export type TipProps = Partial<{
    iconSrc?: string;
    content?: string;
    color?: string;
    backgroundColor?: string;
    style?: CSSProperties;
    fontSize:number;
    onClick? : ()=>any;
    cursor?:string
}>;
export const Tip = (props: TipProps) => {
    const {
        iconSrc: IconSrc = '',
        content,
        style,
        color = 'white',
        backgroundColor = '#3eaf7c',
        fontSize = 14,
        onClick,
        cursor
    } = props
    const prefix = getPreFixCls('tip')
    return (
        <span
            onClick={onClick}
            className={`${prefix}-container`}
            style={{ ...style, color: color, backgroundColor: backgroundColor, cursor: cursor}}
        >
            {IconSrc && <Icon src={IconSrc}></Icon>}
            <span style={new RegExp("[\u4E00-\u9FA5]+").test(content || "")?{fontSize: fontSize &&`${fontSize - 2}px`, padding: "2px 0 "}:{fontSize: fontSize &&`${fontSize}px`, paddingBottom: "2px"}}>{content}</span>
        </span>
    )
}
