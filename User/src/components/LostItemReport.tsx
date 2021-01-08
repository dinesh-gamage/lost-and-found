
import axios, { AxiosRequestConfig } from 'axios'
import classNames = require('classnames')
import * as React from 'react'
import { DashboardContext } from './DashboardContext'
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
        Status: "",
        Created: ""
    })
    let [saving, setSaving] = React.useState<boolean>(false)

    function updateObj(key: string, value: string) {
        setLostItem(prev => ({ ...prev, ...{ [key]: value } }))
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
                    />
                </div>
                <div className="section">
                    <div className="label">Description</div>
                    <Input type="text"
                        value={lostItem.Description}
                        onChange={(s) => updateObj("Description", s)}
                        placeholder='Ex: A black color backpack with a pokemon key tag'
                    />
                </div>
                <div className="section">
                    <div className="label">Image</div>
                    
                </div>
                <div className="section">
                    <div className="label">Nme</div>
                    <Input type="text"
                        value={lostItem.Name}
                        onChange={(s) => updateObj("Name", s)}
                        placeholder="Ex: Hida Mohammad"
                    />
                </div>
                <div className="section">
                    <div className="label">Contact Number</div>
                    <Input type="text"
                        value={lostItem.Phone}
                        onChange={(s) => updateObj("Phone", s)}
                        placeholder="Ex : +961 345 123 523"
                    />
                </div>
                <div className="section">
                    <div className="label">Location</div>
                    <Input type="text"
                        value={lostItem.LastLocation}
                        onChange={(s) => updateObj("LastLocation", s)}
                        placeholder="Ex: Al-Masjid n-Nabawi"
                    />
                </div>
                <div className="section actions">
                    <button className={classNames("btn save-lost-item", {"saving": saving})}
                    onClick={() => setSaving(!saving)}
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
    placeholder?: string
}
const Input: React.FunctionComponent<IInputProps> = (props) => {
    return <input type={props.type}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
    />
}

export default LostItemReport