import axios, { AxiosRequestConfig } from 'axios'
import classNames = require('classnames')
import * as React from 'react'
import { DashboardContext } from './DashboardContext'
import PopupScreen from './PopupScreen'
import QRCodeScanner from './QRCodeScanner'
import TakePhoto from './TakePhoto'
import { useToast } from './Toast'

interface IHandOverProps {
    show: boolean,
    onClose: () => void
    itemId: string,
    claimed: string[]
}

interface IHandOver {
    email: string,
    lostItem: string,
    photo: string
}

const Handover: React.FunctionComponent<IHandOverProps> = (props) => {

    const Context = React.useContext(DashboardContext)

    let { show, onClose, claimed, itemId } = props

    let [step, setStep] = React.useState<"confirm" | "scan" | "photo" | "done">("confirm")
    let [processing, setProcessing] = React.useState(false)
    let [openScanner, setOpenScanner] = React.useState(false)
    let [handoverItem, setHandoverItem] = React.useState<IHandOver>({
        email: "",
        lostItem: "",
        photo: ""
    })


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
                LostItemID: handoverItem.lostItem,
                HandedOverEmail: handoverItem.email,
                HandedOverToImageUrl: handoverItem.photo
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


    function updateEmail(val: string) {
        setHandoverItem(prev => ({ ...prev, ...{ email: val } }))
    }

    function updateQrCode(id: string) {
        setHandoverItem(prev => ({ ...prev, ...{ lostItem: id } }))
    }
    function updatePhoto(image: string) {
        setHandoverItem(prev => ({ ...prev, ...{ photo: image } }))
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
                        <div className="search-box-cont">

                            <div className="title">Enter email here</div>

                            <input type="text" placeholder="Start typing..."
                                value={handoverItem.email}
                                onChange={(e) => { updateEmail(e.target.value) }}
                                autoFocus
                            />
                        </div>

                        <div className="user-list-title">Or select one from the list</div>

                        <div className="claimed-users">
                            {claimed?.map((user: string, key: number) => {
                                return (<div className={classNames("user")} key={key} onClick={() => updateEmail(user)} >
                                    <div className="icon-cont">
                                        <div className="icon"></div>
                                    </div>

                                    <div className="email">{user} </div>

                                    <div className="btn">select</div>
                                </div>)
                            })}
                        </div>

                        <div className="btn-cont">
                            <button className="btn" onClick={() => {
                                if (handoverItem.email.trim().length > 0) {
                                    setStep("scan")
                                }
                                else {
                                    Toast.error("Please enter or select an email to continue")
                                }
                            }} >Continue</button>
                        </div>
                    </>
                }

                {step == "scan" &&
                    <>
                        <div className="text">Has reported as lost item? </div>


                        <div className="btn-cont">
                            <button className={classNames("btn", { "active": handoverItem.lostItem.trim().length > 0 })} onClick={() => setOpenScanner(true)}  >
                                {handoverItem.lostItem.trim().length > 0 ? "Scan Again" : "Scan QR Code"}
                            </button> <br />
                            <button className="btn" onClick={() => setStep("photo")} >
                                {handoverItem.lostItem.trim().length > 0 ? "Continue" : "Skip"}
                            </button>
                        </div>

                        <QRCodeScanner
                            show={openScanner}
                            onClose={() => setOpenScanner(false)}
                            onChange={updateQrCode}
                        />
                    </>
                }

                {step == "photo" &&
                    <>
                        <div className="text">Take a photo  </div>


                        <TakePhoto
                            onChange={(i, f) => updatePhoto(i)}
                            onUpload={() => setProcessing(true)}
                            afterUpload={() => setProcessing(false)}
                        />

                        <div className="btn-cont">
                            <button className="btn" onClick={() => {
                                if (processing) {
                                    Toast.info("Photo is being uploaded. please wait")
                                    return
                                }
                                setStep("done")
                            }} >
                                {
                                    processing ? "Uploading..."
                                        :
                                        <> {handoverItem.photo.trim().length > 0 ? "Continue" : "Skip"}</>

                                }
                            </button>
                        </div>

                    </>
                }

                {step == "done" &&
                    <>
                        <div className="text">All Done. </div>
                        <div className="btn-cont">
                            <button className="btn" onClick={handover} >
                                {processing ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </>}

            </div>
        </div>
    </PopupScreen>)
}

export default Handover