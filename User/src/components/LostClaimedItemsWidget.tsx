import * as React from 'react'
import LostClaimedItemListComponent from './LostClaimedItemListComponent'
import LostClaimedList from './LostClaimedList'
import QRCodePreview from './QRCodePreview'

const LostClaimedItemsWidget: React.FunctionComponent<{}> = (props) => {

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

        <LostClaimedList />

        <LostClaimedItemListComponent show={open} onClose={() => setOpen(false)} />
    
    </div>)
}

export default LostClaimedItemsWidget