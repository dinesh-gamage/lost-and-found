import axios, { AxiosRequestConfig } from 'axios'
import classNames = require('classnames')
import * as React from 'react'
import { DashboardContext } from './DashboardContext'
import ItemList from './ItemList'

interface ISearchProps {
    type: "lost" | "found" | "claimed" | "handed"
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

    React.useEffect(() => {
        setQuery("")
        setItems([])
        setLoading(false)
        setShowList(false)
    }, [props])

    function onSearch() {
        setLoading(true)
        setShowList(true)
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
                    <ItemList items={items} loading={loading} type={type} />
                </div>

            </div>
        </div>
    </div>)
}

export default SearchPanel