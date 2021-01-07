import axios, { AxiosRequestConfig } from 'axios'
import classNames = require('classnames')
import * as React from 'react'
import { DashboardContext } from './DashboardContext'
import ItemList from './ItemList'

interface ISearchProps {
    type: "lost" | "found"
    show: boolean,
    onClose: () => void
}

const SearchPanel: React.FunctionComponent<ISearchProps> = (props) => {

    const Context = React.useContext(DashboardContext)

    //props
    let { type, show, onClose } = props

    // state
    let [query, setQuery] = React.useState<string>("")
    let [items, setItems] = React.useState<ILostAndFoundItem[]>([])
    let [loading, setLoading] = React.useState<boolean>(false)
    let [showList, setShowList] = React.useState<boolean>(false)

    let queryInput = React.useRef(null)

    function onSearch() {
        setLoading(true)
        setShowList(true)
        setItems([])

        let _url = Context.baseUrl + "Lucy/LostItem/find"
        if (type == "found") _url = Context.baseUrl + "Lucy/FoundItem/find"

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

                    <input type="text" placeholder="Start typing..."
                        value={query}
                        onChange={(e) => { setQuery(e.target.value) }}
                        ref={queryInput}
                    />

                    <div className="search-icon-cont" onClick={onSearch}>
                        <div className="search-icon"></div>
                    </div>
                </div>

                <div className={classNames("item-list", { "show": showList })}>
                    <ItemList items={items} loading={loading} />
                </div>

            </div>
        </div>
    </div>)
}

export default SearchPanel