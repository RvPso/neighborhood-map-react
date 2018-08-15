import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react'
import './App.css';
import MapContainer from './MapContainer'



class App extends Component {
  render() {
    return (
      <div>
        <MapContainer google={this.props.google} />
      </div>
    );
  }
}
export default GoogleApiWrapper({
  apiKey: 'AIzaSyAg3gr1L2WnsK4BMY7ypp3aZYry7divrhc'
})(App) 