
import axios, { AxiosRequestConfig } from 'axios'
import classNames = require('classnames')
import * as React from 'react'
import { DashboardContext } from './DashboardContext'
import ItemList from './ItemList'
import LostItemReport from './LostItemReport'
import PopupScreen from './PopUpScreen'

interface ILostItemSearchProps {
    show: boolean,
    onClose: () => void
}

const LostItemSearch: React.FunctionComponent<ILostItemSearchProps> = (props) => {

    const Context = React.useContext(DashboardContext)

    let { show, onClose } = props

    let [query, setQuery] = React.useState<string>("")
    let [items, setItems] = React.useState<ILostAndFoundItem[]>([])
    let [loading, setLoading] = React.useState<boolean>(false)
    let [showList, setShowList] = React.useState<boolean>(false)
    let [showReport, setShowReport] = React.useState<boolean>(false)

    
    function onSearch() {
        setLoading(true)
        setShowList(true)
        setItems([])

        let _url = Context.baseUrl + "Lucy/FoundItem/find"
        // let _url = Context.baseUrl + "Lucy/LostItem/find"

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
                let found = data.filter((d: ILostAndFoundItem) => (!d.HandedOverEmail || d.HandedOverEmail.trim().length == 0))
                setItems(found)
                setLoading(false)

            })
            .catch((e) => {
                console.log("Exception : ", e)
                setItems([])
                setLoading(false)
            })
    }

    return (<PopupScreen show={show}>
        <div className="mda-search-panel-cont">
            <div className="header">
                <div className="back-btn" onClick={onClose} >
                    <div className="icon-cont">
                        <div className="icon"></div>
                    </div>
                </div>

                <div className="title">Lost Items</div>

                <div className="close-btn" onClick={onClose} >
                    <div className="icon-cont">
                        <div className="icon"></div>
                    </div>
                </div>
            </div>

            <div className="content">
                <div className="search-box-cont">
                    {!showList && <div className="lost-items-cont">
                        <div className="icon"></div>
                    </div>}

                    <div className="title">Try searching for found items!</div>

                    <input type="text" placeholder="Start typing..."
                        value={query}
                        onChange={(e) => { setQuery(e.target.value) }}
                        autoFocus
                    />

                    <div className="search-icon-cont" onClick={onSearch}>
                        <div className="search-icon"></div>
                    </div>
                </div>

                <div className={classNames("item-list", { "show": showList })}>
                    <ItemList items={items} loading={loading} />
                </div>

            </div>

            <div className="floating-btn">
                <button className="btn" onClick={() => {setShowReport(true)}} >No, Create a report</button>
            </div>
            
            <LostItemReport show={showReport} onClose={() => setShowReport(false)} />
        </div>
    </PopupScreen>)
}

export default LostItemSearch