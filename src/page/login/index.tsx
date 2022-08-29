import { getPreFixCls } from "../../util/getPrefixCls"
import "./index.less"
import LoginImg from "../../static/picture/login.jpg"
import {  Input, message } from "antd"
import classNames from "classnames"
import { UserAuth } from "../../component/MyRouteGuard"
import AxiosInstance from "../../network/axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
type LoginMessage = {
    token:string,
    auth:string[]
}
export const Login = (props:{theme:string, SetUserState:React.Dispatch<React.SetStateAction<UserAuth>>}) => {
    const {theme, SetUserState} = props
    const navigate = useNavigate()
    const [Password, SetPassword] = useState<string>("")
    const [UserName, SetUserName] = useState<string>("")
    const LoginClick = () => {
        AxiosInstance.request<LoginMessage, LoginMessage>({
            url: "/login",
            data: {
                Password: Password,
                Username: UserName
            },
            method: "post"
        }).then(val => {
            SetUserState({auth: val.auth})
            sessionStorage.setItem("auth", val.auth.join(" "))
            sessionStorage.setItem("token", val.token)
            message.success("欢迎你,管理员!", 3)
            navigate("/")
        })
    }
    
    const PrefixCls = getPreFixCls("login")
    return (<div className={classNames(theme, `${PrefixCls}-container`)} >
        <img src={LoginImg}></img>
        <div className={`${PrefixCls}-input-container`}>
            <p className={`${PrefixCls}-title`}>Great to see you again!</p>
            <Input value={UserName} onChange={(e) => {SetUserName(e.target.value)}} className={`${PrefixCls}-input`} placeholder="User Name" ></Input>
            <Input.Password value={Password} onChange={(e) => {SetPassword(e.target.value)}} className={`${PrefixCls}-input`} placeholder="Password" ></Input.Password>
            <button className={`${PrefixCls}-button`} onClick={LoginClick}>Login in</button>
            <p className={`${PrefixCls}-tip`}>Forget Password?</p>
        </div>
    </div>)
}