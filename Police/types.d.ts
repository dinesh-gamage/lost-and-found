interface IPartialContextProvider {
    root: string,
    baseUrl: string,
    apiKey: string
}

interface IContextProvider extends IPartialContextProvider {

}

interface ILostItem {
    Created: string
    Description: string
    Email: string
    Features: string
    ImageUrl: string
    LastLocation: string
    Name: string
    Phone: string
    Status: string
    _id: string
}