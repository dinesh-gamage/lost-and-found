import axios, { AxiosRequestConfig } from 'axios'
import classNames = require('classnames')
import * as React from 'react'
import { getImageUrl, getLocationName } from '../utils'
import { DashboardContext } from './DashboardContext'
import ItemDetails from './ItemDetails'

interface IItemsListProps {

}

type IItemType = "lost" | "found" | "claimed"
const ItemsList: React.FunctionComponent<IItemsListProps> = (props) => {

    const Context = React.useContext(DashboardContext)

    let [type, setType] = React.useState<IItemType>("lost")
    let [query, setQuery] = React.useState<string>("")
    let [items, setItems] = React.useState<ILostAndFoundItem[]>([])
    let [loading, setLoading] = React.useState<boolean>(false)
    let [selected, setSelected] = React.useState<ILostAndFoundItem | null>(null)


    React.useEffect(() => {
        if (query.trim().length > 0) {
            onSearch()
        }
        else {
            getAll()
        }
    }, [type])

    function getAll() {
        setLoading(true)
        setItems([])
        let _url = Context.baseUrl + "Lucy/LostItem/all"
        if (type == "found") _url = Context.baseUrl + "Lucy/FoundItem/all"

        let config: AxiosRequestConfig = {
            headers: {
                "Authorization": `APIKEY ${Context.apiKey}`
            }
        }

        axios.get(_url, config)
            .then((res: any) => {
                console.log("response ", res)
                setItems(res.data)
                setLoading(false)

            })
            .catch((e) => {
                console.log("Exception : ", e)
                setItems([])
                setLoading(false)
            })
    }

    function onSearch() {

        if (query.trim().length == 0) {
            getAll()
        }
        else {
            setLoading(true)
            setItems([])

            let _url = Context.baseUrl + "Lucy/FoundItem/find"
            if (type == "lost") _url = Context.baseUrl + "Lucy/LostItem/find"

            let config: AxiosRequestConfig = {
                headers: {
                    "Authorization": `APIKEY ${Context.apiKey}`
                }
            }

            let data = {
                Description: query
            }

            axios.post(_url, data, config)
                .then((res: any) => {
                    console.log("response search ", res)
                    setItems(res.data)
                    setLoading(false)

                })
                .catch((e) => {
                    console.log("Exception : ", e)
                    setItems([])
                    setLoading(false)
                })
        }
    }

    return (<div className="mda-lost-found-items-list">
        <div className="toolbar">
            <div className="toggle">

                <div className={classNames("btn", { "active": type == "lost" })}
                    onClick={() => { setType("lost") }}
                >Lost</div>

                <div className={classNames("btn", { "active": type == "found" })}
                    onClick={() => { setType("found") }}
                >found</div>

                {/* <div className={classNames("btn", { "active": type == "claimed" })}
                    onClick={() => { setType("claimed") }}
                >claimed</div> */}

            </div>

            <div className="search-box-cont">
                <input type="text" placeholder="Start typing..."
                    value={query}
                    onChange={(e) => { setQuery(e.target.value) }}
                    autoFocus
                />

                <div className="search-icon-cont" onClick={onSearch}>
                    <div className="search-icon"></div>
                </div>
            </div>
        </div>

        <div className="content">

            {loading && <div className="loading">Loading...</div>}
            {!loading && items.length == 0 && <div className="no-items">No items found</div>}

            {items.map((item: ILostAndFoundItem, key: number) => {

                return (<div className="item" key={key} onClick={() => { setSelected(item) }}>
                    <div className="header">
                        <div className="time">
                            <div className="icon-cont">
                                <div className="icon"></div>
                            </div>
                            <div className="text">{item.Created}</div>
                        </div>

                        <div className="location">
                            <div className="icon-cont">
                                <div className="icon"></div>
                            </div>
                            <div className="text">{getLocationName(item, type)}</div>
                        </div>
                    </div>

                    <div className="content">
                        <div className="image-cont">
                            <img src={getImageUrl(item.ImageUrl)} alt="" />
                        </div>

                        <div className="desc">
                            {type == "lost" ? item.Description :
                                <div className="tags">
                                    {item && item?.Features.map((t: string, key: number) => {
                                        return (<div className="tag" key={key} >{t}</div>)
                                    })}
                                </div>
                            }
                        </div>

                        <div className="other">

                        </div>
                    </div>

                </div>)
            })}
        </div>

        <ItemDetails show={selected != null} item={selected} onClose={() => setSelected(null)} type={type} />

    </div>)
}

export default ItemsList