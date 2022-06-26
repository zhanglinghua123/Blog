import './head.less';
import { Icon } from '@zhanglinghua123/minereactcomponentlibrary';
import classNames from 'classnames';
import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Name from '../../../../static/picture/name5.png';
type HeadProps = {
    HeadNameArray?: ([string, string, string[]] | ReactNode)[];
    theme: string;
};
export const Head = (props: HeadProps) => {
    const { HeadNameArray, theme } = props;
    const prefixCls = 'fontpage';
    //  当前激活的ul
    const [active, setActive] = useState<number>(-1);
    // 是否显示FrontPageHead 的 白框
    const [hasWrite, setHasWrite] = useState<boolean>(false);

    useEffect(() => {
        window.onscroll = function () {
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (scrollTop > 350) {
                setHasWrite(true);
            } else {
                setHasWrite(false);
            }
        };
    }, []);
    return (
        <div
            className={classNames(`${prefixCls}-headcolumn`, theme, {
                [`${prefixCls}-back-write`]: useLocation().pathname !== '/' ? true : hasWrite,
            })}
        >
            {HeadNameArray?.map((value, index) => {
                if (value && Array.isArray(value)) {
                    // hober时候显示的List
                    const List = (
                        <ul
                            onMouseOver={
                                value[2]
                                    ? () => {
                                          setActive(index);
                                      }
                                    : undefined
                            }
                            onMouseLeave={
                                value[2]
                                    ? () => {
                                          setActive(-1);
                                      }
                                    : undefined
                            }
                            className={`${prefixCls}-headcolumn-item-ul`}
                            style={{ display: active === index ? undefined : 'none' }}
                        >
                            {value[2]?.map(val => {
                                return (
                                    <li key={val[1]}>
                                        <Link to={val[1]}>{val[0]}</Link>
                                    </li>
                                );
                            })}
                        </ul>
                    );

                    return (
                        <div
                            key={index}
                            className={`${prefixCls}-headcolumn-item`}
                            onMouseOver={
                                value[2]
                                    ? () => {
                                          setActive(index);
                                      }
                                    : undefined
                            }
                        >
                            <Link to={value[1]}>{value[0]}</Link>
                            {value[2] && <Icon src="down"></Icon>}
                            {List}
                        </div>
                    );
                } else return value;
            }).reverse()}
            <div>
                <Icon src="search"></Icon>
            </div>
            <div
                style={{
                    height: '100%',
                    // padding: '12px',
                    flex: 1,
                }}
            >
                <img
                    style={{
                        height: '100%',
                        padding: '12px',
                        boxSizing: 'border-box',
                    }}
                    src={Name}
                ></img>
            </div>
        </div>
    );
};
