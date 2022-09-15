import { Button, Icon } from 'minereactcomponentlibrary'
import { ReactNode, useState } from 'react'
import { Envelope } from '../../../../component/Envelope'
import { getPreFixCls } from '../../../../util/getPrefixCls'
import './index.less'
type IntroProp = Partial<{
    portrait: ReactNode;
    UserName: string;
    iconArray: (string | ReactNode)[];
    hoverColor: string;
    statistics: string[][];
}>;
export const Intro = (props: IntroProp) => {
    const { portrait, iconArray, statistics, UserName } = props
    const prefixCls = getPreFixCls('intro')
    // 控制信封显示的变量
    const [envelopeVisible, setEnvelopeVisible] = useState<boolean>(false)
    return (
        <div className={`${prefixCls}-container`}>
            <div className={`${prefixCls}-image`}>
                {portrait}
                <div className={`${prefixCls}-text`}>{UserName}</div>
            </div>
            <div className={`${prefixCls}-statis`}>
                {statistics?.map(value => {
                    return (
                        // eslint-disable-next-line react/jsx-key
                        <div>
                            <div className={`${prefixCls}-statis-text1`}>{value[0]}</div>
                            <div className={`${prefixCls}-statis-text2`}>{value[1]}</div>
                        </div>
                    )
                })}
            </div>
            <Button type={'text'} className={`${prefixCls}-button`} size="middle" onClick={() => setEnvelopeVisible((val) => !val)}>
                点击留言~
            </Button>
            {
                envelopeVisible && <Envelope size={30} left={"35vw"} bottom={"5vh"}></Envelope>
            }
            <div className={`${prefixCls}-icon-array`}>
                {iconArray?.map(value => {
                    if (typeof value === 'string') 
                        return <Icon src={value}></Icon>
                    else 
                        return value
                    
                })}
            </div>
        </div>
    )
}
