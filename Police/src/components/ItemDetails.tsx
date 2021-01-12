import axios, { AxiosRequestConfig } from 'axios'
import classNames = require('classnames')
import * as React from 'react'
import { getDetailsFromLocalStorage, getImageUrl, getLocationDetails, getLocationName } from '../utils'
import { DashboardContext } from './DashboardContext'
import Handover from './HandOver'
import MapComponent from './map/MapComponent'
import PopupScreen from './PopupScreen'
import { useToast } from './Toast'

interface IItemDetailsProps {
    item: ILostAndFoundItem,
    show: boolean,
    onClose: () => void,
    type: "lost" | "found" | "claimed"
}

const ItemDetails: React.FunctionComponent<IItemDetailsProps> = (props) => {
    const Context = React.useContext(DashboardContext)

    let { item, show, onClose, type } = props

    let [showHelp, setShowHelp] = React.useState<boolean>(false)
    let [Item, setItem] = React.useState<ILostAndFoundItem | null>(null)
    let [mapLoading, setMapLoading] = React.useState(false)

    React.useEffect(() => {
        if (type == "lost") {
            setItem(item)
            return
        }

        getItemDetails(item)

    }, [props])

    let Toast = useToast()

    // get location details
    let locDetails = getLocationDetails(Item, type)

    function getItemDetails(_item: ILostAndFoundItem) {
        if (_item && (_item.PoliceStationID && _item.PoliceStationID.trim().length > 0 || (_item.HandedOverEmail && _item.HandedOverEmail.trim().length > 0))) {
            setItem(_item)
            return
        }
        if (_item && _item._id) {

            let _url = Context.baseUrl + "Lucy/FoundItem/" + _item._id

            let config: AxiosRequestConfig = {
                headers: {
                    "Authorization": `APIKEY ${Context.apiKey}`
                }
            }

            setMapLoading(true)
            axios.get(_url, config)
                .then((res: any) => {
                    let data: ILostAndFoundItem = res.data
                    let locDetails: IUserLocationData = {
                        lat: "24.489442968268726",
                        long: "39.57909483821001",
                        name: ""
                    }

                    let l = data.Location

                    if (l.trim().length > 0) {
                        let d = l.split(",")
                        locDetails.lat = d[0].replace(/"/g, '')
                        locDetails.long = d[1].replace(/"/g, '')
                    }

                    let apiKey = "955e990ed9ae4fbd9b6af6041bf0fea8"



                    axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${locDetails.lat}+${locDetails.long}&key=${apiKey}`)
                        .then((res) => {
                            console.log("res ", res)
                            let address = res.data.results[0].formatted

                            locDetails.name = address

                            data.FoundLocation = JSON.stringify(locDetails)
                            setItem(data)
                            setMapLoading(false)
                        })
                        .catch((e) => {
                            console.log("exception ", e)
                            // Toast.error("Please enter last location manually")
                            data.FoundLocation = JSON.stringify(locDetails)
                            setItem(data)
                            setMapLoading(false)
                        })

                })
                .catch((e) => {
                    console.log("Exception : ", e)
                    Toast.error("something went wrong")
                    setMapLoading(false)
                })
        }
    }

    function hasHandedOver() {
        return Item && Item?.HandedOverEmail?.trim().length > 0
    }

    function handedOverTo(email: string) {
        if (!hasHandedOver()) return false
        return Item.HandedOverEmail.trim() == email.trim()
    }

    return (<PopupScreen show={show} >
        <div className="mda-item-details-cont">
            <div className="header">
                <div className="back-btn" onClick={onClose} >
                    <div className="icon-cont">
                        <div className="icon"></div>
                    </div>
                </div>

                <div className="title">{type} Item</div>

                <div className="close-btn" onClick={onClose} >
                    <div className="icon-cont">
                        <div className="icon"></div>
                    </div>
                </div>
            </div>

            <div className="content">
                <div className="image-cont">
                    <img src={getImageUrl(Item?.ImageUrl)} alt="" />
                </div>

                <div className="desc">
                    <div className="description">{Item?.Description}</div>

                    <div className="tags">
                        {Item && Item?.Features.map((t: string, key: number) => {
                            return (<div className="tag" key={key} >{t}</div>)
                        })}
                    </div>

                </div>

                <div className="time-loc">
                    <div className="time">
                        <div className="icon-cont">
                            <div className="icon"></div>
                        </div>
                        <div className="text">{Item?.Created}</div>
                    </div>
                    <div className="location">
                        <div className="icon-cont">
                            <div className="icon"></div>
                        </div>
                        <div className="text">{getLocationName(Item, type)}</div>
                    </div>

                </div>

                <div className="details">
                    {
                        locDetails && locDetails.lat.trim().length > 0 && locDetails.long.trim().length > 0 &&
                        <div className="map-preview">
                            <div className="btn floating-btn"> {type == "lost" ? "Last" : "Current"}  Location</div>

                            {mapLoading && <div className="loading">Loading...</div>}

                            <MapComponent
                                mapUrl="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                markers={[]}
                                onMarkerClick={() => { }}
                                center={{
                                    position: {
                                        latitude: parseFloat(locDetails.lat),
                                        longitude: parseFloat(locDetails.long),
                                        data: locDetails.name.trim().length > 0 ? locDetails.name : ""
                                    },
                                    renderMarker: true
                                }}
                                zoom={8}
                            />

                        </div>
                    }
                    <div className="info-panel">
                        {
                            type == "lost" ?
                                <>
                                    <div className="section user">
                                        <div className="icon"></div>
                                        <div className="det">
                                            <div className="label">Reported By</div>
                                            <div className="name">{Item?.Name}</div>
                                        </div>
                                    </div>
                                    <div className="section email">
                                        <div className="icon"></div>
                                        <div className="det">
                                            <div className="label">email address</div>
                                            <div className="name">{Item?.Email}</div>
                                        </div>
                                    </div>
                                    <div className="section phone">
                                        <div className="icon"></div>
                                        <div className="det">
                                            <div className="label">mobile number</div>
                                            <div className="name">{Item?.Phone}</div>
                                        </div>
                                    </div>
                                </>
                                :
                                <>
                                    <div className="section driver">
                                        <div className="icon"></div>
                                        <div className="det">
                                            <div className="label">Reported By</div>
                                            <div className="name">{Item?.Name}</div>
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
                                            <div className="name">{Item?.Phone}</div>
                                        </div>
                                    </div>
                                </>
                        }



                    </div>
                </div>


                <div className="qr-code-cont">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${Item?._id}`} alt="" />
                </div>

                <div className="claim-details">
                    {Item?.claimed?.length > 0 &&
                        <div className="claim">
                            <><span className="count">{Item.claimed.length}</span> person(s) has claimed</>
                        </div>
                    }

                    <div className="claimed-users">
                        {Item?.claimed?.map((user: string, key: number) => {
                            return (<div className={classNames("user", { "active": handedOverTo(user) })} key={key}>
                                <div className="icon-cont">
                                    <div className="icon"></div>
                                </div>

                                <div className="email">{user} </div>
                            </div>)
                        })}
                    </div>

                    {hasHandedOver() &&
                        <div className="handed-over">
                            <div className="btn">Handed Over</div>
                        </div>
                    }

                    {
                        hasHandedOver() &&

                        <div className="handed-over-details">
                            <div className="email">
                                <div className="icon-cont">
                                    <div className="icon"></div>
                                </div>
                                <div className="text">{Item.HandedOverEmail}</div>
                            </div>

                            {Item?.HandedOverCardDetails?.map((c: IHandedOverCard, key: number) => {
                                return (<div className="id-card" key={key}>
                                    <div className="icon-cont">
                                        <div className="icon"></div>
                                    </div>
                                    <div className="text">{c.CardNumber}</div>
                                </div>)
                            })}


                            <div className="time">
                                <div className="icon-cont">
                                    <div className="icon"></div>
                                </div>
                                <div className="text">{Item?.HandedOverTime}</div>
                            </div>


                            <div className="photo">
                                <img src={getImageUrl(Item.HandedOverToImageUrl)} alt="" />
                            </div>

                        </div>
                    }
                </div>
                {type != "lost" && Item && !hasHandedOver() &&
                    <div className="claim-btn">
                        <button className="btn" onClick={() => setShowHelp(true)} >Handover</button>
                    </div>
                }

            </div>
        </div>

        <Handover
            show={showHelp}
            onClose={() => setShowHelp(false)}
            claimed={item?.claimed ? item.claimed : []}
            itemId={item?._id}
        />

    </PopupScreen>)
}

export default ItemDetails