### CSS

- **.classname.classname 表示同时拥有这两个类，才渲染对应的样式**
- **.classname1 .classname 表示 classname1 的元素 下面的 classname 的元素 才渲染对应的样式**
- **Position 因为同时设置 left 和 right 的话，left 的权重比较高，此时 right 不生效。**

```ts
<div>
<div
                            onClick={
                                val.list?.length === 0
                                    ? () => onClick(val.titleUrl)
                                    : () => {
                                          // 如果再次点击active的item 则进行收回操作
                                          setActiveIndex(activeIndex === index ? -1 : index);
                                          setActiveIndexItem(-1);
                                      }
                            }
                        >
</div>
```
