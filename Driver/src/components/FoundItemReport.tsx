
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
        Name: Context.profile.user.name,
        Phone: Context.profile.user.phone,
        Email: Context.profile.user.email,
        Title: "",
        Description: "",
        Features: "",
        ImageUrl: "",
        LastLocation: "",
        Status: "New",
        Created: "",
        AdditionalDetails: {
            BusNumber: Context.profile.bus.number,
            BagID: "",
            ItemType: "normal"
        }
    })
    let [saving, setSaving] = React.useState<boolean>(false)


    let Toast = useToast()

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

            let data = {
                'Name': lostItem.Name,
                'Email': lostItem.Email,
                'Location': lostItem.LastLocation,
                'Description': lostItem.Description,
                'PoliceStationID': "",
                'LockerID': "",
                'Status': lostItem.Status,
                'Phone': lostItem.Phone,
                'AdditionalDetails': JSON.stringify(lostItem.AdditionalDetails),
                'ImageUrl': lostItem.ImageUrl,
                'Features': lostItem.Features,
            }

            axios.post(_url, data, config)
                .then((res) => {
                    onClose()
                    Toast.success("Item Registered")
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

    function updateItemType(type: any) {
        let _item = { ...lostItem }
        _item.AdditionalDetails.ItemType = type
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
                                <div className="name">{Context.profile.user.name}</div>
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
                                    <div className="name">{Context.profile.user.name}</div>
                                </div>
                            </div>

                            <div className="section bus">
                                <div className="icon"></div>
                                <div className="det">
                                    <div className="label">Bus number</div>
                                    <div className="name">{Context.profile.bus.label}</div>
                                </div>
                            </div>

                            <div className="section phone">
                                <div className="icon"></div>
                                <div className="det">
                                    <div className="label">mobile number</div>
                                    <div className="name">{Context.profile.user.phone}</div>
                                </div>
                            </div>

                        </div>

                    </div>
                    <div className="image-upload-cont">
                        <TakePhoto onChange={(Image, Features) => { setLostItem(Object.assign({}, lostItem, { ImageUrl: Image, Features: Features })) }} />
                    </div>
                    <div className="scan-qr">
                        <QRCodeReader onChange={updateBagId} />
                    </div>

                    <div className="btn-cont">
                        <div className="cont">
                            <div className="item-type">
                                <div className="toggle">
                                    <div className={classNames("btn normal", { "active": lostItem.AdditionalDetails.ItemType == "normal" })}
                                        onClick={() => { updateItemType("normal")}}
                                    >Normal</div>
                                    <div className={classNames("btn valuable", { "active": lostItem.AdditionalDetails.ItemType == "valuable" })}
                                        onClick={() => { updateItemType("valuable")}}
                                    >Valuable </div>
                                    <div className={classNames("btn suspicious", { "active": lostItem.AdditionalDetails.ItemType == "suspicious" })}
                                        onClick={() => { updateItemType("suspicious")}}
                                    >Suspicious</div>
                                </div>
                            </div>
                            <button className="btn" onClick={saveFoundItem}>{saving ? "Submitting..." : "Submit"}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </PopupScreen>)
}

export default FoundItemReport