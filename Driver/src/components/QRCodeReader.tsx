import classNames = require('classnames')
import * as React from 'react'
import * as QrReader from 'react-qr-reader'
import PopupScreen from './PopUpScreen'

interface IQRCodeReaderProps {
    onChange: (id: string) => void
}

const QRCodeReader: React.FunctionComponent<IQRCodeReaderProps> = (props) => {

    let [scan, setScan] = React.useState<boolean>(false)
    let [data, setData] = React.useState<string>("")

    React.useEffect(() => {
        props.onChange(data)
    }, [data])

    return (<div className={classNames("mda-take-photo-cont", { "active": data.trim().length > 0 })} >

        <div className="preview qr-scanner" onClick={() => { setScan(true) }}>
            {
                data.trim().length > 0 ?
                    <div className="success">
                        <div className="icon-cont">
                            <div className="icon"></div>
                        </div>
                        <button className="btn">Scan again</button>
                    </div>
                    :
                    <div className={classNames("default-message")}>
                        <div className="icon-cont">
                            <div className="icon"></div>
                        </div>
                        <div className="message">Scan QR on bag</div>
                    </div>
            }
        </div>

        <QRCodeScanner show={scan} onClose={() => setScan(false)} onChange={setData} />

    </div>)
}

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
                    delay={0}
                    onError={handleError}
                    onScan={handleScan}
                    style={{ width: '60%' }}
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

export default QRCodeReader