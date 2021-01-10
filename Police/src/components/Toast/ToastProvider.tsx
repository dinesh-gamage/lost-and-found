import * as React from 'react';
import ToastContext from './ToastContext';
import PortalContainer from '../portal/PortalContainer';
import Toast from './Toast';

// types
type IToastType = 'success' | 'error' | 'info' | 'warning' | "custom";
type IToastPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
type IToastContent = () => JSX.Element
// props 
interface IToastProviderProps {
    position?: IToastPosition,
    showCloseBtn?: boolean,
    autoClose?: boolean,
    closeAfter?: number,
}

// toast content
interface IPartialContent {
    icon?: string | IToastContent,
    title?: string | IToastContent,
    content: string | IToastContent,
    showCloseBtn?: boolean,
    autoClose?: boolean,
    onClose?: () => void,
    closeAfter?: number,
}

interface IContent extends IPartialContent {
    type?: IToastType
}

// toast 
interface IToast {
    id: string,
    content: IContent,
    createdAt: number
}

// create a random id
function generateId() {
    let date = new Date();
    let random = Math.round((Math.random() * 10000));

    let id = date.getTime().toString() + random.toString();

    return id;
}


// toast provider
const ToastProvider: React.FunctionComponent<IToastProviderProps> = (props) => {

    // states
    const [toasts, setToasts] = React.useState<IToast[]>([]);


    React.useEffect(() => {
        console.log(toasts);
    }, [toasts])


    // add method
    const add = (content: IContent) => {
        let id = generateId();
        let date = new Date();
        let createdAt = date.getTime();

        // merge default props with content except position
        let { position, ...rest } = props;
        let updatedContent: IContent = { ...rest, ...content }

        setToasts([...toasts, { id: id, content: updatedContent, createdAt: createdAt }]);
    }

    // remove method 
    const remove = React.useCallback((id: string) => {
        setToasts(toasts => toasts.filter((toast: IToast) => toast.id !== id))
    }, [])


    // toast types
    // success
    const success = (content: string | IPartialContent) => {
        let updated = updatedContent(content, 'success');
        return add(updated);
    }

    // error
    const error = (content: string | IPartialContent) => {
        let updated = updatedContent(content, 'error');
        return add(updated);
    }

    // warning
    const warning = (content: string | IPartialContent) => {
        let updated = updatedContent(content, 'warning');
        return add(updated);
    }

    const info = (content: string | IPartialContent) => {
        let updated = updatedContent(content, 'info');
        return add(updated);
    }

    const custom = (content: string | IPartialContent) => {
        let updated = updatedContent(content, 'custom');
        return add(updated);
    }

    // get alert content based on type
    const updatedContent = (content: string | IPartialContent, type: IToastType) => {

        let defaults = {
            type: type,
            //title: type.toString()
        }

        if (typeof content == "string") {
            content = { content: content }
        }


        let updated: IContent = { ...defaults, ...content }

        return updated;
    }


    // provider value
    const providerValue = React.useMemo(() => { return { success, error, warning, info, custom, remove } }, [toasts])


    // render toast
    const renderToast = (toast: IToast, key: number) => {
        return (<Toast
            icon={toast.content.icon}
            type={toast.content.type}
            title={toast.content.title}
            content={toast.content.content}
            onClose={toast.content.onClose || null}
            showCloseBtn={toast.content.showCloseBtn}
            autoClose={toast.content.autoClose}
            instance={toast.id}
            closeAfter={toast.content.closeAfter}
            key={toast.id}
            createdAt={toast.createdAt}
        />);
    }

    // return 
    return (
        <ToastContext.Provider value={providerValue} >

            <PortalContainer disableScroll={false}>
                <div className={`toast-container ${props.position}`}>
                    {
                        toasts.map((toast: IToast, key: number) => renderToast(toast, key))
                    }
                </div>
            </PortalContainer>

            {props.children}

        </ToastContext.Provider>
    );

}

ToastProvider.defaultProps = {
    position: 'bottom-right',
    autoClose: true,
    showCloseBtn: true,
    closeAfter: 5000
}

export default ToastProvider;