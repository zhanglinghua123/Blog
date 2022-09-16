// 路由权限的配置信息
export type AuthItem = {
    url:string,
    auth:string[]
}
export const AuthConfig:AuthItem[]  = [
    {
        url: "/",
        auth: ["user", "admin"]
    },
    {
        url: "/note",
        auth: ["user", "admin"]
    },
    {   
        url: "/note/new",
        auth: ["admin"]
    },
    {   
        url: "/note/modify/:id",
        auth: ["admin"]
    },
    {
        url: "/blog",
        auth: ["user", "admin"]
    },
    {
        url: "/blog/new",
        auth: ["admin"]
    }, 
    {
        url: "/blog/:id",
        auth: ["user", "admin"]
    },
    {
        url: "/blog/modify/:id",
        auth: ["admin"]
    },
    {
        url: "/live/modify/:id",
        auth: ["admin"]
    },
    {
        url: "/live/new",
        auth: ["admin"]
    },
    {
        url: "/live",
        auth: ["user", "admin"]
    },
    {
        url: "/live/dream",
        auth: ["user", "admin"]
    },
    {
        url: "/live/cube",
        auth: ["user", "admin"]
    },
    {
        url: "/live/calendar",
        auth: ["user", "admin"]
    },
    {
        url: "/friend",
        auth: ["user", "admin"]
    },
    {
        url: "/login",
        auth: ["user", "admin"]
    }
]