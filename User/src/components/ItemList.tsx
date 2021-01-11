import classNames = require('classnames')
import * as React from 'react'
import { getFoundLocationName, getImageUrl } from '../utils'
import ItemDetails from './ItemDetails'

interface IItemList {
    items: ILostAndFoundItem[],
    loading: boolean
}

const ItemList: React.FunctionComponent<IItemList> = (props) => {

    // props
    let { items, loading } = props

    //states 
    let [selected, setSelected] = React.useState<ILostAndFoundItem | null>(null)

    

    return (<div className="mda-lost-found-items-list">

        {loading && <div className="loading">Loading...</div>}
        {!loading && items.length == 0 && <div className="no-items">No items found</div>}

        {
            items.map((item: ILostAndFoundItem, key: number) => {
                return (<div className="item" key={key} onClick={() => setSelected(item)}>
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
                            <img src={getImageUrl(item.ImageUrl)} alt="" />
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
                            <div className="text">{getFoundLocationName(item)}</div>
                        </div>
                        <div className="tags">
                            {item.HandedOverEmail && item.HandedOverEmail.trim().length > 0 ?
                                <div className="btn">Handed over</div>
                                :
                                <>
                                    {
                                        item.claimed && item.claimed.length > 0 &&
                                        <div className="btn">Claimed</div>
                                    }
                                </>
                            }


                        </div>


                    </div>

                </div>)
            })
        }

        <ItemDetails show={selected != null} item={selected} onClose={() => setSelected(null)} />

    </div>)
}

export default ItemList