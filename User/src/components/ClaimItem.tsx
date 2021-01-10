import axios, { AxiosRequestConfig } from 'axios'
import * as React from 'react'
import { DashboardContext } from './DashboardContext'
import PopupScreen from './PopUpScreen'
import { useToast } from './Toast'

interface IClaimItemProps {
    show: boolean,
    onClose: () => void,
    itemId: string
}

const ClaimItem: React.FunctionComponent<IClaimItemProps> = (props) => {

    const Context = React.useContext(DashboardContext)

    let { show, onClose, itemId } = props

    let [claimed, setClaimed] = React.useState(false)
    let [claiming, setClaiming] = React.useState(false)
    let [email, setEmail] = React.useState("")

    let Toast = useToast();


    function onClaim() {
        // validate
        if (email.trim().length == 0) {
            Toast.error("Email is required")
            return
        }

        if (!claiming) {
            setClaiming(true)

            let _url = Context.baseUrl + "Lucy/FoundItem/claim/" + itemId

            let config: AxiosRequestConfig = {
                headers: {
                    "Authorization": `APIKEY ${Context.apiKey}`
                }
            }

            let data = {
                Email: email
            }

            axios.post(_url, data, config)
                .then((res) => {
                    Toast.success("Item claimed")
                    setClaiming(false)
                    setClaimed(true)
                })
                .catch((e) => {
                    console.log("Exception : ", e)
                    setClaiming(false)
                    Toast.error("Something went wrong")
                })
        }
    }

    return (<PopupScreen show={show}>
        <div className="mda-search-panel-cont claim">
            <div className="header">
                <div className="back-btn" onClick={onClose} >
                    <div className="icon-cont">
                        <div className="icon"></div>
                    </div>
                </div>

                <div className="title">Claim Item</div>

                <div className="close-btn" onClick={onClose} >
                    <div className="icon-cont">
                        <div className="icon"></div>
                    </div>
                </div>
            </div>
            <div className="claim-item">
                {claimed ?
                    <>
                        <div className="title">Please Visit</div>
                        <div className="text"> Al Khalidiya police station with your ID proof and our officers will help you further </div>
                        <div className="btn-cont">
                                <button className="btn" onClick={onClose} >Done</button>
                            </div>
                    </>
                    :
                    <>
                        <div className="search-box-cont">

                            <div className="title">Enter your email here</div>

                            <input type="text" placeholder="Start typing..."
                                value={email}
                                onChange={(e) => { setEmail(e.target.value) }}
                                autoFocus
                            />
                            <div className="btn-cont">
                                <button className="btn" onClick={onClaim} >{claiming ? "Claiming" : "Claim"}</button>
                            </div>
                        </div>
                    </>
                }


            </div>
        </div>
    </PopupScreen>)
}

export default ClaimItem