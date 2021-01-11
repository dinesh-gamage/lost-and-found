import * as React from 'react';
import { Map, TileLayer, ImageOverlay, Marker, Rectangle, Polygon, Circle, Tooltip, Popup } from 'react-leaflet';
import { LatLngTuple, LatLngExpression, LeafletMouseEvent, CRS } from 'leaflet';

import './map.scss';

/**
 * Represents an individual marker
 * @example
 * {latitude:0,longitude:23.2,data:{'name':'FooBar'}}
 * 
 * @export
 */
interface IMarker {
    latitude: number,
    longitude: number,
    data?: any
}
/**
 * @exports
 */
type regionType = "circle" | "rectangle" | "polygon"

interface ICircleBound {
    center: [number, number],
    radius: number
}
/**
 * @export
 */
type IPolygonBound = LatLngExpression[] | LatLngExpression[][];

/**
 * @export
 * Region data for maps
 */
interface IRegion {
    type?: regionType, // default is polygon
    bounds: IPolygonBound | ICircleBound,
    hideStroke?: boolean,
    color?: string,
    fillColor?: string,
    data?: any,
    imageCoordinates?: boolean,
    /**
     * A tooltip to be shown when you click on the region
     */
    tooltipContent?: (data: any) => JSX.Element;
}

/**
 * @export
 * A static image to load as the map.
 */
interface IStaticImage {
    /**
     * The url of the image
     */
    url: string;
    /**
     * The width of the image in pixels
     */
    width: number;

    /**
     * The height of the image in pixels
     */
    height: number;
}

interface IMapComponentProps {
    /**
     * The url of the tile server that will serve up map tiles.
     * This url should have the following placeholders in them:
     * `{x}`, `{y}` and `{z}`
     * 
     * `{z}` represents the current zoom level
     * 
     * @example
     * ```
     * mapUrl="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
     * ```
     */
    mapUrl: string,

    /**
     * A static image to use instead of a map layout.
     * If you are using a static image, specify `mapUrl` as an empty string.
     * 
     * The static image consists of a url for the image and a width and height of the image.
     * Note that the width and height values  be relative - just that the ratio should be accurate.
     * 
     * @example
     * ```
     * staticImage={{url:'https://myserver/floor-plan.png',width:200,height:400}}
     * ```
     */
    staticImage?: IStaticImage,

    /**
     * This handler gets called whenever a marker is clicked on.
     * The first paramater represents the marker element that was clicked on.
     * The second parameter represents the data associated with the marker
     */
    onMarkerClick: (el: any, data: any) => void

    /**
     * A list of markers to render.
     * Each marker has a `latitutde` `longitude` and `data` field.
     * The `data` field can store arbitrary data.
     */
    markers: IMarker[],

    /**
     * Where the map is centered.
     */
    center?: { position: IMarker, renderMarker?: boolean },
    /**
     * regions to show on map
     */
    regions?: IRegion[],
    /**
     * this handler will get called when a region is clicked
     * 
     */
    onRegionClick?: (event: any, data: any) => void

    /**
     * The default zoom level to show on the map
     */
    zoom?: number,
    /**
     * this handler will get called when the map is clicked 
     */
    onClick?: (event: LeafletMouseEvent) => void
}

const getStaticImageBounds = (w: number, h: number) => {
    return [[0, 0], [h, w]] as [[number, number], [number, number]];
    let lat = 0;
    let lng = 0;
    if (h > w) {
        lat = 85;
        lng = 180 * w / h;
    } else {
        lng = 180;
        lat = 85 * h / w
    }
    return [[-lat, -lng], [lat, lng]] as [[number, number], [number, number]];
}

const convertFromImagePosition = (x: number, y: number, w: number, h: number, bounds: [[number, number], [number, number]]): [number, number] => {
    return [h - y, x];
    let lat = 0;
    let lng = 0;
    lng = bounds[0][1] + (bounds[1][1] - bounds[0][1]) * x / w;
    lat = bounds[1][0] - (bounds[1][0] - bounds[0][0]) * y / h;
    return [lat, lng];
}

/**
 * A map widget that can show a pannable/zoomable map with markers
 * @export
 * 
 */
