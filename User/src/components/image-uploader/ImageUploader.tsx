import Axios, { AxiosRequestConfig } from 'axios';
import classNames = require('classnames');
import * as React from 'react';
import { DashboardContext } from '../DashboardContext';

import './image_uploader.scss'

interface IImageUploaderProps {
    defaultImage: string,
    afterUpload: (data: UploadResponse) => void,
    pathToUpload: string
}

const ImageUploader: React.FunctionComponent<IImageUploaderProps> = (props) => {

    const Context = React.useContext(DashboardContext)

    let { defaultImage, afterUpload, pathToUpload } = props

    let [image, setImage] = React.useState<string>("")
    let [data, setData] = React.useState<{ file: File | null, url: string }>({ file: null, url: null })
    let [processing, setProcessing] = React.useState<boolean>(false)
    let [closePanel, setClosePanel] = React.useState<boolean>(false)

    // let Toast = useToast();

    let fileInputRef = React.useRef(null)

    React.useEffect(() => {
        setImage(defaultImage)
    }, [defaultImage])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let selectedFiles = e.target.files

        let reader: FileReader = new FileReader()

        reader.onloadend = (evt) => {
            setImage(evt.target.result as string)
        }
        reader.readAsDataURL(selectedFiles[0])

        setData({ file: selectedFiles[0], url: null })
    }

    const onClickUpload = () => {

        if (data.file) {
            setProcessing(true)

            let url: string = Context.baseUrl + "Lucy/LostItem/uploadimage"

            let uploadContent: FormData = new FormData()
            uploadContent.append("File", data.file)

            let config: AxiosRequestConfig = {
                headers: {
                    "Authorization": `APIKEY ${Context.apiKey}`
                }
            }

            Axios.post(url, uploadContent, config)
                .then(res => {
                    console.log("upload response ", res)
                    setProcessing(false)
                    afterUpload(res.data);
                    // Toast.success("Uploaded! Save your changes")
                })
                .catch(e => {
                    console.log("Except : ", e)
                    setProcessing(false)
                    // Toast.error("Something Went wrong")
                })

        }
        else {
            // Toast.error("Please select a file or enter a url")
        }
    }

    return (<div className={classNames("image-uploader")} >

        <div className="uploader">
            <input type="file" name="" id="" className="file-input"
                ref={fileInputRef}
                onChange={handleFileChange}
            />
            <div className="preview">
                {
                    image && image.trim().length > 0 ?
                        <img src={image} alt="" className="preview-image" />
                        :
                        <div className={classNames("default-message")}>
                            <div className="icon-cont">
                                <div className="icon"></div>
                            </div>
                            <div className="message">Drag & Drop or Click</div>
                        </div>
                }
            </div>

        </div>

        <div className="footer">
            <div className="button"
                onClick={onClickUpload}
            >
                <div className="icon-cont">
                    <div className="icon"></div>
                </div>

                <div className="text"> {processing ? "Uploading...." : "Upload"} </div>
            </div>
        </div>

    </div>)
}

export default ImageUploader