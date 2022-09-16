
import { message } from "antd"
import { createContext, useContext } from "react"
import { Outlet } from "react-router-dom"
import { AuthConfig } from "../../auth_config"
import { GetUrlRelativePath } from "../../util/getURL"
import {Navigate} from "react-router-dom"
export type UserAuth = {
    auth:string[]
}
export function ForMatSessionStorageIntoString(str:string|null) {
    return str ? {auth: str.split(" ")} : {auth: ["user"]}
}
export const AuthMessage = createContext<UserAuth>({auth: ["user"]})
function ShoudleNavigate(url:string, auth:string[]) {
    const nowLocation = GetUrlRelativePath(document.location.href)
    // 当前url允许的权限码
    let RightAuthArray
    for(let authItem of AuthConfig) {
        // 直接匹配url
        if(authItem.url === nowLocation && authItem.url.indexOf(":")===-1)
        {
            RightAuthArray = authItem.auth
            break
        }
        // 匹配:id这样的格式的url
        if(authItem.url.indexOf(":")!==-1) {
            const authUrlPrefix = authItem.url.substring(0, authItem.url.indexOf(":"))
            if(nowLocation.indexOf(authUrlPrefix)!==-1) 
                RightAuthArray = authItem.auth
        }
    }
    if(!RightAuthArray)
    { 
        message.error("当前路由不符合规定")
        return false
    }else{
        for(let item of RightAuthArray) {
            if(auth.includes(item))
                return true
        }
        message.error("当前用户没有该界面权限", 3)
    }
    return false
}
export const MyRouteGuard = () => {
    // 当前用户的权限码
    const UserState = useContext(AuthMessage)
    console.log(UserState, GetUrlRelativePath(document.location.href), "---")
    return ShoudleNavigate(document.location.href, UserState.auth)?<Outlet></Outlet>:<Navigate to="/login"></Navigate>
}