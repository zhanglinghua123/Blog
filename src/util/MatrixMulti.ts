// 返回的是 针对于Ｘ坐标轴旋转后的Ｙ轴坐标
let xSameMap = (Xdeg:number, y:number, z:number) => {
    let map
    switch(Xdeg%360) {
    case 0:
        // y,z
        map = [[0, 0, 0], [1, 1, 1], [2, 2, 2]]
        return map[y][z]
    case 90:
        map = [[2, 1, 0], [2, 1, 0], [2, 1, 0]]
        return map[y][z]            
    case 180: 
        map = [[2, 2, 2], [1, 1, 1], [0, 0, 0]]
        return map[y][z]
    case 270:
        map = [[0, 1, 2], [0, 1, 2], [0, 1, 2]]
        return map[y][z]
    }
    return null
}
// 返回的是 针对于Ｙ坐标轴旋转后的Ｘ轴坐标
let ySameMap = (Ydeg:number, x:number, z:number) => {
    let map
    switch(Ydeg%360) {
    case 0:
        // x,z
        map = [[0, 0, 0], [1, 1, 1], [2, 2, 2]]
        return map[x][z]
    case 90:
        map = [[0, 1, 2], [0, 1, 2], [0, 1, 2]]
        return map[x][z]            
    case 180: 
        map = [[2, 2, 2], [1, 1, 1], [0, 0, 0]]
        return map[x][z]
    case 270:
        map = [[2, 1, 0], [2, 1, 0], [2, 1, 0]]
        return map[x][z]
    }
    return null
}
export const MatrixMulti = (matrix1:number[][], matrix2:number[][]) => {
    let result = new Array(matrix1.length).fill(1).map(() => {
        return new Array(matrix2[0].length).fill(0)
    })
    for(let i=0;i<matrix1.length;i++)
    {for(let j=0;j<matrix2[0].length;j++)
    {   
        for(let z=0;z<matrix2.length;z++)     
            result[i][j] += matrix1[i][z] * matrix2[z][j]}
    }
    return result    
}
// 输入的是转动的角度
const VectorX = (vector : number[], deg:number):number[] => {
    deg = deg / 180 * Math.PI
    const rotateMatrix = [
        [1, 0, 0],
        [0, Math.cos(deg), -Math.sin(deg)],
        [0, Math.sin(deg), -Math.cos(deg)]
    ]
    let mid = MatrixMulti(rotateMatrix, vector.map(val => [val]))
    return [mid[0][0], mid[1][0], mid[2][0]].map(val => Math.abs(val)  === 6.123233995736766e-17? 0 : val)
}
const VectorY = (vector:number[], deg:number):number[] => {
    deg = deg * Math.PI / 180
    const rotateMatrix = [
        [Math.cos(deg), 0, Math.sin(deg)],
        [0, 1, 0],
        [-Math.sin(deg), 0, Math.cos(deg)]
    ]
    let mid = MatrixMulti(rotateMatrix, vector.map(val => [val]))
    return [mid[0][0], mid[1][0], mid[2][0]].map(val => Math.abs(val)  === 6.123233995736766e-17? 0 : val)
}
const VectorZ = (vector:number[], deg:number):number[] => {
    deg = deg * Math.PI / 180
    const rotateMatrix = [
        [Math.cos(deg), -Math.sin(deg), 0],
        [Math.sin(deg), Math.cos(deg), 0],
        [0, 0, 1]
    ]
    let mid = MatrixMulti(rotateMatrix, vector.map(val => [val]))
    return [mid[0][0], mid[1][0], mid[2][0]].map(val => Math.abs(val)  === 6.123233995736766e-17? 0 : val)
}

// 代表每个小方框的个人坐标系
export class BlockCoordinateSystem {
    public XVector : number[]
    public YVector : number[]
    public ZVector : number[]
    public WorldX:number
    public WorldY:number
    public WorldZ:number
    public BeginCoordinate:number[][]
    public WorldRotateX : number
    public WorldRotateY : number
    public WorldRotateZ : number
    public WorldToBlock : number[][]
    // 初始化的世界坐标
    constructor(x:number, y:number, z:number) {
        this.XVector = [1, 0, 0]
        this.YVector = [0, 1, 0]
        this.ZVector = [0, 0, 1]
        this.WorldRotateX = 0
        this.WorldRotateY = 0
        this.WorldRotateZ = 0
        this.BeginCoordinate = [[x], [y], [z]]
        this.WorldX = x
        this.WorldY = y
        this.WorldZ = z
        // 世界坐标系 向量 向 Block坐标系的转换矩阵
        this.WorldToBlock = [
            this.XVector,
            this.YVector,
            this.ZVector
        ]
    }

