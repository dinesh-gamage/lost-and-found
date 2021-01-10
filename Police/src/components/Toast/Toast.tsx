import classNames = require('classnames');
import * as React from 'react';
import { useToast } from '.';

// types
type IToastType = 'success' | 'error' | 'info' | "warning" | "custom";
type IToastContent = () => JSX.Element

interface IToastProps {
    type: IToastType,
    icon?: string | IToastContent,
    title?: string | IToastContent,
    content: string | IToastContent,
    showCloseBtn?: boolean,
    autoClose?: boolean,
    onClose?: () => void,
    closeAfter?: number,
    instance: string,
    createdAt: number
}

const Toast: React.FunctionComponent<IToastProps> = React.memo((props) => {

    // props 
    let { type, title, content, icon, showCloseBtn, autoClose, onClose, closeAfter, instance, createdAt } = props

    // toast remove method
    const { remove } = useToast();

    // ref 
    const ToastRef = React.useRef(null);

    // on mount
    React.useEffect(() => {

        if (autoClose) {
            let _closeAfter = closeAfter;
            let _createdAt = createdAt;

            let now = new Date();
            let nowTime = now.getTime();


            if ((nowTime - _createdAt) >= _closeAfter) {
                handleRemove();
            }
            else {
                // cal timeout delay
                let delay = (_closeAfter - (nowTime - _createdAt));

                let timeout = setTimeout(() => {
                    handleRemove()
                }, delay);

                return () => { clearTimeout(timeout) }
            }
        }

    }, [instance, remove])


    // handle remove
    const handleRemove = () => {

        ToastRef.current.classList.remove("show");
        ToastRef.current.classList.add("hide");

        setTimeout(() => {
            remove(instance)
            if (onClose) onClose()
        }, 300)
    }

    // return
    return (
        <div className={classNames("toast", type, "show")} ref={ToastRef}>

            {
                type == "custom" ?
                    <div className={classNames("toast-content")}>
                        {typeof content == "string" ? content : content()}
                    </div>
                    :
                    <>
                        <div className="icon-container">
                            {
                                icon ?
                                    <>
                                        {typeof icon == "string" ? <img src={icon} /> : icon()}
                                    </>
                                    : <div className="icon"></div>
                            }
                        </div>

                        <div className={classNames("toast-content")}>
                            {
                                title &&
                                <div className="title">
                                    {typeof title == "string" ? title : title()}
                                </div>
                            }

                            <div className="content">
                                {typeof content == "string" ? content : content()}
                            </div>
                        </div>
                    </>
            }

            {showCloseBtn && <div className="close" onClick={() => { handleRemove() }} ></div>}

        </div >
    )

});

export default Toast;