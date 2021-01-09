import classNames = require('classnames')
import * as React from 'react'
import CameraComponent from './CameraComponent'

interface ITakePhotoProps {
    image: string
}

const TakePhoto: React.FunctionComponent<ITakePhotoProps> = (props) => {
    let { image } = props

    let [takePhoto, setTakePhoto] = React.useState<boolean>(false)

    return (<div className="mda-take-photo-cont" onClick={() => setTakePhoto(true)}>

        <div className="preview">
            {
                image && image.trim().length > 0 ?
                    <img src={image} alt="" className="preview-image" />
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
            onCapture={() => { }}
            onClose={() => setTakePhoto(false)}
        />

    </div>)
}

export default TakePhoto