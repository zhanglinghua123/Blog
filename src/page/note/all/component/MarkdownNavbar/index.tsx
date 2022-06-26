import { Anchor } from 'antd';
import MarkdownNavbar from 'markdown-navbar';
import 'markdown-navbar/dist/navbar.css';
const MakedownNavbar = (props: { source: string; className: string }) => {
    const { source, className } = props;
    return (
        <div className={className}>
            {/* <Anchor> */}
            <div style={{ fontWeight: 500, fontSize: '16px', padding: '10px 0 10px 10px' }}>
                文章目录
            </div>
            <MarkdownNavbar source={source} ordered></MarkdownNavbar>
            {/* </Anchor> */}
        </div>
    );
};
export default MakedownNavbar;
