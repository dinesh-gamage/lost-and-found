import * as React from 'react'
import PopupScreen from './PopUpScreen'

interface IQRCodePreview {
    show: boolean,
    onClose: () => void,
    itemId: string
}
const QRCodePreview: React.FunctionComponent<IQRCodePreview> = (props) => {
    let { show, onClose, itemId } = props

    return (<PopupScreen show={show}>
        <div className="mda-search-panel-cont qr-code-preview">
            <div className="header">
                <div className="back-btn" onClick={onClose} >
                    <div className="icon-cont">
                        <div className="icon"></div>
                    </div>
                </div>

                <div className="title">QR Code</div>

                <div className="close-btn" onClick={onClose} >
                    <div className="icon-cont">
                        <div className="icon"></div>
                    </div>
                </div>
            </div>

            <div className="content">
                <div className="title">Item Registered!</div>
                <div className="sub-title">
                    Please download or print this QR Code <br />
                    show this at the police station
                </div>
                <div className="qr-code-cont">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${itemId}`} alt="" />
                </div>

                <div className="btn-cont" onClick={onClose}>
                    <div className="btn">Done</div>
                </div>
            </div>

        </div>
    </PopupScreen>)
}

export default QRCodePreview