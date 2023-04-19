import { Button,  Input} from "antd"
import { Icon } from "minereactcomponentlibrary"
import { getPreFixCls } from "../../../../../util/getPrefixCls"
import rightIcon from "../../../../../static/picture/iconright.png"
import wrongIcon from "../../../../../static/picture/iconwrong.png"
import "./index.less"
import { useEffect, useRef, useState } from "react"
interface ItemProps  {
    answer:string,
    hasSubmit:boolean,
    // eslint-disable-next-line no-unused-vars
    onLearn : (val:{ sound? : string, meanings? : {partOfSpeech:string, definitions:{definition:string}[]}[]}) => void
    onEnter ? : ()=>void
}
export const ReciteItem = (props : ItemProps) => {


    const { answer, onLearn, onEnter, hasSubmit } = props
    const prefix = getPreFixCls("words-recite-item")
    // eslint-disable-next-line no-unused-vars
    const [hasCheck, setCheck] = useState<boolean>(false)

    // 代表button 已经被点击
    const [hasClick, setClick] = useState<boolean>(false)

    const [rightAnswer, setrightAnswer] = useState<{ sound? : string, meanings? : {partOfSpeech:string, definitions:{definition:string}[]}[]}>({})

    const inputChineseValue = useRef<any>(null)
    const inputEnglishValue = useRef<any>(null)

    // http://dict.youdao.com/dictvoice?type=0&audio=

    // 获取对应的正确答案
    useEffect(() => {
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${answer.trim()}`).then(val => val.json()).then(val => {
            let phonetic = val[0].phonetic
            if(phonetic === undefined) {
                let mid = val[0].phonetics.pop()
                phonetic = mid.text
            }
            setrightAnswer({sound: phonetic, meanings: val[0].meanings})
        }).catch(() => {
            console.log(`this word has error`)
        })
    }, [])

    useEffect(() => {
        if(hasSubmit)inputEnglishValue.current.input.value = answer
    }, [hasSubmit])

    const radioPlay = (word:string) => {
        if(!hasClick) {
            setClick(true)
            const music = new Audio(`http://dict.youdao.com/dictvoice?type=0&audio=${word}`)
            music.play()
            music.addEventListener("ended", () => {
                setClick(false)
            })
        }
    }
   

    return (<div className={`${prefix}-container`}>
        <button onClick={() => radioPlay(answer)} style={{
            backgroundColor: hasClick ? "#1890ff" : ""
        }}>
            <Icon size="16px" style={{               
                filter: "invert(100%) sepia(0%) saturate(7480%) hue-rotate(256deg) brightness(106%) contrast(106%)"
            }} src={ hasClick ? "pause" :"caretright" }></Icon>
        </button> 
        <Input onFocus={() => radioPlay(answer)} onPressEnter={onEnter} ref={inputEnglishValue} style={{
            width: "15%"
        }}></Input>
        <span><img style={{
            width: "20px",
            height: "20px",
            opacity: hasSubmit || hasCheck ? 1 : 0
        }} src={ hasSubmit || hasCheck ?  answer === inputEnglishValue.current.input.value ?  rightIcon : wrongIcon : "" }></img></span>
        <Input onPressEnter={onEnter} ref={inputChineseValue} style={{
            width: "15%"
        }}></Input>
        <Button onClick={() => onLearn(rightAnswer)}>详细释义 : </Button>
        <button className="buttonLast" onClick={() => setCheck(true)}>Check</button>
    </div>)
}