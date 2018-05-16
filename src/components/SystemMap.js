import React from 'react';
import * as routes from '../constants/routes';
//import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
import ReactMapboxGl, {Layer, Feature, Marker} from 'react-mapbox-gl';

const Map = ReactMapboxGl({
    accessToken: routes.MAPBOX
});

const zoom=[12];

class SystemMap extends React.Component {

    render() {
        const map_style = "mapbox://styles/mapbox/streets-v9";
        
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
                Object.keys(this.props.nodeList).map( (nodeName, index) => (
                    <Feature key={index} coordinates={this.props.nodeList[nodeName].position ? this.props.nodeList[nodeName].position : { lng: 0, lat: 0 }} />
                ))
            }
            </Layer>
            {
                Object.keys(this.props.nodeList).map( (nodeName, index) => (
                    <Marker key={index} coordinates={this.props.nodeList[nodeName].position ? this.props.nodeList[nodeName].position : {lng: 0, lat: 0}}>{nodeName}</Marker>
                ))
            }
        </Map>
        );
    }
}

export default SystemMap;