import MarkdownNavbar from 'markdown-navbar';
import './index.less';
import 'markdown-navbar/dist/navbar.css';
const MakedownNavbar = (props: { source: string; className: string }) => {
    const { source, className } = props;
    return (
        <div className={className}>
            {/* <Anchor> */}
            <div
                style={{
                    fontWeight: 500,
                    fontSize: '16px',
                    padding: '20px 10px 10px 10px',
                    borderBottom: '2px solid rgba(0,0,0,0.06)',
                }}
            >
                文章目录
            </div>
            <MarkdownNavbar source={source}></MarkdownNavbar>
            {/* </Anchor> */}
        </div>
    );
};
export default MakedownNavbar;
