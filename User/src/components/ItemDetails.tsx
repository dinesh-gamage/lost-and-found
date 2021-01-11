import classNames = require('classnames')
import * as React from 'react'
import { getDetailsFromLocalStorage, getImageUrl, getLocationDetails, getLocationName } from '../utils'
import ClaimItem from './ClaimItem'
import MapComponent from './map/MapComponent'
import PopupScreen from './PopUpScreen'

interface IItemDetailsProps {
    item: ILostAndFoundItem,
    show: boolean,
    onClose: () => void,
    type: "lost" | "found" | "claimed"
}

const ItemDetails: React.FunctionComponent<IItemDetailsProps> = (props) => {
    let { item, show, onClose, type } = props

    let [showHelp, setShowHelp] = React.useState<boolean>(false)


    // get location details
    let locDetails = getLocationDetails(item, type)

    function hasHandedOver() {
        return item && item?.HandedOverEmail?.trim().length > 0
    }

    function hasClaimed() {
        return getDetailsFromLocalStorage("email").trim().length > 0 && item?.claimed?.find((i: string) => i == getDetailsFromLocalStorage("email"))
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
                    <img src={getImageUrl(item?.ImageUrl)} alt="" />
                </div>

                <div className="desc">
                    {item?.Description}
                </div>

                <div className="time-loc">
                    <div className="time">
                        <div className="icon-cont">
                            <div className="icon"></div>
                        </div>
                        <div className="text">{item?.Created}</div>
                    </div>
                    <div className="location">
                        <div className="icon-cont">
                            <div className="icon"></div>
                        </div>
                        <div className="text">{getLocationName(item, type)}</div>
                    </div>

                </div>

                <div className="details">
                    {
                        locDetails && locDetails.lat.trim().length > 0 && locDetails.long.trim().length > 0 &&
                        <div className="map-preview">
                            <div className="btn floating-btn">{type == "lost" ? "Last" : "Found"}  Location</div>

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
                                zoom={12}
                            />

                        </div>
                    }
                    <div className="info-panel">
                        <div className="section driver">
                            <div className="icon"></div>
                            <div className="det">
                                <div className="label">Reported By</div>
                                <div className="name">{item?.Name}</div>
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
                                <div className="name">{item?.Phone}</div>
                            </div>
                        </div>


                    </div>
                </div>


                <div className="qr-code-cont">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${item?._id}`} alt="" />
                </div>

                <div className="claim-details">
                    {item?.claimed?.length > 0 &&
                        <div className="claim">
                            {
                                hasClaimed()
                                    ? <> {
                                        item.claimed.length > 1 ?
                                            <>You and <span className="count">{item.claimed.length - 1}</span> other persons(s) has claimed</>
                                            : <>You have claimed this</>
                                    } </>
                                    : <><span className="count">{item.claimed.length}</span> person(s) has claimed</>

                            }
                        </div>
                    }

                    {hasHandedOver() &&
                        <div className="handed-over">
                            <div className="btn">Handed Over</div>
                        </div>
                    }
                </div>
                {item && !hasHandedOver() && !hasClaimed() &&
                    <div className="claim-btn">
                        <button className="btn" onClick={() => setShowHelp(true)} >Claim</button>
                    </div>
                }

            </div>
        </div>

        <ClaimItem show={showHelp} onClose={() => setShowHelp(false)} itemId={item?._id} />
    </PopupScreen>)
}

export default ItemDetails