import classNames = require('classnames')
import * as React from 'react'
import CameraComponent from './CameraComponent'

interface ITakePhotoProps {
    onChange: (base64: string) => void
}

const TakePhoto: React.FunctionComponent<ITakePhotoProps> = (props) => {

    let [takePhoto, setTakePhoto] = React.useState<boolean>(false)
    let [dataUri, setDataUri] = React.useState<string>("")

    React.useEffect(() => {
        console.log("props changed", props)
    }, [props])

    React.useEffect(() => {
        console.log("state", takePhoto)
    }, [takePhoto])

    React.useEffect(() => {
        props.onChange(dataUri)
    }, [dataUri])

    return (<div className="mda-take-photo-cont" >

        <div className="preview" onClick={() => { setTakePhoto(true); console.log("clicked") }}>
            {
                dataUri && dataUri.trim().length > 0 ?
                    <img src={dataUri} alt="" className="preview-image" />
                    :
                    <div className={classNames("default-message")}>
                        <div className="icon-cont">
                            <div className="icon"></div>
                        </div>
                        <div className="message">Upload Image</div>
                    </div>
            }
        </div>

        <CameraComponent
            show={takePhoto}
            onCapture={(d) => { setDataUri(d); }}
            onClose={() => { setTakePhoto(false) }}
        />

    </div>)
}

export default TakePhoto