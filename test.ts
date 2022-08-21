const union = function<T>(parent:T[], index1:number, index2:number, getValue?, setValue?) {
    parent[find(parent, index2, getValue, setValue)] = find(parent, index1, getValue, setValue)
}
const find = (parent, index, getValue = (index) => parent[index], setValue = (index, value) => {parent[index] = value}) => {
    if(getValue(index) === index) return index
    else {
        setValue(getValue(index), find(parent, parent[index]))
        return getValue(index)
    }
}
