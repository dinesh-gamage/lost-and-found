
import axios, { AxiosRequestConfig } from 'axios'
import classNames = require('classnames')
import * as React from 'react'
import { DashboardContext } from './DashboardContext'
import PopupScreen from './PopUpScreen'
import QRCodeReader from './QRCodeReader'
import TakePhoto from './TakePhoto'
import { useToast } from './Toast'

interface IFoundItemReportProps {
    show: boolean,
    onClose: () => void
}

const FoundItemReport: React.FunctionComponent<IFoundItemReportProps> = (props) => {

    const Context = React.useContext(DashboardContext)

    let { show, onClose } = props

    let [lostItem, setLostItem] = React.useState<ILostAndFoundItem>({
        _id: null,
        Name: "Mr. Mansoor Bilal",
        Phone: "+96144232121234",
        Email: "",
        Title: "",
        Description: "",
        Features: "",
        ImageUrl: "",
        LastLocation: "",
        Status: "New",
        Created: "",
        AdditionalDetails: {
            BusNumber: "4212KAA",
            BagID: ""
        }
    })
    let [saving, setSaving] = React.useState<boolean>(false)


    let Toast = useToast()

    function dataURLtoFile(base64: string, filename: string) {
        if (base64.trim().length > 0) {
            var arr = base64.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, { type: mime });
        }
        return null
    }

    function saveFoundItem() {

        // check if image & bagId is filled 
        if (lostItem.ImageUrl.trim().length == 0) {
            Toast.error("Please take a phot of the item")
            return
        }

        if (lostItem.AdditionalDetails.BagID.trim().length == 0) {
            Toast.error("Please scan the QR code on the bag")
            return
        }

        if (!saving) {
            setSaving(true)

            let _url = Context.baseUrl + "Lucy/FoundItem/create"

            let config: AxiosRequestConfig = {
                headers: {
                    "Authorization": `APIKEY ${Context.apiKey}`
                }
            }

            let data = new FormData()

            data.append("Name", lostItem.Name)
            data.append("Email", lostItem.Email)
            data.append("Phone", lostItem.Phone)
            data.append("Description", lostItem.Description)
            data.append("Status", lostItem.Status)
            data.append("PoliceStationID", "")
            data.append("LockerID", "")
            data.append("File", dataURLtoFile(lostItem.ImageUrl, "a.png"))
            data.append("AdditionalDetails", JSON.stringify(lostItem.AdditionalDetails))

            axios.post(_url, data, config)
                .then((res) => {
                    onClose()
                    Toast.success("Record created")
                    setSaving(false)
                })
                .catch((e) => {
                    console.log("Exception : ", e)
                    setSaving(false)
                    Toast.error("Something went wrong")
                })
        }
    }

    function updateBagId(id: string) {
        let _item = { ...lostItem }
        _item.AdditionalDetails.BagID = id
        setLostItem(_item)
    }

    return (<PopupScreen show={show}>
        <div className="mda-search-panel-cont">
            <div className="header">
                <div className="back-btn" onClick={onClose} >
                    <div className="icon-cont">
                        <div className="icon"></div>
                    </div>

                    <span>Home</span>
                </div>

                <div className="title">
                    <div className="icon-cont">
                        <div className="icon"></div>
                    </div>
                    <span>Report Found Item</span>
                </div>

                <div className="close-btn" onClick={onClose} >
                    <div className="icon-cont">
                        <div className="icon"></div>
                    </div>
                </div>
            </div>

            <div className="body">
                <div className="content">
                    <div className="user-details">
                        <div className="current">
                            <div className="profile-image"></div>
                            <div className="det">
                                <div className="label">current user</div>
                                <div className="name">Mr. Monsoor Bilal</div>
                            </div>
                        </div>



                        <div className="details">
                            <div className="map">
                                <div className="btn floating-btn">last location</div>
                            </div>
                            <div className="bus">
                                <div className="logo"></div>

                                <div className="text">Thank you for using</div>
                                <div className="large">Soudi public transport company</div>
                            </div>

                            <div className="section driver">
                                <div className="icon"></div>
                                <div className="det">
                                    <div className="label">Your Chauffeur</div>
                                    <div className="name">Mr. Monsoor Bilal</div>
                                </div>
                            </div>

                            <div className="section bus">
                                <div className="icon"></div>
                                <div className="det">
                                    <div className="label">Bus number</div>
                                    <div className="name">4212 KAA</div>
                                </div>
                            </div>

                            <div className="section phone">
                                <div className="icon"></div>
                                <div className="det">
                                    <div className="label">mobile number</div>
                                    <div className="name">+961423212234</div>
                                </div>
                            </div>

                        </div>

                    </div>
                    <div className="image-upload-cont">
                        <TakePhoto onChange={(s) => { setLostItem(prev => ({ ...prev, ...{ ImageUrl: s } })) }} />
                    </div>
                    <div className="scan-qr">
                        <QRCodeReader onChange={updateBagId} />
                    </div>

                    <div className="btn-cont">
                        <button className="btn" onClick={saveFoundItem}>{saving ? "Submitting..." : "Submit"}</button>
                    </div>
                </div>
            </div>
        </div>
    </PopupScreen>)
}

export default FoundItemReport