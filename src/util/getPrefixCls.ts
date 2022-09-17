export const getPreFixCls = (name: string) => {
    let obj: {
        [keyname: string]: string;
    } = {
        tip: 'blog-tip',
        card: 'blog-card',
        intro: 'blog-intro',
        note: 'blog-note',
        blog: 'blog-blog',
        live: "blog-live",
        list: 'blog-list',
        blogPre: 'blog-pre',
        'note-new': 'blog-note-new',
        pageHead: "pageHead",
        login: "blog-login",
        "note-modify": "blog-note-modify",
        "blog-modify": "blog-blog-modify",
        "turn-picture": "turn-picture",
        "life-modify": "blog-life-modify",
        "life-cube": "blog-life-cube",
        "calendar": "blog-calendar",
        "calendar-component": "blog-calendar-component",
        "calendar-item": "blog-calendar-item",
        "envelope": "blog-envelope",
        'friend': 'blog-friend'
    }
    return obj[name]
}
