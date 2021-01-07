import classNames = require('classnames')
import * as React from 'react'

interface IORCodeScanProps {
    show: boolean,
    onClose: () => void
}

const QRCodeScanPanel: React.FunctionComponent<IORCodeScanProps> = (props) => {

    //props
    let { show, onClose } = props

    // state

    return (<div className={classNames("mda-popup-screen", { "show": show })}>
        <div className="mda-scan-panel-cont">
            <div className="header">
                <div className="close-btn" onClick={onClose}>
                    <div className="icon-cont">
                        <div className="icon"></div>
                    </div>
                </div>
            </div>

            <div className="content">
                <div className="qr-code-icon-cont">
                    <div className="icon"></div>
                </div>
                <div className="scan-box-cont">
                    <div className="text">scan QR to add item</div>
                    <button className="btn">Scan</button>
                </div>
            </div>
        </div>
    </div>)
}

export default QRCodeScanPanel