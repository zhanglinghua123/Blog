import classNames from 'classnames'
import { CSSProperties } from 'react'
import { Tip, TipProps } from '../Tip/tip'
import { getPreFixCls } from '../../util/getPrefixCls'
import './card.less'
import { useNavigate } from 'react-router-dom'
export type CardProps = Partial<{
    title?: string;
    titleurl?: string;
    onClick: () => void;
    time?: string;
    tipArray?: TipProps[];
    className: string;
    style: CSSProperties;
    titlestyle: CSSProperties;
    timestyle: CSSProperties;
    tipContainerStyle: CSSProperties;
}>;

export const Card = (props: CardProps) => {
    const {
        title,
        titleurl,
        time,
        tipArray,
        className,
        style,
        titlestyle,
        tipContainerStyle,
        timestyle,
        onClick
    } = props
    const navigate = useNavigate()
    const prefixCls = getPreFixCls('card')
    return (
        <div style={{ ...style }} className={classNames(`${prefixCls}-container`, className)}>
            <div
                onClick={() => {
                    // eslint-disable-next-line no-unused-expressions
                    titleurl && navigate(titleurl)
                    onClick?.()
                }}
                className={`${prefixCls}-title`}
                style={{ ...titlestyle }}
            >
                <span>{title}</span>
            </div>
            <div className={`${prefixCls}-time`} style={{ ...timestyle }}>
                {time ? time : '不知道什么时候发的啦'}
            </div>
            <div style={tipContainerStyle}>
                {tipArray?.map(value => {
                    return <Tip key={value.content} {...value}></Tip>
                })}
            </div>
        </div>
    )
}
