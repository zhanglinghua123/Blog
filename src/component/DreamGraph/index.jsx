import * as d3 from "d3"
import { createRoot } from "react-dom/client"
import { useEffect } from "react"
import { getRandom } from "../ClickHeart"
import "./index.less"
function calcSize(length) {
    return Math.ceil(Math.sqrt(length))
}

function r(m, n) {
    return (Math.random() * (n - m) + m).toFixed(2) } 
export const DreamGraph = (props) => {
    const {ContainerId, data, clickEvent} = props
    let svg
    useEffect(() => {
        
        const width = window.innerWidth
        const height = window.innerHeight
        // SVG 根节点
        svg = d3
            .select(`#${ContainerId}`)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "chart")
            .style("background", "linear-gradient(#16161d, #1f1f3a, #3b2f4a)")
        const simulationNodes = svg
            .append("g")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("stroke", "white")
            .attr("stroke-width", "2px")
            .attr("r", (d) => { return calcSize(d.todo.length)*12})
            .attr("fill", () => getRandom()) // 叶子节点黑底白边，父节点白底黑边
        // 文本节点
        const simulationText = svg
            .append("g")
            .style('font-weight', 500)
            .style('font-family', 'Arial')
            .style("font-size", '14px')
            .style("text-anchor", "middle")
            // .style("dominant-baseline", "middle")
            .style("user-select", "none")
            .selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .style("fill", "white")
            .attr("y", (d) => { return -Math.ceil(d.todo.length/ calcSize(d.todo.length))*16/2})
        // 将文字切分为段落
        simulationText
            .selectAll("tspan")
            .data(d => {
                let count = calcSize(d.todo.length)
                let result = []
                let number = count
                for(;number<d.todo.length;number+=count) 
                    result.push(d.todo.substring(number-count, number))
                result.push(d.todo.substring(number-count, d.todo.length))
                return result
            })
            .enter()
            .append("tspan")
            .text(d => {return d})
            .attr("dy", "16px")
            .attr("x", 0)
        // 添加背景的星光效果
        svg.append("g")
            .selectAll("circle")
            .data(new Array(120).fill(0))
            .enter()
            .append("circle")
            .attr("class", "star")
            .attr("cx", () => r(0, 100) + "%")
            .attr("cy", () => r(0, 100)+"%")
            .attr("r", () => r(0, 2))
            .style("animation-delay", () => r(0, 2)+"s")
        // 添加背景右下角的文字
        svg.append("g")
            .append("text")
            .style("transform", () => `translate(${width-100}px,${height-86}px)`)
            .style('font-weight', 500)
            .style('font-family', 'Arial')
            .style("font-size", '16px')
            .style("text-anchor", "middle")
            .style("letter-spacing", "2px")
            .style("fill", "white")
            .selectAll("tspan")
            .data(["我向流星许下心愿", "希望我爱的人和爱我的人", "今生幸福平安"])
            .enter()
            .append("tspan")
            .attr("dy", "24px")
            .attr("x", 0)
            .text(d => d)
        // 为每个节点添加点击事件
        svg.selectAll("circle")
            .on("click", (event, d) => clickEvent(event, d))
        // 这样来规定每个节点的力分别为多少
        const simulation = d3
            .forceSimulation(data)
            .force("collide", d3.forceCollide().radius(d => calcSize(d.todo.length)*12+1))
            // .force("center", d3.forceCenter(width / 2, height / 2))
            .force("x", d3.forceX(width / 2))
            .force("y", d3.forceY(height / 2))
    
        // .call(d3.drag().on("start", started).on("drag", dragged).on("end", ended))
        // 创建力学的仿真系统 添加排斥 连接 x y 方向的定位力
        // .force("center", d3.forceCenter(width / 2, height / 2))
        // 设置对应力的属性
        simulation.alphaDecay(0.05)
        simulation.force("collide").strength(1).iterations(2)
        simulationNodes.call(d3.drag().on("start", started).on("drag", dragged).on("end", ended))
        function started(event, d) {
            if (!d.active) simulation.alphaTarget(0.2).restart()
            d.fx = d.x // fx fy 表示节点一下次节点被固定的位置
            d.fy = d.y
        }
    
        function dragged(event, d) {
            d.fx = event.x
            d.fy = event.y
        }
    
        function ended(event, d) {
            if (!d.active) simulation.alphaTarget(0)
            d.fx = null
            d.fy = null
        }
    
        simulation.on("tick", ticked)
    
        function ticked() {
            simulationNodes.attr("cx", (d) => { return d.x}).attr("cy", (d) => d.y)
            simulationText.style("transform", d => `translate(${d.x}px,${d.y}px)`)
            // .attr("x", (d) => d.x).attr("y", (d) => d.y)
        }
       
    }, [data])
    // 只挂载一个svg节点 每次重新加载的时候 则将该SVG节点进行挂载
    useEffect(() => {
        const div = document.getElementById("chart")
        createRoot(div).render(svg.node())
        return () => {
            svg.remove()
        }
    }, [data])
    return (
        <>
            <div id="chart">
            </div>
        </>)
}
