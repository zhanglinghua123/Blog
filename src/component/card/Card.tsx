import classNames from 'classnames';
import { CSSProperties } from 'react';
import { Tip, TipProps } from '../tip/tip';
import { getPreFixCls } from '../../util/getPrefixCls';
import './card.less';
export type CardProps = Partial<{
    title?: string;
    time?: string;
    tipArray?: TipProps[];
    className: string;
    style: CSSProperties;
    titlestyle: CSSProperties;
    timestyle: CSSProperties;
    tipContainerStyle: CSSProperties;
}>;
export const Card = (props: CardProps) => {
    const { title, time, tipArray, className, style, titlestyle, tipContainerStyle, timestyle } =
        props;
    const prefixCls = getPreFixCls('card');
    return (
        <div style={{ ...style }} className={classNames(`${prefixCls}-container`, className)}>
            <div className={`${prefixCls}-title`} style={{ ...titlestyle }}>
                <span>{title}</span>
            </div>
            <div className={`${prefixCls}-time`} style={{ ...timestyle }}>
                {time ? time : '不知道什么时候发的啦'}
            </div>
            <div style={tipContainerStyle}>
                {tipArray?.map(value => {
                    return <Tip {...value}></Tip>;
                })}
            </div>
        </div>
    );
};
