import * as React from 'react';


class DefaultDashboardContext implements IContextProvider {
    root: string;
    baseUrl: string;
    apiKey: string;
    profile: {
        user: {
            name: string,
            email: string,
            phone: string,
        },
        bus: {
            number: string,
            label: string
        }

    }

    constructor(partialContext: IPartialContextProvider) {
        this.root = partialContext?.root;
        this.baseUrl = partialContext?.baseUrl;
        this.apiKey = partialContext?.apiKey;
        this.profile = partialContext?.profile
    }

}
export function createDashboardContext(partialContext: IPartialContextProvider) {
    return new DefaultDashboardContext(partialContext);
}

export const DashboardContext = React.createContext(createDashboardContext(null));