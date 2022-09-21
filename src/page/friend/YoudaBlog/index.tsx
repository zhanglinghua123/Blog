import { useEffect } from "react"
import { Drawing } from "../../../component/Canvas/YoudaBlog"

export const YoudaBlog = () => {
    useEffect(() => {
        Drawing.render()
        return () => 
            Drawing.remove()
    }, [])
    return (<div>
        <canvas id="canvas"></canvas>
    </div>)
}