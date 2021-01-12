import classNames = require('classnames')
import * as React from 'react'
import * as QrReader from 'react-qr-reader'
import PopupScreen from './PopupScreen'

interface IQRScannerProps {
    show: boolean,
    onClose: () => void,
    onChange: (id: string) => void
}
type camMode = "env" | "user"

const QRCodeScanner: React.FunctionComponent<IQRScannerProps> = (props) => {

    let { show, onClose, onChange } = props

    let [mode, setMode] = React.useState<camMode>("env")

    function handleScan(data: any) {

        if (data) {
            onChange(data)
            onClose()
        }
    }
    function handleError(err: any) {
        console.error(err)
    }

    function changeMode() {
        let _mode: camMode = mode == "env" ? "user" : "env"
        setMode(_mode)
    }
    return (<PopupScreen show={show}>
        <div className="mda-camera-cont ">

            <div className="camera-cont qr-scanner">

                <QrReader
                    delay={300}
                    onError={handleError}
                    onScan={handleScan}
                    style={{ width: '100%' }}
                    facingMode={mode == "env" ? "environment" : "user"}
                />
            </div>

            <div className="button-cont">

                <button className={classNames("btn close")} onClick={onClose} ></button>
                <button className={classNames("btn change")} onClick={changeMode} ></button>

            </div>
        </div>
    </PopupScreen>)
}

export default QRCodeScanner