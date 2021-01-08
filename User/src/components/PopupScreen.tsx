import * as React from 'react';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import PortalContainer from './portal/PortalContainer';

interface IPopupScreenProps {
    show: boolean,
}

const PopupScreen: React.FunctionComponent<IPopupScreenProps> = (props) => {

    return (<CSSTransition
        in={props.show}
        timeout={300}
        classNames="slide-upb"
        unmountOnExit={true}
    >
        <PortalContainer>
            <div className={classNames("mda-popup-screen-container")} >
                {props.children}
            </div>
        </PortalContainer>

    </CSSTransition>)
}

export default PopupScreen