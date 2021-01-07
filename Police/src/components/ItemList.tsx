import classNames = require('classnames')
import * as React from 'react'

interface IItemListProps {
    show: boolean,
    onClose: () => void
    type: "lost" | "found"
    onChangeType: (type: "lost" | "found") => void
    onSelect: (s: string) => void
}

const ItemList: React.FunctionComponent<IItemListProps> = (props) => {

    //props
    let { show, onClose, type, onChangeType, onSelect } = props

    return (<div className={classNames("mda-popup-screen", { "show": show })}>
        <div className="mda-items-list-cont">

            <div className="header">
                <div className="back-btn" onClick={onClose} >
                    <div className="icon-cont">
                        <div className="icon"></div>
                    </div>
                </div>

                <div className="title">Lost and Found</div>

                <div className="close-btn" onClick={onClose} >
                    <div className="icon-cont">
                        <div className="icon"></div>
                    </div>
                </div>
            </div>

            <div className="toolbar">
                <div className="toggle-btn">
                    <button className={classNames("btn", { "active": type == "lost" })}
                        onClick={() => onChangeType("lost")}
                    >Lost</button>

                    <button className={classNames("btn", { "active": type == "found" })}
                        onClick={() => onChangeType("found")}
                    >Found</button>
                </div>
            </div>

            <div className="items-list">
                {[...Array(10).keys()].map((i: any, key: number) => {
                    return (<div className="item" key={key}>
                        <div className="header">
                            <div className="time">
                                <div className="icon-cont">
                                    <div className="icon"></div>
                                </div>
                                <div className="text">05:30 PM</div>
                            </div>
                        </div>
                        <div className="content">
                            <div className="image-cont">
                                <img src="https://spaceworx.io/wp-content/uploads/2019/12/cropped-Asset-5-1-192x192.png" alt="" />
                            </div>
                            <div className="desc" >
                                A black duffle bag found in the bus towards Al Khalidiya
                            </div>
                        </div>

                        <div className="footer">
                            <div className="location">
                                <div className="icon-cont">
                                    <div className="icon"></div>
                                </div>
                                <div className="text">Prayer area</div>
                            </div>

                            <div className="btn">Tagged</div>
                        </div>

                    </div>)
                })}

            </div>


            <div className="footer">
                <div className="scan-btn" onClick={() => onSelect("scan")}>
                    <div className="icon-cont">
                        <div className="icon"> </div>
                    </div>
                </div>

                <div className="search-btn" onClick={() => {onSelect("search")}}>
                    <div className="icon-cont">
                        <div className="icon"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>)
}

export default ItemList