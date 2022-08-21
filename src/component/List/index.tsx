import { Icon } from 'minereactcomponentlibrary'
import classNames from 'classnames'
import { useState } from 'react'
import { getPreFixCls } from '../../util/getPrefixCls'
import './index.less'
export type ListItem = {
    Label: string;
    Url: string;
};
export type ListContent = { Title: string; List?: ListItem[]; TitleUrl: string };
export type ListProps = {
    content?: ListContent[];
    // 点击时候的回调函数
    // eslint-disable-next-line no-unused-vars
    onClick: (url: string) => void;
};
export const List = (props: ListProps) => {
    const { content, onClick } = props
    const [activeIndex, setActiveIndex] = useState<number>(-1)
    const [activeIndexItem, setActiveIndexItem] = useState<number>(-1)
    const prefixCls = getPreFixCls('list')
    // 渲染出对应的List 但是只有在点击的时候才进行渲染
    const renderList = (list: ListItem[], index: number) => {
        return list.map((val, ind) => {
            return (
                <div
                    key={val.Label}
                    style={{
                        display: activeIndex !== index ? 'none' : undefined,
                        transition: 'display 0.5s'
                    }}
                    className={classNames(`${prefixCls}-list-item`, {
                        active: activeIndex === index && activeIndexItem === ind
                    })}
                    onClick={() => {
                        onClick(val.Url)
                        setActiveIndexItem(ind)
                    }}
                >
                    {val.Label}
                </div>
            )
        })
    }
    return (
        <ul className={`${prefixCls}-container`}>
            {content?.map((val, index) => {
                return (
                    <li
                        key={val.Title+val.TitleUrl}
                        className={
                            val.List
                                ? undefined
                                : classNames(`${prefixCls}-list-no-item`, {
                                    active: activeIndex === index
                                })
                        }
                    >
                        <div
                            onClick={
                                val.List?.length === 0
                                    ? () => onClick(val.TitleUrl)
                                    : () => {
                                        // 如果再次点击active的item 则进行收回操作
                                        setActiveIndex(activeIndex === index ? -1 : index)
                                        setActiveIndexItem(-1)
                                    }
                            }
                        >
                            <span>{val.Title}</span>
                            {val.List && (
                                <Icon
                                    src={activeIndex === index ? 'caretdown' : 'caretright'}
                                ></Icon>
                            )}
                        </div>
                        {val.List && renderList(val.List, index)}
                    </li>
                )
            })}
        </ul>
    )
}