    // Rotate 代表根据个人坐标系的对应轴进行旋转
    // WorldRotatev代表根据世界坐标系的对应轴进行旋转
    // RotateXWorldCoordinate90 代表在世界坐标系下面旋转90度 坐标的变化 
    MathCos(deg:number) {
        return Math.abs(Math.cos(deg)) === 6.123233995736766e-17? 0 : Math.cos(deg)
    }
    MathSin(deg:number) {
        return Math.abs(Math.sin(deg)) === 6.123233995736766e-17? 0 : Math.sin(deg)
    }
    // 更新世界坐标系下面的XYZ坐标
    UpdateWorldXYZ(direction:"X" | "Y" | "Z", deg:number, isRound:boolean) {
        let next 
        switch(direction) {
        case "X":
            next = VectorX([this.WorldX, this.WorldY, this.WorldZ], deg)
            break
        case "Y":
            next = VectorY([this.WorldX, this.WorldY, this.WorldZ], deg)
            break
        case "Z":
            next = VectorZ([this.WorldX, this.WorldY, this.WorldZ], deg)
            break
        }
        if(isRound)
            next = next.map(val => Math.round(val))
        // console.log(deg, direction, "转换之前",  [this.WorldX, this.WorldY, this.WorldZ])
        const [x, y, z] = next
        this.WorldX = x
        this.WorldY = y
        this.WorldZ = z
        // console.log("转换之后", this.WorldX, this.WorldY, this.WorldZ)
    }
    RotateX(deg:number) {
        this.YVector = VectorX(this.YVector, deg)
        this.ZVector = VectorX(this.ZVector, deg)
    }
    
    RotateY(deg:number) {
        this.XVector = VectorY(this.XVector, deg)
        this.ZVector = VectorY(this.ZVector, deg)
    }
   
    RotateZ(deg:number) {
        this.XVector = VectorZ(this.XVector, deg)
        this.YVector = VectorZ(this.YVector, deg)
    }
    World_Rotate(deg:number, direction:"X" | "Y" | "Z") {
        const directionArray = {X: [[1], [0], [0]], Y: [[0], [1], [0]], Z: [[0], [0], [1]]}
        const VectorRotate = {
            X: VectorX,
            Y: VectorY,
            Z: VectorZ
        }
        this.UpdateWorldXYZ(direction, deg, true)
        // 增加对应的旋转角度
        this[`WorldRotate${direction}`] += 90
        let vectorz =  MatrixMulti(this.WorldToBlock, directionArray[direction])
        console.log(vectorz.toString(), this.WorldToBlock, "转换前")
        // debugger
        switch(vectorz.toString()) {
        case [[1], [0], [0]].toString():
            this.XVector = VectorRotate[direction](this.XVector, deg)
            this.YVector = VectorRotate[direction](this.YVector, deg)
            this.ZVector = VectorRotate[direction](this.ZVector, deg)
            this.WorldToBlock = [
                this.XVector,
                this.YVector,
                this.ZVector
            ]
            return {
                rotate: "rotateX(90deg)"
            }
        case [[-1], [0], [0]].toString():
            this.XVector = VectorRotate[direction](this.XVector, deg)
            this.YVector = VectorRotate[direction](this.YVector, deg)
            this.ZVector = VectorRotate[direction](this.ZVector, deg)
            this.WorldToBlock = [
                this.XVector,
                this.YVector,
                this.ZVector
            ]
            return {
                rotate: "rotateX(-90deg)"
            }
        case [[0], [1], [0]].toString():
            this.XVector = VectorRotate[direction](this.XVector, deg)
            this.YVector = VectorRotate[direction](this.YVector, deg)
            this.ZVector = VectorRotate[direction](this.ZVector, deg)
            this.WorldToBlock = [
                this.XVector,
                this.YVector,
                this.ZVector
            ]
            return {
                rotate: "rotateY(90deg)"
            }
        case [[0], [-1], [0]].toString():
            this.XVector = VectorRotate[direction](this.XVector, deg)
            this.YVector = VectorRotate[direction](this.YVector, deg)
            this.ZVector = VectorRotate[direction](this.ZVector, deg)
            this.WorldToBlock = [
                this.XVector,
                this.YVector,
                this.ZVector
            ]
            return {
                rotate: "rotateY(-90deg)"
            }
        case [[0], [0], [1]].toString():
            this.XVector = VectorRotate[direction](this.XVector, deg)
            this.YVector = VectorRotate[direction](this.YVector, deg)
            this.ZVector = VectorRotate[direction](this.ZVector, deg)
            this.WorldToBlock = [
                this.XVector,
                this.YVector,
                this.ZVector
            ]
            return {
                rotate: "rotateZ(90deg)"
            }
        case [[0], [0], [-1]].toString():
            this.XVector = VectorRotate[direction](this.XVector, deg)
            this.YVector = VectorRotate[direction](this.YVector, deg)
            this.ZVector = VectorRotate[direction](this.ZVector, deg)
            this.WorldToBlock = [
                this.XVector,
                this.YVector,
                this.ZVector
            ]
            return {
                rotate: "rotateZ(-90deg)"
            }
        }
        return {
            rotate: ""
        }
    }
}
export {
    VectorX,
    VectorY,
    VectorZ,
    xSameMap,
    ySameMap
}