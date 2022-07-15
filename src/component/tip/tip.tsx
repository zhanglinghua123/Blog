import { Icon } from '@zhanglinghua123/minereactcomponentlibrary'
import { CSSProperties } from 'react'
import { getPreFixCls } from '../../util/getPrefixCls'
import './tip.less'
export type TipProps = Partial<{
    iconSrc?: string;
    content?: string;
    color?: string;
    backgroundColor?: string;
    style?: CSSProperties;
}>;
export const Tip = (props: TipProps) => {
    const {
        iconSrc: IconSrc = '',
        content,
        style,
        color = 'white',
        backgroundColor = '#3eaf7c'
    } = props
    const prefix = getPreFixCls('tip')
    return (
        <span
            className={`${prefix}-container`}
            style={{ ...style, color: color, backgroundColor: backgroundColor }}
        >
            {IconSrc && <Icon src={IconSrc}></Icon>}
            <span>{content}</span>
        </span>
    )
}
