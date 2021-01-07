import * as React from 'react'
import * as ReactDom from 'react-dom'
import Dashboard from './components/Dashboard'
import { DashboardContext } from './components/DashboardContext'
import LoginPage from './components/LoginPage'

import './styles.scss'

interface IPoliceDashboardProps {
    context: IPartialContextProvider
}

type IScreen = "login" | "dashboard"

const PoliceDashboard: React.FunctionComponent<IPoliceDashboardProps> = (props) => {

    // states
    let [screen, setScreen] = React.useState<IScreen>("dashboard")

    return (<DashboardContext.Provider value={props.context} >
        <div className="mda-police-dashboard-container">
            {screen == "login" && <LoginPage onLogin={() => setScreen("dashboard")} />}
            {screen == "dashboard" && <Dashboard />}
        </div>
    </DashboardContext.Provider>)
}



(window as any).renderDashboard = (context: IPartialContextProvider) => {
    ReactDom.render(<PoliceDashboard context={context} />,
        document.getElementById(context.root));
}