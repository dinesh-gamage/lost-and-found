
import axios, { AxiosRequestConfig } from 'axios'
import classNames = require('classnames')
import * as React from 'react'
import { DashboardContext } from './DashboardContext'
import PopupScreen from './PopUpScreen'

interface IFoundItemReportProps {
    show: boolean,
    onClose: () => void
}

const FoundItemReport: React.FunctionComponent<IFoundItemReportProps> = (props) => {

    const Context = React.useContext(DashboardContext)

    let { show, onClose } = props

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

                </div>
                <div className="scan-qr"></div>

            </div>
        </div>
    </PopupScreen>)
}

export default FoundItemReport