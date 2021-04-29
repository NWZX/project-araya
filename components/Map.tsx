import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import firebase from 'firebase/app';
import { Grid } from '@material-ui/core';

interface Props {
    positionCenter?: firebase.firestore.GeoPoint;
    positionMarker?: { marker: firebase.firestore.GeoPoint; title: string }[];
    draggableMarker?: boolean;
    scrollZoom?: boolean;
    heigth: number | string;
    zoom?: number;
    onDrag?: (location: firebase.firestore.GeoPoint) => void;
    rightZone?: JSX.Element;
}

const Map = ({
    positionCenter = new firebase.firestore.GeoPoint(0, 0),
    positionMarker = [],
    heigth,
    zoom = 13,
    draggableMarker,
    scrollZoom,
    onDrag,
    rightZone,
}: Props): JSX.Element => {
    return (
        <MapContainer
            center={[positionCenter.latitude, positionCenter.longitude]}
            zoom={zoom}
            scrollWheelZoom={scrollZoom}
            style={{ height: heigth }}
        >
            <Grid container justify="flex-end">
                <Grid item>{rightZone}</Grid>
            </Grid>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {positionMarker.map((v, i) => {
                return (
                    <Marker
                        key={i}
                        position={[v.marker.latitude, v.marker.longitude]}
                        draggable={draggableMarker}
                        eventHandlers={{
                            dragend: (e) => {
                                onDrag &&
                                    onDrag(new firebase.firestore.GeoPoint(e.target._latlng.lat, e.target._latlng.lng));
                            },
                        }}
                    >
                        <Popup>{v.title}</Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};

export default Map;
