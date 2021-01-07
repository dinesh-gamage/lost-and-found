import * as React from 'react'
import * as ReactDom from 'react-dom'
import Dashboard from './components/Dashboard'
import LoginPage from './components/LoginPage'

import './styles.scss'

interface IPoliceDashboardProps {

}

type IScreen = "login" | "dashboard"

const PoliceDashboard: React.FunctionComponent<IPoliceDashboardProps> = (props) => {

    // states
    let [screen, setScreen] = React.useState<IScreen>("dashboard")

    return (<div className="mda-police-dashboard-container">
        {screen == "login" && <LoginPage onLogin={() => setScreen("dashboard")} />}
        {screen == "dashboard" && <Dashboard  />}
    </div>)
}



(window as any).renderDashboard = (root: string) => {
    ReactDom.render(<PoliceDashboard />,
        document.getElementById(root));
}