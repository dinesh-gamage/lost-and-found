import classNames = require('classnames')
import * as React from 'react'

interface ISearchProps {
    type: "lost" | "found"
    show: boolean,
    onClose: () => void
}

const SearchPanel: React.FunctionComponent<ISearchProps> = (props) => {

    //props
    let { type, show, onClose } = props

    // state

    return (<div className={classNames("mda-popup-screen", { "show": show })}>
        <div className="mda-search-panel-cont">
            <div className="header">
                <div className="close-btn" onClick={onClose}>
                    <div className="icon-cont">
                        <div className="icon"></div>
                    </div>
                </div>
            </div>

            <div className="content">
                <div className="search-box-cont">
                    <input type="text" placeholder="Start typing..." />
                    <div className="search-icon-cont">
                        <div className="search-icon"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>)
}

export default SearchPanel