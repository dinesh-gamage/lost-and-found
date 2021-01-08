
import axios, { AxiosRequestConfig } from 'axios'
import classNames = require('classnames')
import * as React from 'react'
import { config } from 'react-transition-group'
import { DashboardContext } from './DashboardContext'
import ImageUploader from './image-uploader/ImageUploader'
import PopupScreen from './PopUpScreen'

interface ILostItemReportProps {
    show: boolean,
    onClose: () => void
}

const LostItemReport: React.FunctionComponent<ILostItemReportProps> = (props) => {

    const Context = React.useContext(DashboardContext)

    let { show, onClose } = props

    let [lostItem, setLostItem] = React.useState<ILostAndFoundItem>({
        _id: null,
        Name: "",
        Phone: "",
        Email: "",
        Title: "",
        Description: "",
        Features: "",
        ImageUrl: "",
        LastLocation: "",
        Status: "New",
        Created: ""
    })
    let [saving, setSaving] = React.useState<boolean>(false)
    let [newFeature, setNewFeature] = React.useState<string>("")

    function updateObj(key: string, value: string) {
        setLostItem(prev => ({ ...prev, ...{ [key]: value } }))
    }

    function updateImageDetails(data: UploadResponse) {
        updateObj("ImageUrl", data.ImageUrl)
        let features = data.Features.labels.join(",")
        console.log("features", features)
        updateObj("Features", features)
    }

    function addFeature(f: string) {
        if (f.trim().length > 0) {
            let features = lostItem.Features.split(",")
            if (features.find((i: string) => i == f.trim())) {
                // already added
                setNewFeature("")
                return
            }
            features.push(f)
            updateObj("Features", features.join(","))
            setNewFeature("")
        }
    }

    function removeFeature(f: string) {
        let features = [...lostItem.Features.split(",")].filter((i: string) => i != f.trim())
        updateObj("Features", features.join(","))
    }

    function saveLostItem() {
        setSaving(true)
        let _url = Context.baseUrl + "Lucy/LostItem/create"

        let config: AxiosRequestConfig = {
            headers: {
                "Authorization": `APIKEY ${Context.apiKey}`
            }
        }

        let data = {
            Title: lostItem.Title,
            Name: lostItem.Name,
            Email: lostItem.Email,
            Phone: lostItem.Phone,
            Description: lostItem.Description,
            Status: lostItem.Status,
            ImageUrl: lostItem.ImageUrl,
            Features: lostItem.Features.split(","),
            LastLocation: lostItem.LastLocation
        }

        axios.post(_url, data, config)
            .then((res) => {
                console.log("res ", res)

                onClose()
                setSaving(false)
            })
            .catch((e) => {
                console.log("Exception : ", e)
                setSaving(false)
            })
    }

    return (<PopupScreen show={show}>
        <div className="mda-search-panel-cont">
            <div className="header">
                <div className="back-btn" onClick={onClose} >
                    <div className="icon-cont">
                        <div className="icon"></div>
                    </div>
                </div>

                <div className="title">New Report</div>

                <div className="close-btn" onClick={onClose} >
                    <div className="icon-cont">
                        <div className="icon"></div>
                    </div>
                </div>
            </div>

            <div className="form-content">
                <div className="section">
                    <div className="label">Title</div>
                    <Input type="text"
                        value={lostItem.Title}
                        onChange={(s) => updateObj("Title", s)}
                        placeholder="Ex: a black backpack"
                        active={lostItem.Title.trim().length > 0}
                    />
                </div>
                <div className="section">
                    <div className="label">Description</div>
                    <Input type="text"
                        value={lostItem.Description}
                        onChange={(s) => updateObj("Description", s)}
                        placeholder='Ex: A black color backpack with a pokemon key tag'
                        active={lostItem.Description.trim().length > 0}
                    />
                </div>
                <div className="section">
                    <div className="label">Image</div>
                    <ImageUploader
                        defaultImage=""
                        afterUpload={updateImageDetails}
                        pathToUpload="lost"
                    />
                </div>

                <div className="section">
                    <div className="label">Features</div>
                    <div className="input-group">
                        <Input type="text"
                            value={newFeature}
                            onChange={setNewFeature}
                            placeholder='Ex: black bag'
                            active={newFeature.trim().length > 0}
                        />
                        <div className={classNames("add-icon", { "filled": newFeature.trim().length > 0 })}
                            onClick={() => addFeature(newFeature)}
                        >
                            <div className="icon"></div>
                        </div>
                    </div>

                    <div className="tags">
                        {
                            [...lostItem.Features.split(",")].map((t: string, key: number) => {
                                if (t.trim().length > 0) {
                                    return (<div className="tag" key={key}>
                                        <span>{t}</span>
                                        <div className="remove-btn" onClick={() => removeFeature(t)}>
                                            <div className="icon-cont">
                                                <div className="icon"></div>
                                            </div>
                                        </div>
                                    </div>)
                                }

                            })
                        }
                    </div>
                </div>

                <div className="section">
                    <div className="label">Name</div>
                    <Input type="text"
                        value={lostItem.Name}
                        onChange={(s) => updateObj("Name", s)}
                        placeholder="Ex: Hida Mohammad"
                        active={lostItem.Name.trim().length > 0}
                    />
                </div>
                <div className="section">
                    <div className="label">Contact Number</div>
                    <Input type="text"
                        value={lostItem.Phone}
                        onChange={(s) => updateObj("Phone", s)}
                        placeholder="Ex : +961 345 123 523"
                        active={lostItem.Phone.trim().length > 0}
                    />
                </div>
                <div className="section">
                    <div className="label">Email</div>
                    <Input type="text"
                        value={lostItem.Email}
                        onChange={(s) => updateObj("Email", s)}
                        placeholder="Ex : hida@ecyber.com"
                        active={lostItem.Email.trim().length > 0}
                    />
                </div>
                <div className="section">
                    <div className="label">Location</div>
                    <Input type="text"
                        value={lostItem.LastLocation}
                        onChange={(s) => updateObj("LastLocation", s)}
                        placeholder="Ex: Al-Masjid n-Nabawi"
                        active={lostItem.LastLocation.trim().length > 0}
                    />
                </div>
                <div className="section actions">
                    <button className={classNames("btn save-lost-item", { "saving": saving })}
                        onClick={saveLostItem}
                        disabled={saving}
                    >
                        {saving ? "Submitting..." : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    </PopupScreen>)
}

interface IInputProps {
    type: string,
    value: string,
    onChange: (val: string) => void
    placeholder?: string,
    active?: boolean
}
const Input: React.FunctionComponent<IInputProps> = (props) => {
    return <input type={props.type}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        className={classNames({ "active": props.active })}
    />
}

export default LostItemReport