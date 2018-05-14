import React from 'react';
import * as routes from '../constants/routes';
//import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
import ReactMapboxGl, {Layer, Feature, Marker} from 'react-mapbox-gl';

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
            center={[-105.035857,39.912612]}>
            <Layer
            type="circle">

            {
                Object.keys(this.props.positions).map( (nodeName, index) => (
                    <Feature key={index} coordinates={this.props.positions[nodeName]} />
                ))
            }
            </Layer>
            {
                Object.keys(this.props.positions).map( (nodeName, index) => (
                    <Marker key={index} coordinates={this.props.positions[nodeName]}>{nodeName}</Marker>
                ))
            }
        </Map>
        );
    }
}

export default SystemMap;