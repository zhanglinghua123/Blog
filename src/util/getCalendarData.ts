export const getCalendarData = () => {
    let sumDay= mGetDate()
    let firstWeekDay = mFirstGetDate()
    let result : {day:number, weekday : number}[] = []
    for(let i=1;i<=sumDay;i++) 
    {
        result.push({
            day: i,
            weekday: firstWeekDay
        })
        firstWeekDay++
        if(firstWeekDay > 7) 
            firstWeekDay -= 7
    }
    let mid = result[0].weekday
    // console.log(firstWeekDay, result[0].weekday, sumDay)
    if(result[0].weekday !== 7) {
        for(let i=1;i<=mid ;i++) {
            // console.log(i, result.length)
            result.unshift({
                day: 0,
                weekday: i
            })
        }
    }
    console.log(result, result.length)
    return result
}
// 获取当月有几天
function mGetDate() {
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth()+1
    var d = new Date(year, month, 0)
    return d.getDate()
}
// 获取当月第一天是周几
function mFirstGetDate() {
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth()
    var d = new Date(year, month, 1)
    return d.getDay()
}
