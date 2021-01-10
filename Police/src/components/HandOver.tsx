import axios, { AxiosRequestConfig } from 'axios'
import * as React from 'react'
import { DashboardContext } from './DashboardContext'
import PopupScreen from './PopupScreen'
import { useToast } from './Toast'

interface IHandOverProps {
    show: boolean,
    onClose: () => void
    email: string,
    itemId: string
}

const Handover: React.FunctionComponent<IHandOverProps> = (props) => {

    const Context = React.useContext(DashboardContext)

    let { show, onClose, email, itemId } = props

    let [lostItem, setLostItem] = React.useState<string>("")
    let [step, setStep] = React.useState<"confirm" | "scan" | "done">("confirm")
    let [processing, setProcessing] = React.useState(false)
    let [openScanner, setOpenScanner] = React.useState(false)

    let Toast = useToast();


    function handover() {
        if (!processing) {
            setProcessing(true)

            let _url = Context.baseUrl + "Lucy/FoundItem/handover/" + itemId

            let config: AxiosRequestConfig = {
                headers: {
                    "Authorization": `APIKEY ${Context.apiKey}`
                }
            }

            let data = {
                LostItemID: lostItem,
                HandedOverEmail: email
            }

            axios.post(_url, data, config)
                .then((res) => {
                    onClose()
                    Toast.success("Item handover")
                    setProcessing(false)
                })
                .catch((e) => {
                    console.log("Exception : ", e)
                    setProcessing(false)
                    Toast.error("Something went wrong")
                })
        }
    }

    return (<PopupScreen show={show} >
        <div className="mda-search-panel-cont claim">
            <div className="header">
                <div className="back-btn" onClick={onClose} >
                    <div className="icon-cont">
                        <div className="icon"></div>
                    </div>
                </div>

                <div className="title">Handover Item</div>

                <div className="close-btn" onClick={onClose} >
                    <div className="icon-cont">
                        <div className="icon"></div>
                    </div>
                </div>
            </div>
            <div className="claim-item">

                {step == "confirm" &&
                    <>
                        <div className="text">{email}</div>

                        <div className="btn-cont">
                            <button className="btn" onClick={() => setStep("scan")} >Continue</button>
                        </div>
                    </>
                }

                {step == "scan" &&
                    <>
                        <div className="text">Has reported as lost item? </div>
                        <div className="btn-cont">
                            <button className="btn" onClick={() => setOpenScanner(true)}  >Scan QR Code</button> <br />
                            <button className="btn" onClick={() => setStep("done")} >Skip</button>
                        </div>
                    </>
                }

                {step == "done" &&
                    <>
                        <div className="text">All Done. </div>
                        <div className="btn-cont">
                            <button className="btn" onClick={handover} >Handover</button>
                        </div>
                    </>}

            </div>
        </div>
    </PopupScreen>)
}

export default Handover