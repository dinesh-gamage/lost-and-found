
import axios, { AxiosRequestConfig } from 'axios'
import classNames = require('classnames')
import * as React from 'react'
import { DashboardContext } from './DashboardContext'
import ItemsList from './LostClaimedList'
import PopupScreen from './PopUpScreen'

interface IItemListComponentProps {
    show: boolean,
    onClose: () => void
}

const LostClaimedItemListComponent: React.FunctionComponent<IItemListComponentProps> = (props) => {

    const Context = React.useContext(DashboardContext)

    let { show, onClose } = props

    return (<PopupScreen show={show}>
        <div className="mda-search-panel-cont item-list-component">
            <div className="header">
                <div className="back-btn" onClick={onClose} >
                    <div className="icon-cont">
                        <div className="icon"></div>
                    </div>
                </div>

                <div className="title">
                    <div className="icon-cont">
                        <div className="icon"></div>
                    </div>
                    <span>Lost and Claimed</span>
                </div>

                <div className="close-btn" onClick={onClose} >
                    <div className="icon-cont">
                        <div className="icon"></div>
                    </div>
                </div>
            </div>

            <div className="body">
                <ItemsList />
            </div>
        </div>
    </PopupScreen>)
}

export default LostClaimedItemListComponent