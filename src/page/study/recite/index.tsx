import { Dropdown, Menu,  Modal } from "antd"
import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { getPreFixCls } from "../../../util/getPrefixCls"
import { ReciteItem } from "./component/reciteItem"
import "./index.less"
export const Recite = () => {

    const [params] = useSearchParams ()
    const words  = params.get ('word').split(",")
    console.log(words, "---")
    
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    const [hasSubmit, setSubmit] = useState<boolean>(false)

    const [modalValue, setModalValue] = useState<{ sound? : string, meanings? : {partOfSpeech:string, definitions:{definition:string}[]}[]}>({})
    const openModal = (val: { sound? : string, meanings? : {partOfSpeech:string, definitions:{definition:string}[]}[]}) => {
        setModalValue(val)
        setIsModalOpen(true)
    }
    const onEnter = () => {
        const inputs = document.getElementsByTagName("input")
        for(let i = 0 ;i<inputs.length-1;i++) {
            if(inputs[i] === document.activeElement) {
                inputs[i+1].focus()
                break
            }
        }
    }
    const TurnIntoItem = (meanings ?: {partOfSpeech:string, definitions?:{definition:string}[]}[]) => {
        let items = []
        meanings?.forEach((val, index) => {
            items.push({
                key: index,
                label: val.partOfSpeech,
                children: val.definitions.map((val, subindex) => {
                    return {
                        key: index+"-"+subindex,
                        label: val.definition
                    }
                })
            })
        })
        return (<Menu items={items}></Menu>)
    }
    const prefix = getPreFixCls("words-recite")
    return (<div className={`${prefix}-container`}>
        <div className={`${prefix}-head`}>
            <span className="spanHead">冰月二八的单词小课堂</span>
            <button onClick={() => setSubmit(true)} style={{
                position: "absolute", 
                right: "20vw",
                margin: "2px",
                backgroundColor: "#34495e",
                borderStyle: "none"
            }}>Submit</button>
        </div>       
        <div className={`${prefix}-body`}>
            <span className="spanClass">听英写英汉</span>
            <div>
                {words.map((val) => {
                    return (<ReciteItem onEnter={onEnter} hasSubmit={hasSubmit} onLearn={openModal} key={val} answer={val}></ReciteItem>)
                })}
            </div>
        </div>
        <Modal title="详细释义" width={Math.min(window.innerWidth * 0.8, 400) } visible={isModalOpen} onOk={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)}>
            <p style={{
                fontSize: "16px",
                marginBottom: "20px"
            }}>音标:   <span>{modalValue.sound}</span></p>
            <p style={{
                fontSize: "16px",
                margin: "20px 0"
            }}>英文释义:   <Dropdown overlay={TurnIntoItem(modalValue.meanings)}>
                    <a>详细词义</a>
                </Dropdown></p>
        </Modal>
    </div>)
}
