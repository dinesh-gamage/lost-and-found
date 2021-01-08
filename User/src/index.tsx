import * as React from 'react'
import * as ReactDom from 'react-dom'
import { DashboardContext } from './components/DashboardContext'


import './styles.scss'

interface IDashboardContainerProps {
    context: IPartialContextProvider
}

type IScreen = "login" | "dashboard"

const PoliceDashboard: React.FunctionComponent<IDashboardContainerProps> = (props) => {

    // states
    let [screen, setScreen] = React.useState<IScreen>("login")

    return (<DashboardContext.Provider value={props.context} >
        <div className="mda-police-dashboard-container">
        </div>
    </DashboardContext.Provider>)
}



(window as any).renderDashboard = (context: IPartialContextProvider) => {
    ReactDom.render(<PoliceDashboard context={context} />,
        document.getElementById(context.root));
}