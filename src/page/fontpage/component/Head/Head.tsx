import './head.less'
import { Icon } from 'minereactcomponentlibrary'
import classNames from 'classnames'
import { ReactNode, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Name from '../../../../static/picture/name5.png'
import { GetUrlRelativePath } from '../../../../util/getURL'
import { QueryDiv } from '../../../../component/QueryDiv'
type HeadProps = {
    // 左边显示的导航栏
    HeadNameArray?: ([string, string, string[]] | ReactNode)[];
    // 主题样式
    theme: string;
    // 是否进行显示
    UnAppearUrl?:string[]
};
export const Head = (props: HeadProps) => {
    const { HeadNameArray, theme, UnAppearUrl = []} = props
    const prefixCls = 'fontpage'
    //  当前激活的ul
    const [active, setActive] = useState<number>(-1)
    // 是否显示FrontPageHead 的 白框
    const [hasWrite, setHasWrite] = useState<boolean>(false)
    const location = useLocation()
    // 控制其滚动到一定程度进行显示
    useEffect(() => {
        window.onscroll = function () {
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
            if (scrollTop > 350) 
                setHasWrite(true)
            else 
                setHasWrite(false)
        }
    }, [])
    // 每个导航栏对应的render函数
    const NavBarItem = (value : [string, string, string[]] | ReactNode, index:number) => {
        if (value && Array.isArray(value)) {
            return (
                <div
                    key={value.toString()}
                    className={`${prefixCls}-headcolumn-item`}
                    onMouseOver={
                        value[2]
                            ? () => {
                                console.log("active--")
                                setActive(index)
                            }
                            : undefined
                    }
                    onMouseLeave={
                        value[2]?() => {setActive(-1)}:undefined}
                >
                    {!value[1].match(/http|www|https/g)? <Link to={value[1]}>{value[0]}</Link>:<a href={value[1]}>{value[0]}</a>}
                    {value[2] && <Icon src="down"></Icon>}
                    {renderNavBarList(value, index)}
                </div>
            )
        }else
            return value
    }
    // 导航栏下拉项目的render函数
    const renderNavBarList = (value : [string, string, string[]], index:number) => {
        return (
            <ul
                className={`${prefixCls}-headcolumn-item-ul`}
                style={{ display: active === index ? undefined : 'none' }}
            >
                {value[2]?.map(val => {
                    return (
                        <li key={val[1]}>
                            {!val[1].match(/http|www|https/g)? <Link to={val[1]}>{val[0]}</Link>:<a href={val[1]}>{val[0]}</a>}
                        </li>
                    )
                })}
            </ul>
        )
    }
    return (
        <>  
            {/* 当url处于这些界面的时候 不显示背景的白色 */}
            {UnAppearUrl.indexOf(GetUrlRelativePath(document.location.toString())) === -1 && <div
                className={classNames(`${prefixCls}-headcolumn`, theme, {
                    [`${prefixCls}-back-write`]: location.pathname !== '/' && !new RegExp(/\/blog\/[0-9a-f]+/).test(location.pathname) ? true : hasWrite
                })}
            >
                {HeadNameArray?.map((value, index) => {
                    return NavBarItem(value, index)
                }).reverse()}
                <div>
                    <QueryDiv fontSize={26} ContainerStyle={{
                        
                    }}></QueryDiv>
                </div>
                <div
                    style={{
                        height: '100%',
                        flex: 1
                    }}
                >
                    <img
                        style={{
                            height: '100%',
                            padding: '12px',
                            boxSizing: 'border-box'
                        }}
                        src={Name}
                    ></img>
                </div>
            </div>}
        </>
      
    
    )
}
