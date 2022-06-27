import React, { useEffect, useState } from 'react';
// import './App.css';
import { FontPage } from './page/fontpage';
import { Head } from './page/fontpage/component/Head/Head';
import moon from './static/svg/moon.svg';
import sun from './static/svg/sun.svg';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Blog } from './page/blog/all';
import { NewNote } from './page/note/new/index';
import { AllNote } from './page/note/all';
import { BlogPre } from './page/blog/blogmarkdown';
function App() {
    let modelname = 'hijiki';
    useEffect(() => {
        // setTimeout(() => {
        //定时器,created执行一秒后触发
        if ((window as any).L2Dwidget)
            (window as any).L2Dwidget.init({
                pluginRootPath: 'live2dw/', //指向你的目录
                pluginJsPath: 'lib/', //指向你的目录
                // pluginModelPath: 'live2d-widget-model-nico/assets/',                                   //中间这个koharu就是你的老婆,想换个老婆,换这个就可以了
                tagMode: false,
                debug: false,
                // hibiki 是jk hijiki 是黑猫猫
                // izumi 中年妇女 kahuru Q版女孩子
                // wanko 是笨狗
                // tororo 白猫
                model: {
                    jsonPath: `/live2dw/live2d-widget-model-${modelname}/assets/${modelname}.model.json`,
                }, //中间这个koharu就是你的老婆,想换个老婆,换这个就可以了
                display: {
                    position: 'left',
                    width: 130,
                    height: 130,
                    hOffset: 60, // canvas水平偏移
                    vOffset: 100, // canvas垂直偏移
                }, //调整大小,和位置
                mobile: { show: true }, //要不要盯着你的鼠标看
                log: false,
            });
        // }, 300);
    }, [modelname]);
    //  用来设置夜间模式
    const [isNight, SetNight] = useState<boolean>(false);
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<FontPage isNight={isNight} />} />
                <Route
                    path="/note"
                    element={<AllNote theme={isNight ? 'night' : 'light'} />}
                ></Route>
                <Route
                    path="/note/new"
                    element={
                        <NewNote placeholder="编辑你的新笔记吧!完成后输入esc" theme={isNight} />
                    }
                />
                <Route path="/blog" element={<Blog theme={isNight} />} />
                <Route
                    path="/blog/new"
                    element={
                        <NewNote placeholder="编辑你的新博客吧!完成后输入esc" theme={isNight} />
                    }
                />
                <Route path="/blog/:id" element={<BlogPre theme={isNight} />} />
            </Routes>
            <div className="App">
                {/* 顶部的导航栏 */}
                <Head
                    theme={isNight ? 'night' : 'light'}
                    HeadNameArray={[
                        ['首页', '/'],
                        [
                            '博客',
                            '/blog',
                            [
                                ['新建', '/blog/new'],
                                ['浏览', '/blog'],
                            ],
                        ],
                        [
                            '笔记',
                            '/note',
                            [
                                ['新建', '/note/new'],
                                ['浏览', '/note'],
                            ],
                        ],
                        ['生活', '/live'],
                        ['友链', '/friend'],
                        ['Github', '/github'],
                        <img
                            onClick={() => {
                                SetNight(!isNight);
                            }}
                            src={isNight ? moon : sun}
                            style={{ width: '14px', height: '14px' }}
                            alt="moon"
                        />,
                    ]}
                ></Head>
            </div>
        </BrowserRouter>
    );
}

export default App;
