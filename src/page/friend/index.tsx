import { Dropdown, Menu, MenuProps, Space } from "antd"
import { Icon } from "minereactcomponentlibrary"
import { useEffect, useState } from "react"
import { createRoot, Root } from "react-dom/client"
// import { Drawing } from "../../component/Canvas/YoudaBlog"
import { getPreFixCls } from "../../util/getPrefixCls"
import "./index.less"
import { ShapeShifterCanvas } from "./ShapeShifter"
import { YoudaBlog } from "./YoudaBlog"
let Components = [YoudaBlog, ShapeShifterCanvas]
export const Friend = () => {
    const prefixCls = getPreFixCls("friend")
    const [comicNode, setComicNode] = useState<Root|null>(null)
    const [hasSet, setHasSet] = useState<boolean>(false)
    useEffect(() => {
        // 用这种方式避免 Strict Mode 导致的问题
        if(!hasSet) {
            let comicNode = document.getElementById("comic")
            setComicNode(createRoot(comicNode))  
        }      
        return () => setHasSet(true)
    }, [])
    const onClick: MenuProps['onClick'] = ({ key }) => {
        let Node = Components[key]
        comicNode.render(<Node></Node>)
    }
    // 默认选中第一个
    useEffect(() => {
        if(comicNode) {
            let Node = Components[0]
            comicNode.render(<Node></Node>)
        }
    }, [])
    const menu = (
        <Menu
            onClick={onClick}
            items={[
                {
                    label: '炫彩三角形',
                    key: 0
                },
                {
                    label: "炫酷动画",
                    key: 1
                }
            ]}
        />
    )
    return (
        <>
            <Dropdown className={`${prefixCls}-dropdown`} overlay={menu}>
                <a onClick={e => e.preventDefault()}>
                    <Space style={{
                        fontSize: "18px"
                    }}>切换动画</Space>
                    <Icon src="down" size="18px" style={{
                        marginLeft: "8px"
                    }}></Icon>
                </a>
            </Dropdown>
            <div id="comic"></div>
        </>)
}