import {notification} from "antd"
type NotificationPlacement = 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight';
const NotifyQQ = (props:{placement: NotificationPlacement, msg:string}) => {
    const {placement = "top", msg=""} = props
    notification.open({
        message: msg,
        placement,
        style: {
            width: 300
        }
    })
}

const NotifyWeChat = (props:{placement: NotificationPlacement, msg:string}) => {
    const {placement = "top", msg="" } = props
    notification.open({
        message: msg,
        placement,
        style: {
            width: 300
        }
    })
}
const NotifyGithub = (props:{link:string}) => {
    const a = document.createElement("a")
    a.href = props.link
    a.click()
}
const NotifyAliPay = (props:{placement: NotificationPlacement, src:string}) => {
    const {placement = "top", src = ""} = props
    notification.open({
        message: <p style={{fontWeight: 700, fontSize: 16, color: "#303133", margin: 0, padding: 0}}>呜呜,快要穷死了</p>,
        description: <img style={{zIndex: 1000}} src={src} width="200px" alt="支付宝二维码"></img>,
        placement,
        style: {
            width: "260px"
        },
        duration: 1440
    })
}
export {
    NotifyQQ,
    NotifyAliPay,
    NotifyWeChat,
    NotifyGithub
}