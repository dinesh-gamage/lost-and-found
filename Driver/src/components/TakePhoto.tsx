import axios, { AxiosRequestConfig } from 'axios'
import classNames = require('classnames')
import * as React from 'react'
import CameraComponent from './CameraComponent'
import { DashboardContext } from './DashboardContext'
import { useToast } from './Toast'

interface ITakePhotoProps {
    onChange: (ImageUrl: string, Features: string[]) => void
}

const TakePhoto: React.FunctionComponent<ITakePhotoProps> = (props) => {

    const Context = React.useContext(DashboardContext)

    let [takePhoto, setTakePhoto] = React.useState<boolean>(false)
    let [dataUri, setDataUri] = React.useState<string>("")
    let [processing, setProcessing] = React.useState<boolean>(false)
    let [uploadRes, setUploadRes] = React.useState<UploadResponse>({
        ImageUrl: "",
        Features: {
            labels: [],
            colors: []
        }
    })

    let Toast = useToast()

    React.useEffect(() => {
        console.log("props changed", props)
    }, [props])

    React.useEffect(() => {
        console.log("state", takePhoto)
    }, [takePhoto])

    React.useEffect(() => {
        onClickUpload(dataUri)
    }, [dataUri])

    React.useEffect(() => {
        props.onChange(uploadRes.ImageUrl, uploadRes.Features.labels)
    }, [uploadRes])

    function dataURLtoFile(base64: string, filename: string) {
        if (base64.trim().length > 0) {
            var arr = base64.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, { type: mime });
        }
        return null
    }

    const onClickUpload = (base64: string) => {
        if (base64.trim().length > 0) {
            if (!processing) {
                let file = dataURLtoFile(base64, "a.png")

                if (file) {
                    setProcessing(true)

                    let url: string = Context.baseUrl + "Lucy/FoundItem/uploadimage"

                    let uploadContent: FormData = new FormData()
                    uploadContent.append("File", file)

                    let config: AxiosRequestConfig = {
                        headers: {
                            "Authorization": `APIKEY ${Context.apiKey}`
                        }
                    }

                    axios.post(url, uploadContent, config)
                        .then(res => {
                            console.log("upload response ", res)
                            setProcessing(false)
                            setUploadRes(res.data)
                            Toast.success("Image Uploaded!")
                        })
                        .catch(e => {
                            console.log("Except : ", e)
                            setProcessing(false)
                            Toast.error("Something Went wrong")
                        })

                }
                else {
                    setProcessing(false)
                    Toast.error("Please select an image to upload")
                }
            }
        }
    }

    return (<div className={classNames("mda-take-photo-cont", { "active": dataUri.trim().length > 0 })} >

        <div className="preview" onClick={() => { setTakePhoto(true); console.log("clicked") }}>
            {
                dataUri && dataUri.trim().length > 0 ?
                    <>
                        <img src={dataUri} alt="" className="preview-image" />

                        <div className="features-panel">
                            <div className="title">Experience image AI found some matching terms</div>
                            {processing && <div className="processing">Image is being uploaded....</div>}
                            <div className="tags">
                                {
                                    uploadRes.Features.labels.map((t: string, key: number) => {
                                        return (<div className="tag" key={key}>{t}</div>)
                                    })
                                }
                            </div>
                        </div>
                    </>
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