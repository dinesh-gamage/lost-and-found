import * as React from 'react'
import MapComponent from './map/MapComponent'

interface IDashboardProps {
}

type IDashboardScreen = "" | "report" | "search" | "scan" | "quick-scan"

const Dashboard: React.FunctionComponent<IDashboardProps> = (props) => {

    // props 

    // states
    let [screen, setScreen] = React.useState<IDashboardScreen>("")

    function renderDashboardContent() {
        return (<div className="mda-user-dashboard">

            <div className="header">
                <div className="title">Experience <span className="dark"> Madinah</span></div>
            </div>

            <div className="content">

                <div className="title">quick actions</div>
                <div className="quick-actions">
                    <div className="quick-action-thumbnail-cont">
                        <div className="quick-action-thumbnail report">
                            <div className="top"></div>
                            <div className="bottom">
                                <div className="label">
                                    <div className="icon-cont">
                                        <div className="icon"></div>
                                    </div>

                                    <div className="title">
                                        <span className="small">Lost Something?</span> <br />
                                        <span className="large">Report now</span>
                                    </div>
                                </div>
                                <div className="actions">
                                    <button className="btn scan" onClick={() => { setScreen("report") }}>search</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>)
    }

    return (<>
        {screen == "" && renderDashboardContent()}



    </>)
}

export default Dashboard