/* eslint-disable no-unused-vars */
import React, {  useEffect, useState } from 'react'
import { FontPage } from './page/fontpage'
import { Head } from './page/fontpage/component/Head/Head'
import moon from './static/svg/moon.svg'
import sun from './static/svg/sun.svg'
import { BrowserRouter,  Route,  Routes } from 'react-router-dom'
import { Blog } from './page/blog/all'
import { NewNote } from './page/note/new/index'
import { AllNote } from './page/note/all'
import { BlogPre } from './page/blog/blogmarkdown'
import { Live } from './page/live'
import { NewBlog } from './page/blog/new'
import 'antd/dist/antd.css'
import { AddClickOnHeart } from './component/ClickHeart'
import { Friend } from './page/friend'
import { Dream } from './page/live/dream'
import { AuthMessage, ForMatSessionStorageIntoString, UserAuth } from './component/MyRouteGuard'
import { MyRouteGuard } from './component/MyRouteGuard'
import { Login } from './page/login'
import { ModifyNote } from './page/note/modify'
import { ModifyBlog } from './page/blog/modify'
import { Cube } from './page/live/magic_cube'
import { CalendarPage } from './page/calendar'

function App() {
    let modelname = 'hijiki'
    useEffect(() => {
        // setTimeout(() => {
        // 定时器,created执行一秒后触发
        if ((window as any).L2Dwidget) {
            (window as any).L2Dwidget.init({
                pluginRootPath: 'live2dw/', // 指向你的目录
                pluginJsPath: 'lib/', // 指向你的目录
                // pluginModelPath: 'live2d-widget-model-nico/assets/',                                   //中间这个koharu就是你的老婆,想换个老婆,换这个就可以了
                tagMode: false,
                debug: false,
                // hibiki 是jk hijiki 是黑猫猫
                // izumi 中年妇女 kahuru Q版女孩子
                // wanko 是笨狗
                // tororo 白猫
                model: {
                    jsonPath: `/live2dw/live2d-widget-model-${modelname}/assets/${modelname}.model.json`
                }, // 中间这个koharu就是你的老婆,想换个老婆,换这个就可以了
                display: {
                    position: 'left',
                    width: 130,
                    height: 130,
                    hOffset: 60, // canvas水平偏移
                    vOffset: 100, // canvas垂直偏移
                    opacity: 0.6
                }, // 调整大小,和位置
                mobile: { show: true }, // 要不要盯着你的鼠标看
                log: false
            })
        }
        // }, 300);
    }, [modelname])
    // 添加点击爱心效果
    useEffect(() => {
        AddClickOnHeart()
    }, [])
    //  用来设置夜间模式
    const [isNight, SetNight] = useState<boolean>(false)
    //  当前的用户权限
    const [UserState, SetUserState] = useState<UserAuth>(ForMatSessionStorageIntoString(sessionStorage.getItem("auth")))
    return (
        <BrowserRouter>
            <AuthMessage.Provider value={UserState}>
                {/* 不需要权限校验的url */}
                <Routes>
                    <Route path="/" element={<MyRouteGuard></MyRouteGuard>}>
                        <Route path="/" element={<FontPage isNight={isNight} />} />
                        <Route path="/blog/:id" element={<BlogPre theme={isNight} />} />
                        <Route path="/blog" element={<Blog theme={isNight} />} />
                        <Route path="/live" element={<Live theme={isNight?"night":"light"} />} />
                        <Route path="/live/dream" element={<Dream></Dream>}></Route>
                        <Route path="/friend" element={<Friend></Friend>}></Route>
                        <Route
                            path="/note"
                            element={<AllNote theme={isNight ? 'night' : 'light'} />}
                        ></Route>
                        <Route path="/login" element={<Login SetUserState={SetUserState} theme={isNight?"night":"light"}></Login>}></Route>
                    </Route>
                    <Route path="/blog" element={<MyRouteGuard></MyRouteGuard>}>
                        <Route
                            path="/blog/new"
                            element={
                                <NewBlog placeholder="编辑你的新博客吧!完成后输入esc" theme={isNight} />
                            }
                        />
                        <Route
                            path="/blog/modify/:id"
                            element={
                                <ModifyBlog placeholder="编辑你的新博客吧!完成后输入esc" theme={isNight} />
                            }
                        />
                    </Route>
                    <Route path="/note" element={<MyRouteGuard></MyRouteGuard>}>
                        <Route
                            path="/note/new"
                            element={
                                <NewNote placeholder="编辑你的新笔记吧!完成后输入esc" theme={isNight} />
                            }
                        />
                        <Route path="/note/modify" element={<MyRouteGuard></MyRouteGuard>}>
                            <Route
                                path="/note/modify/:id"
                                element={
                                    <ModifyNote placeholder="编辑你的笔记吧!完成后输入esc" theme={isNight} />
                                }
                            />
                        </Route>
                    </Route>
                    <Route path="/live" element={<MyRouteGuard></MyRouteGuard>}>
                        <Route
                            path="/live/new"
                            element={
                                <NewBlog newUrl="/life/newLife" placeholder="编辑你的新博客吧!完成后输入esc" theme={isNight} />
                            }
                        />
                        <Route
                            path="/live/modify/:id"
                            element={
                                <ModifyBlog placeholder="编辑你的新博客吧!完成后输入esc" theme={isNight} />
                            }
                        />
                        <Route 
                            path="/live/cube"
                            element={<Cube></Cube>}>
                        </Route>
                        <Route
                            path="/live/calendar"
                            element={<CalendarPage></CalendarPage>}
                        >

                        </Route>
                    </Route>
                </Routes>
                <div className="App">
                    {/* 顶部的导航栏 */}
                    <Head
                        UnAppearUrl={["/live/dream", "/login"]}
                        theme={isNight ? 'night' : 'light'}
                        HeadNameArray={[
                            ['首页', '/'],
                            [
                                '博客',
                                '/blog',
                                [
                                    ['新建', '/blog/new'],
                                    ['浏览', '/blog']
                                ]
                            ],
                            [
                                '笔记',
                                '/note',
                                [
                                    ['新建', '/note/new'],
                                    ['浏览', '/note']
                                ]
                            ],
                            ['生活', '/live', [
                                ["新建", "live/new"],
                                ["心愿", "live/dream"],
                                ["魔方", "live/cube"],
                                ["日历", "live/calendar"]
                            ]],
                            ['友链', '/friend'],
                            ["登录", "/login"],
                            ['Github', 'https://github.com/zhanglinghua123'],
                            <img
                                key={"img"}
                                onClick={() => {
                                    SetNight(!isNight)
                                }}
                                src={isNight ? moon : sun}
                                style={{ width: '14px', height: '14px' }}
                                alt="moon"
                            />
                        ]}
                    ></Head>
                </div>
            </AuthMessage.Provider>
        </BrowserRouter>
    )
}

export default App
