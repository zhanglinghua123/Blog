import { Dropdown, Menu, MenuProps, message, Space } from "antd"
import { Icon } from "minereactcomponentlibrary"
import { useEffect } from "react"
import { Drawing } from "../../component/Canvas/YoudaBlog"
import { getPreFixCls } from "../../util/getPrefixCls"
import "./index.less"
export const Friend = () => {
    useEffect(() => {
        Drawing()
    }, [])
    const prefixCls = getPreFixCls("friend")
    const onClick: MenuProps['onClick'] = ({ key }) => {
        message.info(`Click on item ${key}`)
    }
    const menu = (
        <Menu
            onClick={onClick}
            items={[
                {
                    label: '炫彩三角形',
                    key: '1'
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
            <canvas>
            </canvas>
        </>)
}