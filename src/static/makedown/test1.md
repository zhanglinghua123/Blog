##### CSS

- not()函数可以用来不对某个元素进行操作

- SVG 可以通过 color back-ground-color 来修改对应的颜色

##### React

- isValidElement

  判断是否为 React 节点

- ```
  cloneElement()
  React 用来克隆节点元素的函数
  React.cloneElement(
    element,
    [config],
    [...children]
  )
  以 element 元素为样板克隆并返回新的 React 元素。config 中应包含新的 props，key 或 ref。返回元素的 props 是将新的 props 与原始元素的 props 浅层合并后的结果。新的子元素将取代现有的子元素，如果在 config 中未出现 key 或 ref，那么原始元素的 key 和 ref 将被保留。

  React.cloneElement() 几乎等同于：

  <element.type {...element.props} {...props}>{children}</element.type>
  ```
