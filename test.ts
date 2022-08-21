function updateMatrix(mat: number[][]): number[][] {
    let result = new Array(mat.length).fill(1).map(val => new Array(mat[0].length))
    let hasCheck =  new Array(mat.length).fill(1).map(val => new Array(mat[0].length).fill(false))
    let queue : {data:[number, number], count :number}[] = []
    const NeighborNode = (x:number, y:number):[number, number][] => {
        let result:[number, number][] = []
        if(x-1 >=0) 
            result.push([x-1, y])
        
        if(x+1<=mat.length-1) 
            result.push([x+1, y])
        
        if(y-1>=0) 
            result.push([x, y-1])
        
        if(y+1 <=mat[0].length-1) 
            result.push([x, y+1])
        
        return result
    }
    for(let i=0;i<mat.length;i++)
    {for(let j=0;j<mat[0].length;j++)
    {if(mat[i][j] === 0) {
        result[i][j] = 0
        hasCheck[i][j] = true
        queue.push({data: [i, j], count: 0})
    }}}
    console.log(hasCheck, queue, result, "begin--- ")
    while(queue.length) {
        let mid = queue.shift()
        console.log(mid, "mid---")
        let middata = mid!.data
        for(const node of NeighborNode(middata[0], middata[1])) {
            if(!hasCheck[node[0]][node[1]]) {
                result[node[0]][node[1]] = mid!.count + 1
                queue.push({data: node, count: mid!.count + 1})
            }
        }
    }
    return result
}
updateMatrix([[0, 0, 0], [0, 1, 0], [0, 0, 0]])