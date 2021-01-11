import classNames = require('classnames')
import * as React from 'react'
import { getFoundLocationDetails, getFoundLocationName, getImageUrl } from '../utils'
import ClaimItem from './ClaimItem'
import MapComponent from './map/MapComponent'
import PopupScreen from './PopUpScreen'

interface IItemDetailsProps {
    item: ILostAndFoundItem,
    show: boolean,
    onClose: () => void
}

const ItemDetails: React.FunctionComponent<IItemDetailsProps> = (props) => {
    let { item, show, onClose } = props

    let [showHelp, setShowHelp] = React.useState<boolean>(false)


    // get location details
    let locDetails = getFoundLocationDetails(item)

    return (<PopupScreen show={show} >
        <div className="mda-item-details-cont">
            <div className="header">
                <div className="back-btn" onClick={onClose} >
                    <div className="icon-cont">
                        <div className="icon"></div>
                    </div>
                </div>

                <div className="title">{item?.Title || "Found Item"}</div>

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
                        <div className="text">{getFoundLocationName(item)}</div>
                    </div>

                </div>

                <div className="details">
                    {
                        locDetails && locDetails.lat.trim().length > 0 && locDetails.long.trim().length > 0 &&
                        <div className="map-preview">
                            <div className="btn floating-btn">Found Location</div>

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


                <div className="claim-details">
                    {item?.claimed?.length > 0 &&
                        <div className="claim">
                            <span className="count">{item.claimed.length}</span> people has claimed
                        </div>
                    }

                    {item?.HandedOverEmail?.trim().length > 0 &&
                        <div className="handed-over">
                            <div className="btn">Handed Over</div>
                        </div>
                    }
                </div>
                {item  && (!item.HandedOverEmail || item.HandedOverEmail.trim().length == 0) &&
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