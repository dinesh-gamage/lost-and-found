import * as React from 'react'
import * as ReactDom from 'react-dom'
import Dashboard from './components/Dashboard'
import { DashboardContext } from './components/DashboardContext'


import './styles.scss'

interface IDashboardContainerProps {
    context: IPartialContextProvider
}

type IScreen = "dashboard"

const PoliceDashboard: React.FunctionComponent<IDashboardContainerProps> = (props) => {

    // states
    let [screen, setScreen] = React.useState<IScreen>("dashboard")

    return (<DashboardContext.Provider value={props.context} >
        <div className="mda-user-dashboard-container">
            {screen == "dashboard" && <Dashboard />}
        </div>
    </DashboardContext.Provider>)
}



(window as any).renderDashboard = (context: IPartialContextProvider) => {
    ReactDom.render(<PoliceDashboard context={context} />,
        document.getElementById(context.root));
}