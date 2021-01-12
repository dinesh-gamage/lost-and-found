import axios, { AxiosRequestConfig } from 'axios'
import classNames = require('classnames')
import * as React from 'react'
import { DashboardContext } from './DashboardContext'
import PopupScreen from './PopupScreen'
import QRCodeScanner from './QRCodeScanner'
import { useToast } from './Toast'

interface IORCodeScanProps {
    show: boolean,
    onClose: () => void
}
interface IScanItem {
    itemId: string
    bagId: string,
    policeStation: string,
    locker: string,
    data: {
        itemType: "normal" | "valuable" | "suspicious",
        note?: string
    }
}

const QRCodeScanPanel: React.FunctionComponent<IORCodeScanProps> = (props) => {

    const Context = React.useContext(DashboardContext)

    //props
    let { show, onClose } = props

    // state
    let [step, setStep] = React.useState<"scan" | "locker" | "details" | "done">("scan")
    let [processing, setProcessing] = React.useState(false)
    let [openScanner, setOpenScanner] = React.useState(false)
    let [scanItem, setScanItem] = React.useState<IScanItem>({
        itemId: "",
        bagId: "",
        policeStation: "SAPF-023",
        locker: "",
        data: {
            itemType: "normal",
            note: ""
        }
    })

    const policeStationLocation = { lat: "24.4334504", long: "39.6606513", name: "Central Police Station" }

    let Toast = useToast();

    React.useEffect(() => {
        setStep("scan")
        setProcessing(false)
        setOpenScanner(false)
        setScanItem({
            itemId: "",
            bagId: "",
            policeStation: "SAPF-023",
            locker: "",
            data: {
                itemType: "normal",
                note: ""
            }
        })
    }, [props])

    React.useEffect(() => {
        if (step == "locker") {
            getItemDetails(scanItem.bagId)
        }
    }, [step])

    function updateBagId(id: string) {
        setScanItem(prev => ({ ...prev, ...{ bagId: id } }))
    }

    function updateItemType(t: any) {
        let d = scanItem.data
        d.itemType = t

        setScanItem(prev => ({ ...prev, ...{ data: d } }))
    }

    function updateNode(t: string) {
        let d = scanItem.data
        d.note = t

        setScanItem(prev => ({ ...prev, ...{ data: d } }))
    }

    function getItemDetails(bagId: string) {
        if (!processing) {
            setProcessing(true)

            let _url = Context.baseUrl + "Lucy/FoundItem/findbybagid"

            let config: AxiosRequestConfig = {
                headers: {
                    "Authorization": `APIKEY ${Context.apiKey}`
                }
            }

            axios.post(_url, { id: bagId }, config)
                .then((res) => {
                    console.log("res bag res", res)
                    setScanItem(prev => ({ ...prev, ...{ itemId: res.data._id } }))
                    setProcessing(false)
                })
                .catch((e) => {
                    console.log("Exception : ", e)
                    setProcessing(false)
                    Toast.error("Something went wrong")
                    setStep("scan")
                    setScanItem(Object.assign({}, scanItem, {
                        itemId: "",
                        bagId: "",
                    }))
                })
        }
    }

    function onComplete() {
        // validate

        if (!processing) {
            setProcessing(true)

            let _url = Context.baseUrl + "Lucy/FoundItem/" + scanItem.itemId

            let config: AxiosRequestConfig = {
                headers: {
                    "Authorization": `APIKEY ${Context.apiKey}`
                }
            }

            let data = {
                data: {
                    PoliceStationID: scanItem.policeStation,
                    LockerID: scanItem.locker,
                    Data: {
                        ItemType: scanItem.data.itemType,
                        Note: scanItem.data.note
                    }
                }
            }

            axios.put(_url, data, config)
                .then((res) => {
                    Toast.success("Item Tagged")
                    setProcessing(false)
                    onClose()
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

                <div className="title">Tag And Bag Item</div>

                <div className="close-btn" onClick={onClose} >
                    <div className="icon-cont">
                        <div className="icon"></div>
                    </div>
                </div>
            </div>
            <div className="claim-item">


                {step == "scan" &&
                    <>
                        <div className="text">Scan QR Code on the Bag </div>


                        <div className="btn-cont">
                            <button className={classNames("btn", { "active": scanItem.bagId.trim().length > 0 })} onClick={() => setOpenScanner(true)}  >
                                {scanItem.bagId.trim().length > 0 ? "Scan Again" : "Scan QR Code"}
                            </button> <br />

                            {
                                scanItem.bagId.trim().length > 0 &&
                                <button className="btn" onClick={() => {
                                    if (scanItem.bagId.trim().length > 0) {
                                        setStep("locker")
                                        return
                                    }
                                    Toast.error("Scan the QR code on the bag before continue")
                                }} >
                                    Continue
                            </button>
                            }

                        </div>

                        <QRCodeScanner
                            show={openScanner}
                            onClose={() => setOpenScanner(false)}
                            onChange={updateBagId}
                        />
                    </>
                }

                {step == "locker" &&
                    <>
                        {processing ?
                            <div className="text">Getting item details please wait... </div>
                            :
                            <>
                                <div className="text">Scan QR Code on the Locker </div>


                                <div className="btn-cont">
                                    <button className={classNames("btn", { "active": scanItem.locker.trim().length > 0 })} onClick={() => setOpenScanner(true)}  >
                                        {scanItem.locker.trim().length > 0 ? "Scan Again" : "Scan QR Code"}
                                    </button> <br />
                                    <button className="btn" onClick={() => setStep("details")} >
                                        {scanItem.locker.trim().length > 0 ? "Continue" : "Skip"}
                                    </button>
                                </div>

                                <QRCodeScanner
                                    show={openScanner}
                                    onClose={() => setOpenScanner(false)}
                                    onChange={updateBagId}
                                />
                            </>

                        }
                    </>
                }

                {step == "details" &&
                    <>
                        <div className="text">Select Item Type. </div>

                        <div className="item-type">
                            <div className="toggle">
                                <div className={classNames("btn normal", { "active": scanItem.data.itemType == "normal" })}
                                    onClick={() => { updateItemType("normal") }}
                                >Normal</div>
                                <div className={classNames("btn valuable", { "active": scanItem.data.itemType == "valuable" })}
                                    onClick={() => { updateItemType("valuable") }}
                                >Valuable </div>
                                <div className={classNames("btn suspicious", { "active": scanItem.data.itemType == "suspicious" })}
                                    onClick={() => { updateItemType("suspicious") }}
                                >Suspicious</div>
                            </div>
                        </div>
                        <br />
                        <br />
                        <div className="search-box-cont">

                            <div className="title">Any notes?.</div>

                            <input type="text" placeholder="Start typing..."
                                value={scanItem.data.note}
                                onChange={(e) => { updateNode(e.target.value) }}
                                autoFocus
                            />
                        </div>
                        <div className="btn-cont">
                            <button className="btn" onClick={() => setStep("done")} >
                                Continue
                            </button>
                        </div>
                    </>}

                {step == "done" &&
                    <>
                        <div className="text">All Done. </div>
                        <div className="btn-cont">
                            <button className="btn" onClick={onComplete} >
                                {processing ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </>}

            </div>
        </div>
    </PopupScreen>)
}

export default QRCodeScanPanel