import axios, { AxiosRequestConfig } from 'axios'
import classNames = require('classnames')
import * as React from 'react'
import { DashboardContext } from './DashboardContext'

interface IItemListProps {
    show: boolean,
    onClose: () => void
    type: "lost" | "found"
    onChangeType: (type: "lost" | "found") => void
    onSelect: (s: string) => void
}

const ItemList: React.FunctionComponent<IItemListProps> = (props) => {

    const Context = React.useContext(DashboardContext)

    //props
    let { show, onClose, type, onChangeType, onSelect } = props

    // state
    let [loading, setLoading] = React.useState(false)
    let [lostItems, setLostItems] = React.useState<ILostItem[]>([] as ILostItem[])

    React.useEffect(() => {
        if (type == "lost") {
            getLostItems()
        }
        else {
            // _url = Context.baseUrl + "/Lucy/FoundItem/all";
            // getItems(_url)
        }

    }, [type])

    function getLostItems() {
        let _url = Context.baseUrl + "/Lucy/LostItem/all";
        setLoading(true)
        let config: AxiosRequestConfig = {
            headers: {
                "Authorization": `APIKEY ${Context.apiKey}`
            }
        }
        axios.get(_url, config)
            .then((res: any) => {
                console.log("response : ", res)
                setLostItems(res.data)
                setLoading(false)
            })
            .catch((e) => {
                console.log("Exception : ", e)
                setLoading(false)
            })
    }

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

                {type == "lost" &&
                    <>
                        {
                            lostItems.map((item: ILostItem, key: number) => {
                                return (<div className="item" key={key}>
                                    <div className="header">
                                        <div className="time">
                                            <div className="icon-cont">
                                                <div className="icon"></div>
                                            </div>
                                            <div className="text">{item.Created}</div>
                                        </div>
                                    </div>
                                    <div className="content">
                                        <div className="image-cont">
                                            <img src={item.ImageUrl} alt="" />
                                        </div>
                                        <div className="desc" >
                                            {item.Description}
                                        </div>
                                    </div>

                                    <div className="footer">
                                        <div className="location">
                                            <div className="icon-cont">
                                                <div className="icon"></div>
                                            </div>
                                            <div className="text">{item.LastLocation}</div>
                                        </div>

                                        <div className="btn">Tagged</div>
                                    </div>

                                </div>)
                            })
                        }
                    </>
                }


            </div>


            <div className="footer">
                <div className="scan-btn" onClick={() => onSelect("scan")}>
                    <div className="icon-cont">
                        <div className="icon"> </div>
                    </div>
                </div>

                <div className="search-btn" onClick={() => { onSelect("search") }}>
                    <div className="icon-cont">
                        <div className="icon"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>)
}

export default ItemList