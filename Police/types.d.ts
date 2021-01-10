interface IPartialContextProvider {
    root: string,
    baseUrl: string,
    apiKey: string
}

interface IContextProvider extends IPartialContextProvider {

}

interface ILostAndFoundItem {
    _id: string
    Name: string
    Phone: string
    Email: string
    Description: string
    Features: string
    ImageUrl: string
    LastLocation: string
    Status: string
    Created: string
    PoliceStationID?: string
    LockerID?: string
    Data?: string
    AdditionalDetails?: string
    FoundLocation?: string
    Location?: string
    claimed?: string[]
    HandedOverEmail?: string
    HandedOverTime?: string

}