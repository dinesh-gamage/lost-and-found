import classNames = require('classnames')
import * as React from 'react'
import PopupScreen from './PopUpScreen'

interface ICameraProps {
    show: boolean
    onClose: () => void,
    onCapture: (base64: string) => void
}

type camMode = "env" | "user"
const CameraComponent: React.FunctionComponent<ICameraProps> = (props) => {

    let { show, onCapture, onClose } = props

    let [dataUri, setDataUri] = React.useState<string>(null)
    let [mode, setMode] = React.useState<camMode>("env")

    let videoElement = React.useRef(null)
    let canvasElement = React.useRef(null)
    let streamRef = React.useRef(null)
    let cancelButton = React.useRef(null)

    React.useEffect(() => {
    }, [props])

    React.useEffect(() => {
        if (show) startVideo("user")
        setDataUri(null)
    }, [show])


    function startVideo(_mode: camMode) {

        console.log("mode ", _mode)
        let config: MediaStreamConstraints = {
            audio: false,
            video: {
                facingMode: _mode == "env" ? "environment" : "user"
            }
        }
        navigator.mediaDevices
            .getUserMedia(config)
            .then(stream => {

                streamRef.current = stream
                videoElement.current.srcObject = stream

            })
            .catch(e => console.error(e));
    }

    function stopVideo() {
        if (streamRef) {
            streamRef.current.getTracks().forEach((track: MediaStreamTrack) => {
                track.stop();
            })
        }
    }

    function closeCameraView() {
        onClose()
    }

    function onClickClose() {
        stopVideo()
        closeCameraView()
    }

    function captureSnap() {
        let _videoElement: HTMLVideoElement = videoElement.current;
        let _canvasElement: HTMLCanvasElement = canvasElement.current
        let context = _canvasElement.getContext("2d");

        console.log(_videoElement.videoWidth)
        console.log(_videoElement.width)
        _canvasElement.width = _videoElement.videoWidth;
        _canvasElement.height = _videoElement.videoHeight;

        context.drawImage(_videoElement, 0, 0, _canvasElement.width, _canvasElement.height);
        let snapBase64 = _canvasElement.toDataURL();
        setDataUri(snapBase64)
    }

    function savePhoto() {
        onCapture(dataUri)
        stopVideo()
        onClose()
    }

    function retake() {
        setDataUri(null)
    }

    function changeMode() {
        let _mode:camMode = mode == "env" ? "user" : "env"
        setMode(_mode)
        stopVideo()
        startVideo(_mode)
    }

    return (<PopupScreen show={show} >
        <div className="mda-camera-cont">

            <div className="camera-cont">
                {/* <div className="floating-btn">
                    <div className="back-btn" onClick={closeCameraView} ref={cancelButton} >
                        <div className="icon-cont">
                            <div className="icon"></div>
                        </div>
                    </div>
                </div> */}

                <video ref={videoElement}
                    width="100%" height="100%" muted autoPlay
                    className={classNames("videoElement", { "hide": dataUri != null })}
                >loading...</video>

                <canvas id="canvasElement"
                    className={classNames("canvasElement")}
                    ref={canvasElement}
                ></canvas>

                <img src={dataUri} alt="" className={classNames("preview", { "hide": dataUri == null })} />
            </div>

            <div className="button-cont">
                <button className={classNames("btn re-take", { "hide": dataUri == null })} onClick={retake} ></button>
                <button className={classNames("btn save", { "hide": dataUri == null })} onClick={savePhoto} ></button>

                <button className={classNames("btn close", { "hide": dataUri != null })} onClick={onClickClose} ref={cancelButton}  ></button>
                <button className={classNames("btn capture", { "hide": dataUri != null })} onClick={captureSnap} ></button>
                <button className={classNames("btn change", { "hide": dataUri != null })} onClick={changeMode} ></button>

            </div>
        </div>
    </PopupScreen>)
}

export default CameraComponent