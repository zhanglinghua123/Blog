export const getPreFixCls = (name: string) => {
    let obj: {
        [keyname: string]: string;
    } = {
        tip: 'blog-tip',
        card: 'blog-card',
        intro: 'blog-intro',
        note: 'blog-note',
        blog: 'blog-blog',
        list: 'blog-list',
    };
    return obj[name];
};
