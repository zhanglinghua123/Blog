import classNames from 'classnames'
import { CSSProperties, useEffect, useState } from 'react'
import './index.less'
type NavBarProps = Partial<{
    // markdown source
    src: string;
    // markdown source container'id
    markdownContainerId: string;
    // item id according to the item value
    hashValue: boolean;
    // scroll Top Value
    headingTopoffset: number;
    //  smooth move
    movesmooth: boolean;
    // make container is an anchor
    isanchor: boolean;
    // anchorTopValues
    anchorTop: number;
    // li style
    itemStyle:CSSProperties
    // item className
    itemClassName:string
    // containerstyle
    containerstyle:CSSProperties
    // containerClassName
    containerClassName:string
    // theme 主题
    theme:string
}>;
type NavBarItem = {
    id?: string;
    index: number;
    level: number;
    content: string;
    listNo?: string;
    offsetTop?: number;
};
export const NavBar = (props: NavBarProps) => {
    const {
        src,
        markdownContainerId,
        hashValue = false,
        headingTopoffset = 0,
        movesmooth = false
    } = props
    const prefixCls = 'NavBar'
    const [NavBar, SetNavBar] = useState<NavBarItem[]>([])
    let scrollTimeout: string | number | NodeJS.Timeout | undefined
    //  func as its name
    // eslint-disable-next-line no-undef
    function safeScrollTo(element: HTMLElement | Window, top: number, left = 0, smooth: boolean) {
        if (!element) return
        if (typeof element.scrollTo === 'function') {
            const scrollConfig = {
                top,
                left
            }
            if (smooth) (scrollConfig as any).behavior = 'smooth'
            element.scrollTo(scrollConfig)
        } else {
            if (element === window) {
                document.documentElement.scrollTop = top
                document.documentElement.scrollLeft = left
            } else {
                (element as HTMLElement).scrollTop = top;
                (element as HTMLElement).scrollLeft = left
            }
        }
    }
    const scrollToTarget = (dataId:string|undefined) => {
        if(!dataId) return
        if (scrollTimeout)
            clearTimeout(scrollTimeout)
        scrollTimeout = setTimeout(() => {
            const target = document.querySelector<HTMLElement>(`[id="${dataId}"]`)
            if (target && typeof target.offsetTop === 'number')
                safeScrollTo(window, target.offsetTop - headingTopoffset, 0, movesmooth)
        }, 0)
    }
    // const scrollToPlace = (top: number, left: number) => {
    //     if (scrollTimeout) clearTimeout(scrollTimeout)
    //     scrollTimeout = setTimeout(() => {
    //         safeScrollTo(window, top - headingTopoffset, left, movesmooth)
    //     }, 0)
    // }
    const getListNo = (arr: number[]) => {
        let NoZeroindex = 0
        for(let i=0;i<arr.length;i++) 
            if(arr[i] !== 0) NoZeroindex = i
        return (arr.slice(0, NoZeroindex+1).join("."))
    }
    const getNavBarStructure = (src: string) => {
        // used to match all title
        const matchResult = src.match(/#+\s[^#\n]*\n*/g)
        //  match the title content
        const matchTitle =  /#+\s([^#\n]+)\n*/g
        const NavBarStructure =
            matchResult?.map((val, index) => {
                // 处理标题中包含链接的问题
                // eslint-disable-next-line no-useless-escape
                val = val.replace(/\[([^\n\[\]]*)\]\s*\([^\[\]\n]*\)/g, "$1")
                return {
                    index: index,
                    level: val.match(/^#+/g)![0]?.length,
                    // 替换掉标题中出现的link 标签
                    content: val.replace(matchTitle, '$1').trim()
                }
            }) || []
        SetNavBarStructureNumber(NavBarStructure)
        SetNavBarStructureOffsetTop(NavBarStructure)
        return NavBarStructure
    }
    // forbid the question about the multi same paragraph 避免有多个标题重名的问题
    const NavBarNowMeetMultiValue = (obj: { [key: number]: Object }, item: NavBarItem) => {
        if (item.content in (obj as any)[item.level]) (obj[item.level] as any)[item.content] += 1
        else (obj[item.level] as any)[item.content] = 1
        return obj
    }
    // set listNo
    const SetNavBarStructureNumber = (structure: NavBarItem[]) => {
        let NavBarStack: { level: number; listArray: number[] }[] = [
            { level: 1, listArray: [0, 0, 0, 0, 0, 0] }
        ]
        console.log(structure, "---")
        for (let item of structure) {
            const { level } = item
            while (NavBarStack.length && NavBarStack[NavBarStack.length - 1].level > level)
                NavBarStack.pop()
            const Topitem = NavBarStack[NavBarStack.length - 1]
            const newArray = Topitem.listArray.slice()
            newArray[level - 1] += 1
            // set the item's listNo
            item.listNo = getListNo(newArray)
            console.log(item, newArray, "---")
            NavBarStack.push({
                level,
                listArray: newArray
            })
        }
        console.log(structure, "---after")
    }
    // Set offsetTop and id
    const SetNavBarStructureOffsetTop = (structure: NavBarItem[]) => {
        let obj: { [key: number]: Object } = {  1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {} }
        const container = document.getElementById(markdownContainerId || '')
        structure.forEach((val, index) => {
            NavBarNowMeetMultiValue(obj, val)
            let count = 0
            const ParaGraph = (container || document).querySelectorAll(`h${val.level}`) || []
            //  get all navbarItem OffsetTop
            ParaGraph.forEach(value => {
                // Object.defineProperty(value, "isMarked", {
                //     value: false,
                //     writable: true
                //   })
                const textValue = value.textContent?.replace(/#+\s/g, '')
                // console.log(textValue)
                if (textValue === val.content.trim()) {
                    count++
                    if (count === (obj[val.level] as any)[val.content]) {
                        val.id = hashValue ? `${val.listNo}-${val.content}` : `heading-${index}`
                        val.offsetTop = (value as HTMLElement).offsetTop
                        value.id = val.id
                    }
                }
            })
        })
    }
    // Update source
    useEffect(() => {
        SetNavBar(getNavBarStructure(src || ''))
    }, [src])
    // make container is an anchor
    // useEffect(() => {
    //     const container = document.getElementById(markdownContainerId)
    //     const initWidth = container?.offsetWidth
    //     const WindowHeight = window.innerHeight
    //     window.addEventListener("scroll", () => {
    //         console.log("-----", initWidth, WindowHeight)
    //         if(container?.getBoundingClientRect()!.bottom || 0> WindowHeight)
    //         {
    //             container!.style.width = `${initWidth?.toString() || "0"}px`
    //             container!.style.position = "fixed"
    //             // container!.style.top = "-2000px"
    //             container!.style.right = "0"
    //         } else{
    //             container!.style.width = `${initWidth?.toString() || "0"}px`
    //             container!.style.position = "none"
    //             // container!.style.top = "-2000px"
    //             container!.style.right = "0"
    //         }
    //     })
    // }, [])
    const renderNavBar = (ItemArray: NavBarItem[]): React.ReactNode[] => {
        return ItemArray.map(val => {
            return (
                <li
                    style={props.itemStyle}
                    onClick={() => {
                        scrollToTarget(val.id)
                        // scrollToPlace(val.offsetTop || 0, 0)
                    }}
                    key={val.id}
                    className={classNames(`${prefixCls}-${val.level}`, props.itemClassName, props.theme)}
                >
                    <small>{val.listNo}</small>
                    {val.content}
                </li>
            )
        })
    }
    return (
        <ul id={markdownContainerId} style={props.containerstyle} className={classNames('NavBar-Container', props.containerClassName)}>
            {renderNavBar(NavBar)}
        </ul>
    )
}