const MapComponent: React.FunctionComponent<IMapComponentProps> = (props) => {

    // props
    let { mapUrl, markers, onMarkerClick, center, zoom, regions, onClick, onRegionClick } = props;

    // get center
    let _center: LatLngTuple = [1.290270, 103.851959];
    let _renderCenter: boolean = false
    if (center) {
        _center = [center.position.latitude, center.position.longitude]
        if (center.renderMarker) _renderCenter = center.renderMarker;
    }
    else {
        if (markers.length > 0) {
            _center = [markers[0].latitude, markers[0].longitude]
        }
    }

    // zoom
    let _zoom = 5;
    if (zoom) _zoom = zoom;

    const handleMarkerClick = (event: React.MouseEvent<Marker>, data: any) => {
        onMarkerClick(event, data);
    }

    const handleRegionClick = (event: React.MouseEvent, data: any) => {
        console.log("event : ", event)
        console.log("data : ", data)
        if (onRegionClick) onRegionClick(event, data);
    }

    const handleMapClick = (e: LeafletMouseEvent) => {
        if (onClick) onClick(e);
    }



    return (<Map
        crs={props.staticImage ? CRS.Simple : CRS.EPSG3857}

        id="uxp-map-component-container"
        attributionControl={false}
        center={_center} zoom={_zoom} onclick={handleMapClick} >
        {/* base layer */}

        {

            <TileLayer url={mapUrl} noWrap={true} />
        }
        {
            props.staticImage ?
                <ImageOverlay url={props.staticImage.url} bounds={getStaticImageBounds(props.staticImage.width, props.staticImage.height)} />
                : null
        }

        {/* render markers */}
        {
            markers.map((marker: IMarker, key: number) => {
                return <Marker
                    position={[marker.latitude, marker.longitude]}
                    onClick={(event: React.MouseEvent<Marker>) => handleMarkerClick(event, marker.data)}
                    key={key}
                >
                </Marker>
            })
        }

        {/* render center point */}
        {
            _renderCenter &&
            <Marker position={_center} >
                {center?.position?.data && center?.position?.data.trim().length > 0 &&
                    <Tooltip permanent direction="top" offset={[-15, -20]}>{center?.position?.data}</Tooltip>
                }

            </Marker>
        }

        {/* render regions */}
        {
            regions?.map((region: IRegion, key: number) => {
                // get props
                let regionProps: any = {};
                if (region.hideStroke) {
                    regionProps.stroke = !region.hideStroke
                }

                if (region.color) {
                    regionProps.color = region.color
                }

                if (region.fillColor) {
                    regionProps.fillColor = region.fillColor
                }

                if (region.type) {
                    if (region.type == "circle") {
                        let bound = region.bounds;
                        if (bound.hasOwnProperty("center") && bound.hasOwnProperty("radius")) {
                            let _b = bound as ICircleBound;
                            return <Circle center={_b.center} radius={_b.radius}
                                {...regionProps} key={key}
                                onClick={(e: React.MouseEvent) => handleRegionClick(e, region.data)}
                            />
                        }
                    }
                    if (region.type == "rectangle") {
                        let _b = region.bounds as IPolygonBound;
                        return <Rectangle bounds={_b} {...regionProps} key={key}
                            onClick={(e: React.MouseEvent) => handleRegionClick(e, region.data)}
                        />
                    }
                }

                let _b = region.bounds as IPolygonBound;
                if (region.imageCoordinates) {
                    let cb = getStaticImageBounds(props.staticImage.width, props.staticImage.height);
                    _b = (_b as [number, number][]).map(x => convertFromImagePosition(x[0], x[1], props.staticImage.width, props.staticImage.height, cb));
                }
                return <Polygon positions={_b} {...regionProps} key={key}
                    onClick={(e: React.MouseEvent) => handleRegionClick(e, region.data)}
                >
                    {region.tooltipContent && <Tooltip>{region.tooltipContent(region.data)}</Tooltip>}
                </Polygon>
            })
        }

    </Map>)
}


// // Create your own class, extending from the Marker class.
// class ExtendedMarker extends Marker {
//     // "Hijack" the component lifecycle.
//     componentDidMount() {
//         // Call the Marker class componentDidMount (to make sure everything behaves as normal)
//         super.componentDidMount();

//         // Access the marker element and open the popup.
//         this.leafletElement.openPopup();
//     }
// }

export default MapComponent;