import axios, { AxiosRequestConfig } from 'axios'
import classNames = require('classnames')
import * as React from 'react'
import { DashboardContext } from './DashboardContext'
import ItemList from './ItemList'

interface IItemListComponentProps {
    show: boolean,
    onClose: () => void
    type: "lost" | "found" | "claimed" | "handed"
    onChangeType: (type: "lost" | "found" | "claimed" | "handed") => void
    onSelect: (s: string) => void
}


const ItemListComponent: React.FunctionComponent<IItemListComponentProps> = (props) => {

    const Context = React.useContext(DashboardContext)

    //props
    let { show, onClose, type, onChangeType, onSelect } = props

    // state
    let [loading, setLoading] = React.useState(false)
    let [items, setItems] = React.useState<ILostAndFoundItem[]>([])

    React.useEffect(() => {
        if (type) getItems()
    }, [type])


    function getItems() {
        setLoading(true)
        setItems([])

        let _url = Context.baseUrl + "/Lucy/FoundItem/all";
        if (type == "lost") _url = Context.baseUrl + "/Lucy/LostItem/all";

        let config: AxiosRequestConfig = {
            headers: {
                "Authorization": `APIKEY ${Context.apiKey}`
            }
        }
        axios.get(_url, config)
            .then((res: any) => {
                console.log("response : ", res)

                let data = res.data
                if (type == "handed") {
                    let handed = data.filter((d: ILostAndFoundItem) => d.HandedOverEmail?.trim().length > 0)
                    setItems(handed)
                }
                else if (type == "claimed") {
                    let claimed = data.filter((d: ILostAndFoundItem) => d.claimed?.length > 0 && (!d.HandedOverEmail || d.HandedOverEmail.trim().length == 0))
                    setItems(claimed)
                }
                else if (type == "found") {
                    let found = data.filter((d: ILostAndFoundItem) => (!d.HandedOverEmail || d.HandedOverEmail.trim().length == 0))
                    setItems(found)
                }
                else {
                    setItems(data)
                }

                setLoading(false)
            })
            .catch((e) => {
                console.log("Exception : ", e)
                setItems([])
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

            <div className="cont">
                <div className="toolbar">
                    <div className="toggle-btn">
                        <button className={classNames("btn", { "active": type == "lost" })}
                            onClick={() => onChangeType("lost")}
                        >Lost</button>

                        <button className={classNames("btn", { "active": type == "found" })}
                            onClick={() => onChangeType("found")}
                        >Found</button>
                        {/* <button className={classNames("btn", { "active": type == "claimed" })}
                            onClick={() => onChangeType("claimed")}
                        >Claimed</button> */}
                        <button className={classNames("btn", { "active": type == "handed" })}
                            onClick={() => onChangeType("handed")}
                        >Handed Over</button>
                    </div>
                </div>

                <div className="item-list">
                    <ItemList items={items} loading={loading} type={type} />
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
        </div>
    </div>)
}

export default ItemListComponent