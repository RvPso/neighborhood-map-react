import React, {Component} from 'react';
import ReactDOM from 'react-dom'
export default class MapContainer extends Component {
  state = {
    places: [
      {name: 'Royal Marshal Hotel', location: {lat: 30.086808 , lng:31.300872}},
      {name: 'Triumph Hotel', location: {lat: 30.0865016, lng: 31.3060416}},
      {name: 'Cairo Stadium', location: {lat: 30.0691131, lng: 31.3100692}},
      {name: 'Cairo International Fair', location:{lat: 30.072986, lng: 31.300770}},
      {name: 'Amusement Park', location: {lat: 30.089847, lng:31.302502}}
    ],
    markers: [],
    infowindow: new this.props.google.maps.InfoWindow(),
    placename: '123',
    query: '',
  }
  handleValueChange = (input) => {
    this.setState({query: input.target.value})
  }
  componentDidMount() {
   
   
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
        zoom: 12,
        mapTypeId: 'roadmap'
      });
      this.map = new maps.Map(node, mapConfig);
      this.addMarkers();
    }
  }
  populateInfoWindow = (marker, infowindow) => {

    if (infowindow.marker !== marker) {
      infowindow.setContent(this.state.placename);
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
      that.populateInfoWindow(markers[markerInd], infowindow)
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
  
    var clientID = 'GXD0FQDPQUN1HC2JUSKY2YM3ICMQHO5ZWTDML3KEFRYQAR2N';
    var clientSecret = 'AAVPGBUMRZN42WVPO5MUD2K2ZYTRNSU4NUTQGWATVWLK2YER';
    this.state.places.forEach((place, index) => {
      const marker = new google.maps.Marker({
        position: place.location,
        map: this.map,
        title: place.name
      })
      const url = "https://api.foursquare.com/v2/venues/search?client_id=" +
      clientID +
      "&client_secret=" +
      clientSecret +
      "&v=20130815&ll=" +
      marker.getPosition().lat() +
      "," +
      marker.getPosition().lng() +
      "&limit=1";
      fetch(url).then(function(response){
        response.json().then(function(data){
          console.log(data);
          var location_data = data.response.venues[0];
          console.log(location_data.name)
          this.setState({placename: location_data.name})
      
          
        })
      })
      marker.addListener('click', () => {
        this.populateInfoWindow(marker, infowindow)
      })
      this.setState((state) => ({
        markers: [...state.markers, marker]
      }))
  
    })

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
          {markers.filter(marker => marker.getVisible()).map((marker, i) => (<li key={i}>{marker.title}</li>))}
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