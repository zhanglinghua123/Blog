import React from 'react';
import Vditor from 'vditor';
import classNames from 'classnames';
import 'vditor/dist/index.css';
import { getPreFixCls } from '../../../util/getPrefixCls';
import './index.less';
import { writeFile } from 'fs';
import { saveAs } from '../../../util/downloadfile';
type NoteProps = Partial<{
    // 当完成编写的时候 进行的回调函数
    onComplete: () => void;
    // 初始化的显示文字
    placeholder: string;
}>;
export const NewNote = (props: NoteProps) => {
    const { placeholder, onComplete } = props;
    const prefixCls = getPreFixCls('note');
    const [vd, setVd] = React.useState<Vditor>();
    React.useEffect(() => {
        const vditor = new Vditor('vditor', {
            minHeight: window.innerHeight - 60,
            after: () => {
                vditor.setValue(placeholder || '编辑你想要的内容,完成的时候输入esc');
                setVd(vditor);
            },
            esc: value => {
                onComplete?.();
                saveAs(value, 'test5.md');
            },
        });
    }, []);
    return <div id="vditor" className={classNames('vditor', `${prefixCls}-vditor`)} />;
};
