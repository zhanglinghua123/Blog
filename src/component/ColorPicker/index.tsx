import { CSSProperties } from "react"
import { HexColorPicker } from "react-colorful"

export const ColorPicker = (props:{color:string, setColor: React.Dispatch<React.SetStateAction<string>>, style:CSSProperties}) => {
    const {color, setColor, style} = props
    return <HexColorPicker style={style} color={color} onChange={setColor} />
}