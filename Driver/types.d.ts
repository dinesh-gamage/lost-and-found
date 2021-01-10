interface IPartialContextProvider {
    root: string,
    baseUrl: string,
    apiKey: string
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
}

interface IContextProvider extends IPartialContextProvider {

}

interface ILostAndFoundItem {
    _id: string
    Name: string
    Phone: string
    Email: string
    Title: string
    Description: string
    Features: string
    ImageUrl: string
    LastLocation: string
    Status: string
    Created: string
    PoliceStationID?: string
    LockerID?: string
    AdditionalDetails?: {
        BusNumber?: string,
        BagID?: string
        ItemType?: "normal" | "valuable" | "suspicious"
    }
    FoundLocation?: string
}
interface IColor {
    hex: string,
    color: string
}
interface UploadResponse {
    ImageUrl: string
    Features: {
        colors: IColor[],
        labels: string[]
    }
}
interface IUserLocationData {
    lat: string,
    long: string,
    name: string
}