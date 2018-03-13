import React from 'react';
import * as routes from '../constants/routes';
//import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
import ReactMapboxGl, {Layer, Feature} from 'react-mapbox-gl';

const Map = ReactMapboxGl({
    accessToken: routes.MAPBOX
});

const zoom=[12];

//mapboxgl.accessToken = routes.MAPBOX;


class SystemMap extends React.Component {
    componentDidMount(){
        /*const map = new mapboxgl.Map( 
            { container: this.mapContainer, 
            style: 'mapbox://styles/mapbox/satellite-streets-v10'}
        );*/
    }

    render() {
        const map_style = "mapbox://styles/mapbox/streets-v9";
        //return <div style={style} ref={el => this.mapContainer = el} />;
        return( 
        <Map
            style={map_style}
            containerStyle={{
                height: "100vh",
                 width: "500"
            }}
            zoom={zoom}
            center={[-105.2705, 40.0150]}>
            <Layer
            type="symbol"
            id="marker"
            layout={{ "icon-image": "marker-15" }}>
            <Feature coordinates={[-105.2705, 40.0150]}/>
            </Layer>
        </Map>
        );
    }
}

export default SystemMap;