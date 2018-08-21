import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import swal from 'sweetalert';
export default class MapContainer extends Component {
  state = {
    places: [
      {name: 'Royal Marshal Hotel', location: {lat: 30.086808 , lng:31.300872}},
      {name: 'Costa Coffee', location: {lat: 30.0865016, lng: 31.3060416}},
      {name: 'Cairo Stadium', location: {lat: 30.0691131, lng: 31.3100692}},
      {name: 'Asala Coffee', location:{lat: 30.072986, lng: 31.300770}},
      {name: 'Fangari Bridge', location: {lat: 30.089847, lng:31.302502}}
    ], 
    markers: [],
    infowindow: new this.props.google.maps.InfoWindow(),
    verify: [],
    users: [],
    query: '',
  }
  handleValueChange = (input) => {
    this.setState({query: input.target.value})
  }
  componentDidMount() {
    
   this.API();
    this.loadMap();
    this.onclickLocation();
  }
  loadMap() {
    if (this.props && this.props.google) {
      const {google} = this.props;
      const maps = google.maps;
      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef)
      const mapConfig = Object.assign({}, {
        center: {lat: 30.0865016, lng: 31.3060416},
        zoom: 14,
        mapTypeId: 'roadmap'
      });
      this.map = new maps.Map(node, mapConfig);
      this.addMarkers();
    } else {
      swal('Failed to load the map, please refresh')
    }
  }
  populateInfoWindow = (marker, infowindow, verify, users) => {
    if (infowindow.marker !== marker) {
      infowindow.setContent('<b>' + marker.title + '</b> <br>' + verify + '<br> CheckIns: ' + users);
      infowindow.marker = marker;
      infowindow.open(this.map, marker);
      infowindow.addListener('click', function() {
        infowindow.marker = null;
        
      });
    }
  }
  onclickLocation = () => {
    const that = this
    const {infowindow} = this.state
    const displayInfowindow = (event) => {
      const {markers} = this.state
      const markerInd = markers.findIndex(marker => marker.title.toLowerCase() === event.target.innerText.toLowerCase())
      that.populateInfoWindow(markers[markerInd], infowindow, that.state.verify[markerInd], this.state.users[markerInd])
    }
    document.querySelector('.locations').addEventListener('click', function (event) {
      if(event.target && event.target.nodeName === "LI") {
        displayInfowindow(event)
      }
    })
  }
  addMarkers = () => {
    let {google} = this.props;
    let {infowindow} = this.state;

    this.state.places.forEach((place, index) => {
      const marker = new google.maps.Marker({
        position: place.location,
        map: this.map,
        title: place.name,
        animation: google.maps.Animation.DROP
      })
      marker.addListener('click', () => {
        this.populateInfoWindow(marker, infowindow, this.state.verify[index], this.state.users[index])
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
          marker.setAnimation(null);
      }, 500);
      })
      this.setState((state) => ({
        markers: [...state.markers, marker]
      }))
  
    })

  }

  API = () => {
    let {places} = this.state;
    var clientID = 'GXD0FQDPQUN1HC2JUSKY2YM3ICMQHO5ZWTDML3KEFRYQAR2N';
    var clientSecret = 'AAVPGBUMRZN42WVPO5MUD2K2ZYTRNSU4NUTQGWATVWLK2YER';
    var locationVerification = [];
    var locationUsers = [];
    for (var i = 0; i <= 4; i++) {
      const url = "https://api.foursquare.com/v2/venues/search?client_id=" +
    clientID +
    "&client_secret=" +
    clientSecret +
    "&v=20130815&ll=" +
    places[i].location.lat +
    "," +
    places[i].location.lng +
    "&limit=1";
    fetch(url).then(function(response){
      if (response.ok) {
        return response.json();
    } else {
      return;
    }
  }).then(function(data){
        var location_data = data.response.venues[0];
        locationVerification.push(location_data.verified ? 'Verified' : 'Not Verified') ;
        locationUsers.push(location_data.stats.checkinsCount)
      }).catch(() => {
        swal('failed to load, please refresh the page');
      })
      
    }
    setTimeout(function() {
      this.setState({verify: locationVerification,
                     users: locationUsers})
      console.log(this.state.verify)
  }.bind(this), 3000);
  }
  render() {
    const {markers, places, query, infowindow} = this.state;
    if (query) {
      places.forEach((place, i) => {
        if(place.name.toLowerCase().includes(query.toLowerCase())) {
          markers[i].setVisible(true);
        } else {
          if (infowindow.maker === markers[i]) {
            infowindow.close();
          }
          markers[i].setVisible(false);
        }
      })
    }
    return (
      <div>
        <div className="container">
          <div className="sidebar">
          <input role="search" type='text'
                 value={this.state.value}
                 onChange={this.handleValueChange} />
          <ul className="locations">
          {markers.filter(marker => marker.getVisible()).map((marker, i) => (<li tabIndex="0" key={i}>{marker.title}</li>))}
           </ul>       
          </div>
          <div role="application" className="map" ref="map">
            loading map...
          </div>
        </div>
      </div>
    )
  }
} 
