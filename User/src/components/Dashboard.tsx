import * as React from 'react'
import LostItemSearch from './LostItemSearch'

interface IDashboardProps {
}

type IDashboardScreen = "" | "search"

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

                <div className="title">Things to do</div>

                <div className="quick-actions">
                    <div className="quick-action-thumbnail-cont">
                        <div className="quick-action-thumbnail watch">
                            <div className="top"></div>
                            <div className="bottom">
                                <div className="label">
                                    <div className="icon-cont">
                                        <div className="icon"></div>
                                    </div>

                                    <div className="title">
                                        <span className="small">Islamic traditions</span> <br />
                                        <span className="large">Learn more</span>
                                    </div>
                                </div>
                                <div className="actions">
                                    <button className="btn scan" >PLAY</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="quick-action-thumbnail-cont">
                        <div className="quick-action-thumbnail hijab">
                            <div className="top"></div>
                            <div className="bottom">
                                <div className="label">
                                    <div className="icon-cont">
                                        <div className="icon"></div>
                                    </div>

                                    <div className="title">
                                        <span className="small">Islamic traditions</span> <br />
                                        <span className="large">Learn more</span>
                                    </div>
                                </div>
                                <div className="actions">
                                    <button className="btn scan" >PLAY</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="quick-actions large">

                    <div className="quick-action-thumbnail-cont">
                        <div className="quick-action-thumbnail map">
                            <div className="top"></div>
                            <div className="bottom">

                                <div className="icon"></div>
                                <div className="content">
                                    <span> Next bus leaves in</span>
                                    <div className="large">12 minutes</div>
                                    <span>  to bada'ah</span>
                                </div>


                                <div className="actions">
                                    <button className="btn scan" >reserve a seat</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

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
                                    <button className="btn scan" onClick={() => { setScreen("search") }}>search</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="quick-action-thumbnail-cont">
                        <div className="quick-action-thumbnail cab-book">
                            <div className="header">
                                <div className="icon-cont">
                                    <div className="icon"></div>
                                </div>
                            </div>
                            <div className="content">
                                <span> Next cab to board</span>
                                <div className="large">375 VLS</div>
                                <span>  white toyota innova</span>
                            </div>

                            <div className="actions">
                                <button className="btn notify-patrol">Book</button>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="quick-actions large">

                    <div className="quick-action-thumbnail-cont">
                        <div className="quick-action-thumbnail prayer">
                            <div className="top"></div>
                            <div className="bottom">
                                <div className="time">12: 00 PM</div>
                                <div className="desc">
                                    <div className="large">Zuhr</div>
                                    <div className="text">attend nearest mosque</div>
                                </div>
                                <div className="actions">
                                    <button className="btn scan" >View Timings</button>
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

        <LostItemSearch show={screen == "search"} onClose={() => setScreen("")} />

    </>)
}

export default Dashboard