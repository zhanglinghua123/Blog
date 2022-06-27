import { Icon } from '@zhanglinghua123/minereactcomponentlibrary';
import classNames from 'classnames';
import { useState } from 'react';
import { getPreFixCls } from '../../util/getPrefixCls';
import './index.less';
export type ListItem = {
    label: string;
    url: string;
};
export type ListContent = { title: string; list?: ListItem[]; titleUrl: string };
export type ListProps = {
    content: ListContent[];
    // 点击时候的回调函数
    onClick: (url: string) => void;
};
export const List = (props: ListProps) => {
    const { content, onClick } = props;
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [activeIndexItem, setActiveIndexItem] = useState<number>(-1);
    const prefixCls = getPreFixCls('list');
    // 渲染出对应的List 但是只有在点击的时候才进行渲染
    const renderList = (list: ListItem[], index: number) => {
        return list.map((val, ind) => {
            return (
                <div
                    style={{
                        display: activeIndex !== index ? 'none' : undefined,
                        transition: 'display 0.5s',
                    }}
                    className={classNames(`${prefixCls}-list-item`, {
                        active: activeIndex === index && activeIndexItem === ind,
                    })}
                    onClick={() => {
                        onClick(val.url);
                        setActiveIndexItem(ind);
                    }}
                >
                    {val.label}
                </div>
            );
        });
    };
    return (
        <ul className={`${prefixCls}-container`}>
            {content.map((val, index) => {
                return (
                    <li
                        className={
                            val.list
                                ? undefined
                                : classNames(`${prefixCls}-list-no-item`, {
                                      active: activeIndex === index,
                                  })
                        }
                    >
                        <div
                            onClick={
                                val.list?.length === 0
                                    ? () => onClick(val.titleUrl)
                                    : () => {
                                          // 如果再次点击active的item 则进行收回操作
                                          setActiveIndex(activeIndex === index ? -1 : index);
                                          setActiveIndexItem(-1);
                                      }
                            }
                        >
                            <span>{val.title}</span>
                            {val.list && (
                                <Icon
                                    src={activeIndex === index ? 'caretdown' : 'caretright'}
                                ></Icon>
                            )}
                        </div>
                        {val.list && renderList(val.list, index)}
                    </li>
                );
            })}
        </ul>
    );
};
