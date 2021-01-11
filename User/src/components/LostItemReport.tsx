
import axios, { AxiosRequestConfig } from 'axios'
import classNames = require('classnames')
import * as React from 'react'
import { config } from 'react-transition-group'
import { getDetailsFromLocalStorage } from '../utils'
import { DashboardContext } from './DashboardContext'
import ImageUploader from './image-uploader/ImageUploader'
import PopupScreen from './PopUpScreen'
import { useToast } from './Toast'

interface ILostItemReportProps {
    show: boolean,
    onClose: () => void
}

const LostItemReport: React.FunctionComponent<ILostItemReportProps> = (props) => {

    const Context = React.useContext(DashboardContext)

    let { show, onClose } = props

    let [lostItem, setLostItem] = React.useState<ILostAndFoundItem>({
        _id: null,
        Name: getDetailsFromLocalStorage("name"),
        Phone: getDetailsFromLocalStorage("phone"),
        Email: getDetailsFromLocalStorage("email"),
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
    let [userLocationData, setUserLocationData] = React.useState<IUserLocationData>({
        lat: "",
        long: "",
        name: ""
    })

    let Toast = useToast();

    React.useEffect(() => {
        // get from local storage
        setTimeout(() => {

        }, 500);

    }, [])

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

        // validate
        if (lostItem.Name.trim().length == 0) {
            Toast.error("Name is required")
            return
        }
        if (lostItem.Email.trim().length == 0) {
            Toast.error("Email is required")
            return
        }
        if (lostItem.Phone.trim().length == 0) {
            Toast.error("Phone is required")
            return
        }
        if (lostItem.Description.trim().length == 0) {
            Toast.error("Description is required")
            return
        }
        if (lostItem.LastLocation.trim().length == 0) {
            Toast.error("Last Location is required")
            return
        }

        if (!saving) {
            setSaving(true)

            let _url = Context.baseUrl + "Lucy/LostItem/create"

            let config: AxiosRequestConfig = {
                headers: {
                    "Authorization": `APIKEY ${Context.apiKey}`
                }
            }

            let locationDetails = { ...userLocationData }
            locationDetails.name = lostItem.LastLocation

            let data = {
                Title: lostItem.Title,
                Name: lostItem.Name,
                Email: lostItem.Email,
                Phone: lostItem.Phone,
                Description: lostItem.Description,
                Status: lostItem.Status,
                ImageUrl: lostItem.ImageUrl,
                Features: lostItem.Features.split(","),
                LastLocation: JSON.stringify(locationDetails)
            }

            axios.post(_url, data, config)
                .then((res) => {

                    localStorage.setItem("mda-guest-user", JSON.stringify({
                        email: lostItem.Email,
                        name: lostItem.Name,
                        phone: lostItem.Phone
                    }))

                    onClose()
                    Toast.success("Item Registered")
                    setSaving(false)
                })
                .catch((e) => {
                    console.log("Exception : ", e)
                    setSaving(false)
                    Toast.error("Something went wrong")
                })
        }
    }

    function randomGeo(center: { latitude: number, longitude: number }, radius: number) {
        var y0 = center.latitude;
        var x0 = center.longitude;
        var rd = radius / 111300; //about 111300 meters in one degree

        var u = Math.random();
        var v = Math.random();

        var w = rd * Math.sqrt(u);
        var t = 2 * Math.PI * v;
        var x = w * Math.cos(t);
        var y = w * Math.sin(t);

        //Adjust the x-coordinate for the shrinking of the east-west distances
        var xp = x / Math.cos(y0);

        var newlat = y + y0;
        var newlon = x + x0;
        var newlon2 = xp + x0;

        return {
            'latitude': newlat.toFixed(5),
            'longitude': newlon.toFixed(5)
        };
    }

    function fetchUserLocation() {

        // for demo get random location
        let randomLoc = randomGeo({ latitude: 24.489442968268726, longitude: 39.57909483821001 }, 1000)

        let lat = randomLoc.latitude
        let long = randomLoc.longitude
        let apiKey = "955e990ed9ae4fbd9b6af6041bf0fea8"

        axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=${apiKey}`)
            .then((res) => {
                console.log("res ", res)
                let address = res.data.results[0].formatted

                updateObj("LastLocation", address)
                setUserLocationData({
                    lat: lat.toString(),
                    long: long.toString(),
                    name: address
                })
            })
            .catch((e) => {
                console.log("exception ", e)
                Toast.error("Please enter last location manually")
            })

        // window.navigator.geolocation.getCurrentPosition((res) => {
        //     console.log("res ", res)
        //     let lat = res.coords.latitude
        //     let long = res.coords.longitude
        //     let apiKey = "955e990ed9ae4fbd9b6af6041bf0fea8"


        // },
        //     (err) => {
        //         console.log("err ", err)
        //         Toast.error("Please enter last location manually")
        //     })
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
                {/* <div className="section">
                    <div className="label">Title</div>
                    <Input type="text"
                        value={lostItem.Title}
                        onChange={(s) => updateObj("Title", s)}
                        placeholder="Ex: a black backpack"
                        active={lostItem.Title.trim().length > 0}
                    />
                </div> */}
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
                    <div className="label">Last Location</div>
                    <div className="input-group">
                        <Input type="text"
                            value={lostItem.LastLocation}
                            onChange={(s) => updateObj("LastLocation", s)}
                            placeholder="Ex: Al-Masjid n-Nabawi"
                            active={lostItem.LastLocation.trim().length > 0}
                        />

                        <div className={classNames("location-icon")}
                            onClick={fetchUserLocation}
                        >
                            <div className="icon"></div>
                        </div>
                    </div>
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