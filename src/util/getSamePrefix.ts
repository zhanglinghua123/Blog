export const getSamePrefix = (titleArray: {title:string, _id:string}[], searchContent:string, completeContent : number) => {
    let maxNumber = 0
    let maxLongTitle = []
    for(let item of titleArray) {
        let mid = longestCommonSubsequence(item.title, searchContent)
        if(maxLongTitle[mid]) 
            maxLongTitle[mid].push(item)
        else
            maxLongTitle[mid] = [item]
        
        if(mid > maxNumber) 
            maxNumber = mid
        
    }
    maxLongTitle.splice(0, 1)
    const mid = maxLongTitle.flat().reverse()
    if(mid.length <= completeContent) return mid
    else return  mid.slice(mid.length-completeContent, mid.length-1)
}

var longestCommonSubsequence = function(text1:string, text2:string):number {
    const m = text1.length, n = text2.length
    const dp = new Array(m + 1).fill(0).map(() => new Array(n + 1).fill(0))
    for (let i = 1; i <= m; i++) {
        const c1 = text1[i - 1]
        for (let j = 1; j <= n; j++) {
            const c2 = text2[j - 1]
            if (c1 === c2) 
                dp[i][j] = dp[i - 1][j - 1] + 1
            else 
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
            
        }
    }
    return dp[m][n]
}
