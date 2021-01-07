import * as React from 'react'
import MapComponent from './map/MapComponent'

interface IDashboardProps {
}

const Dashboard: React.FunctionComponent<IDashboardProps> = (props) => {

    // props 

    // states

    return (<div className="mda-police-dashboard">

        <div className="header">
            <div className="greeting">Assalamu alaikum</div>
            <div className="user">Ahamed Salem</div>

            <div className="menu-toggle-btn">
                <div className="icon-cont">
                    <div className="icon"></div>
                </div>
            </div>

        </div>

        <div className="content">

            <div className="title">quick actions</div>
            <div className="quick-actions">
                <div className="quick-action-thumbnail-cont">
                    <div className="quick-action-thumbnail tag-item">
                        <div className="top"></div>
                        <div className="bottom">
                            <div className="label">
                                <div className="icon-cont">
                                    <div className="icon"></div>
                                </div>

                                <div className="title">
                                    <span className="small">tag and</span> <br />
                                    <span className="large">Bag Items</span>
                                </div>
                            </div>
                            <div className="actions">
                                <button className="btn scan">scan qr</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="quick-action-thumbnail-cont">
                    <div className="quick-action-thumbnail covid-violation">
                        <div className="header">
                            <div className="icon-cont">
                                <div className="icon"></div>
                            </div>
                        </div>
                        <div className="content">
                            <span> covid violation</span>
                            <div className="large">375 VLS</div>
                            <span>  white toyota innova</span>
                        </div>

                        <div className="actions">
                            <button className="btn notify-patrol">Notify patrol</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="last-reported-item">
                <div className="map-preview">
                    <MapComponent
                        mapUrl="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        markers={[]}
                        onMarkerClick={() => { }}
                        center={{
                            position: {
                                latitude: 24.489442968268726,
                                longitude: 39.57909483821001
                        },
                            renderMarker: true
                        }}
                        zoom={12}
                    />
                </div>
                <div className="ino-panel">
                    <div className="header">
                        <div className="icon-cont">
                            <div className="icon"></div>
                        </div>
                    </div>
                    <div className="content">
                        <div className="">last reported item</div>
                        <div className="large">Season star hotel</div>
                        <div className="">at al-masjid an-nabawi</div>

                    </div>
                    <div className="actions">
                        <button className="btn view-report">view report</button>
                    </div>
                </div>
            </div>

        </div>

        <div className="footer">
            <div className="icon home">
                <div className="icon-cont">
                    <div className="icon"></div>
                </div>
            </div>
            <div className="icon list">
                <div className="icon-cont">
                    <div className="icon"></div>
                </div>
            </div>
            <div className="icon notifications">
                <div className="icon-cont">
                    <div className="icon"></div>
                </div>
            </div>
            <div className="icon menu">
                <div className="icon-cont">
                    <div className="icon"></div>
                </div>
            </div>
        </div>

    </div>)
}

export default Dashboard