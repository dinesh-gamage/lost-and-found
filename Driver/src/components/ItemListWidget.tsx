import * as React from 'react'
import ItemListComponent from './ImageListConponent'
import ItemsList from './ItemsList'
import PopupScreen from './PopUpScreen'

const ItemListWidget: React.FunctionComponent<{}> = (props) => {

    let [open, setOpen] = React.useState<boolean>(false)

    return (<div className="mda-items-list-widget">
        <div className="header">
            <div className="title">
                <div className="icon-cont">
                    <div className="icon"></div>
                </div>

                <div className="span">Lost and Found </div>
            </div>

            <div className="actions">
                <button className="btn" onClick={() => setOpen(true)} >view all</button>
            </div>
        </div>

        <ItemsList />

        <ItemListComponent show={open} onClose={() => setOpen(false)} />
    </div>)
}

export default ItemListWidget