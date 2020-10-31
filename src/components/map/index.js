import React from 'react';
import styled from 'styled-components';
import Select from 'react-select';
import MapGL, { Popup, NavigationControl } from 'react-map-gl';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import '../../assets/scss/mapbox.scss';
import Controls from './controls';
import Markers from './markers';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const mapControls = new Controls();
const api_base_url = "https://api-l3qyhmfh2a-ew.a.run.app"
const mapbox_url = "mapbox://styles/pmourao89/ckgs56su80vqo19px9kluuvq3"
class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: 53.338214,
        longitude: -6.350259,
        zoom: 11.5,
        bearing: 0,
        pitch: 15,
        width: 800,
        height: 900,
      },
      popupInfo: null,
      mapHeight: 900,
      operators: [],
      vehicles: [],
      positions: [],
      loadingPositions: false,
      loadingOperator: false,
      loadingVehicles: false,
      startDate: new Date(2012, 11, 8, 0, 0, 0),
      endDate: new Date(2012, 11, 8, 0, 30, 0),
      operatorId: 'CD',
      vehicleId: '33352'
    };
    this.openPopup = this.openPopup.bind(this);
    this.resize = this.resize.bind(this);
    this.renderPopup = this.renderPopup.bind(this);
    this.updateViewport = this.updateViewport.bind(this);
    this.getOperators = this.getOperators.bind(this);
    this.getVehicles = this.getVehicles.bind(this);
    this.getVehiclePositions = this.getVehiclePositions.bind(this);
    this.handleVehicleChange = this.handleVehicleChange.bind(this);
    this.handleOperatorChange = this.handleOperatorChange.bind(this);
    this.filterDay = this.filterDay.bind(this);
  }

  componentDidMount() {
    this.getOperators(this.state.startDate, this.state.endDate)
    this.getVehicles(this.state.operatorId)
    this.getVehiclePositions(this.state.vehicleId)
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  getOperators(start, end) {
    this.setState({
      loadingOperator: true

    });
    var operators = []
    
    let startStr = + start.getUTCFullYear() + "-" + parseInt(start.getMonth()) + "-" + ('0' + start.getDate()).substr(-2)
     + 'T' + ('0' + this.state.startDate.getHours()).substr(-2) + ':' + ('0' + start.getMinutes()).substr(-2) + ':' + ('0' + start.getSeconds()).substr(-2);
    
    let endStr = end.getUTCFullYear() + "-" + parseInt(end.getMonth()) + "-" + ('0' + end.getDate()).substr(-2)
     + 'T' + ('0' + end.getHours()).substr(-2) + ':' + ('0' + end.getMinutes()).substr(-2) + ':' + ('0' + end.getSeconds()).substr(-2);
    
    const apiUrl = api_base_url + '/v1/operators?start=' + startStr + '&end=' + endStr;
    
    fetch(apiUrl, {
      crossDomain: true,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        if(!response.ok) throw new Error(response.status);
        else return response.json();
        })
      .then(responseJson => {
        responseJson['response']['operators'].forEach(elem => operators.push(
          {
            'label': elem,
            'value': elem,
          }
        ));
        this.setState({
          operators: operators,
          loadingOperator: false,
        });
      })
      .catch((error) => {
          console.log('error: ' + error);
          this.setState({ 
              requestFailed: true,
              loadingOperator: false, });
      });
  }

  getVehicles(operatorId) {
    this.setState({
      loadingVehicles: true,
    });
    var vehicles = []
    var vehicles_labels = []
    
    let startStr = + this.state.startDate.getUTCFullYear() + "-" + parseInt(this.state.startDate.getMonth())+ "-" + ('0' + this.state.startDate.getDate()).substr(-2)
     + 'T' + ('0' + this.state.startDate.getHours()).substr(-2) + ':' + ('0' + this.state.startDate.getMinutes()).substr(-2) + ':' + ('0' + this.state.startDate.getSeconds()).substr(-2);
    
    let endStr = this.state.endDate.getUTCFullYear() + "-" + parseInt(this.state.endDate.getMonth()) + "-" + ('0' + this.state.endDate.getDate()).substr(-2)
     + 'T' + ('0' + this.state.endDate.getHours()).substr(-2) + ':' + ('0' + this.state.endDate.getMinutes()).substr(-2) + ':' + ('0' + this.state.endDate.getSeconds()).substr(-2);
    
    const apiUrl = api_base_url + '/v1/vehicles?start=' + startStr + '&end=' + endStr + '&operator=' + operatorId + '&atstop=false';
    
    fetch(apiUrl, {
      crossDomain: true,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(responseJson => {
        responseJson['response']['vehicles'].forEach((elem) => {
          if (!vehicles.includes(elem['vehicleId'])) vehicles.push(elem['vehicleId'])
        });


        vehicles.forEach(elem =>
          vehicles_labels.push({
            'label': elem,
            'value': elem
          })
        )
        this.setState({
          vehicles: vehicles_labels,
          loadingVehicles: false,
        });
        this.forceUpdate();
      })
      .catch((error) => {
          console.log('error: ' + error);
          this.setState({ 
              requestFailed: true,
              loadingOperator: false, });
      });
  }

  getVehiclePositions(vehicleId) {
    this.setState({
      loadingVehicles: true,
    });
    var positions = []
    
    let startStr = + this.state.startDate.getUTCFullYear() + "-" + parseInt(this.state.startDate.getMonth()) + "-" + ('0' + this.state.startDate.getDate()).substr(-2)
     + 'T' + ('0' + this.state.startDate.getHours()).substr(-2) + ':' + ('0' + this.state.startDate.getMinutes()).substr(-2) + ':' + ('0' + this.state.startDate.getSeconds()).substr(-2);
    
    let endStr = this.state.endDate.getUTCFullYear() + "-" + parseInt(this.state.endDate.getMonth()) + "-" + ('0' + this.state.endDate.getDate()).substr(-2)
     + 'T' + ('0' + this.state.endDate.getHours()).substr(-2) + ':' + ('0' + this.state.endDate.getMinutes()).substr(-2) + ':' + ('0' + this.state.endDate.getSeconds()).substr(-2);
    
    const apiUrl = api_base_url + '/v1/vehicles/' + vehicleId + '?start=' + startStr + '&end=' + endStr;
    
    fetch(apiUrl, {
      crossDomain: true,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(responseJson => {
        responseJson['response']['locations'].forEach((elem, index) => positions.push(
          {
            'id': index,
            'lat': elem['location']['Lat'],
            'lon': elem['location']['Lon'],
            'time': elem['time'],
          }
        ));
        this.setState({
          positions: positions,
          loadingVehicles: false,
        });
      })
      .catch((error) => {
          console.log('error: ' + error);
          this.setState({ 
              requestFailed: true,
              loadingOperator: false, });
      });
    this.setState({
      positions: positions,
    });
  }

  resize() {
    const mapHeight = window.innerHeight //  < 760 ? 500 : 900;
    this.setState({
      viewport: {
        ...this.state.viewport,
        width: this.props.width || window.innerWidth,
        height: this.props.height || window.innerHeight,
      },
      mapHeight,
    });
  }

  updateViewport(viewport) {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport },
    });
  }

  renderPopup() {
    const { popupInfo } = this.state;
    return (
      popupInfo && (
        <Popup
          tipSize={10}
          anchor="bottom-left"
          offsetTop={-5}
          offsetLeft={5}
          closeButton={true}
          longitude={Number(popupInfo.lon)}
          latitude={Number(popupInfo.lat)}
          closeOnClick={false}
          onClose={() => this.setState({ popupInfo: null })}
        >
          <SensorCard >
            <CardHeader>
              <span style={{color:"black"}}>Time: {popupInfo.time}</span><br></br>
              <span style={{color:"black"}}>Lat: {popupInfo.lat}</span><br></br>
              <span style={{color:"black"}}>Lon: {popupInfo.lon}</span><br></br>
            </CardHeader>
          </SensorCard>
        </Popup>
      )
    );
  }

  openPopup(device) {
    this.setState({ popupInfo: device });
  }

  handleVehicleChange = (newValue) => {
    this.setState({ vehicleId: newValue['label'] });

    this.getVehiclePositions(newValue['label']);
    return newValue;
  }

  handleOperatorChange = (newValue) => {
    this.setState({ 
      operatorId: newValue['label'],
      positions : [],
      vehicleId : "Select one Vehicle"
     });
    this.getVehicles(newValue['label']);
    return newValue;
  }

  filterDay = date => {
    const day = new Date(2012, 8, 25)
    return (day === date);
  };

  render() {
    const {  
      viewport,
      mapHeight,
      popupInfo,
      loadingOperator,
      loadingVehicles,
      vehicles,
      positions,
      operators,
      vehicleId,
      operatorId,
      startDate,
      endDate } = this.state;

    const theme = theme => ({
      ...theme,
      colors: {
        ...theme.colors,
        primary25: 'black',
        primary: "white",
        neutral0: '#7FC210',
      },
      textColor: 'white',
      width: 50,
    });
    
    return (
      <Main id="map">
        <Header>
          <div>
            <Heading>Filters</Heading>
            <FilterRow >
              Start date<br/>
              <DatePicker
                showTimeSelect
                selected={startDate}
                dateFormat='dd.MM.yy HH:mm:ss'
                filterDate={this.filterDay}
                onChange={(date) => {
                this.setState({
                  startDate: date,
                  operatorId : "Select one Operator",
                  vehicleId : ""
                })
                this.getOperators(date, endDate)
                }
                }
              />
            </FilterRow>
            <FilterRow >
              End date<br/>
             <DatePicker
                showTimeSelect
                selected={endDate}
                dateFormat='dd.MM.yy HH:mm:ss'
                filterDate={this.filterDay}
                onChange={(date) =>{
                this.setState({endDate: date,})
                this.getOperators(startDate, date)
                }}
              />
            </FilterRow>
            <FilterRow >
              Operators<br/>
              <Select
                className="select"
                defaultValue={{ label: operatorId, value: operatorId }}
                value={{ label: operatorId, value: operatorId }}

                isDisabled={false}
                isLoading={loadingOperator}
                isClearable={false}
                isRtl={false}
                isSearchable={false}
                name="operator"
                options={operators}
                theme={theme}
                onChange={this.handleOperatorChange}
              />
            </FilterRow>
            <FilterRow >
              Vehicles<br/>
              <Select
                className="select2"
                isDisabled={false}
                defaultValue={{ label: vehicleId, value: vehicleId }}
                value={{ label: vehicleId, value: vehicleId }}
                isLoading={loadingVehicles}
                isClearable={false}
                isRtl={false}
                isSearchable={false}
                name="vehicle"
                theme={theme}
                options={vehicles}
                onChange={this.handleVehicleChange}
              />
            </FilterRow>
          </div>
        </Header>
        <MapGL
          scrollZoom={true}
          controller={mapControls}
          maxZoom={15}
          {...viewport}
          height={mapHeight}
          mapStyle={mapbox_url}
          onViewportChange={this.updateViewport}
          onClick={() => (popupInfo ? this.setState({ popupInfo: null }) : null)}
          mapboxApiAccessToken="pk.eyJ1IjoicG1vdXJhbzg5IiwiYSI6ImNqaDd1ZXBxaDAwNncyeHFsd3dhbDAybnoifQ.qJue5EWgp3BoYfnfiCW7JA">
          <div style={{ position: 'absolute', left: 20, bottom: 50 }}>
            <NavigationControl onViewportChange={this.updateViewport} />
          </div>
          <Markers positions={positions} openPopup={this.openPopup} />
          {this.renderPopup()}
        </MapGL>
      </Main>
    );
  }
}

const mapStateToProps = state => ({
  settings: state.settings,
});
export default connect(mapStateToProps)(Map);

const Main = styled.div`
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: 74px;
    left: 0;
    height: 1px;
    width: 100vw;
    background-color: #eaecee;
    @media (max-width: 760px) {
      top: 0;
    }
  }
`;

const Header = styled.div`
  max-width: 1170px;
  padding: 0 15px;
  margin-right: auto;
  margin-left: auto;
  display: flex;
  justify-contents: center;
  width: 400px;
  position: absolute;
  z-index: 900;
  padding-top: 140px;
  @media (max-width: 760px) {
    padding-top: 50px;
  }
  @media (max-width: 520px) {
    width: 200px;
  }
  @media (max-width: 400px) {
    padding-top: 0;
    margin-top: -100px;
  }
`;

const Heading = styled.h3`
  text-transform: capitalize;
  text-align: left;
  color: #7FC210;
  font-size: 28px;
  font-weight: 100;
  line-height: 42px;
  margin-bottom: 12px;
  @media (max-width: 760px) {
    font-size: 24px;
    margin-bottom: 0;
    margin-bottom: 10px;
  }
`;

const FilterRow = styled.h4`
  font-size: 19px;
  font-weight: 400;
  line-height: 33px;
  margin-bottom: 20px;
  max-width: 1  65px;
  color: #fff;
  text-align: left;
  @media (max-width: 1120px) {
    max-width: 215px;
  }
  @media (max-width: 760px) {
    font-size: 18px;
    line-height: 28px;
  }
`;

const SensorCard = styled(Link)`
  position: relative;
  box-sizing: border-box;
  display: block;
  border-radius: 6px;
  transition: box-shadow 0.19s ease-out;
  position: relative;
  user-select: none;
  cursor: default;
  color: inherit;
  text-decoration: none;
  width: 350px;
  height: 90px;
  padding-top: 19px;
  border: none;
  background-color: #7FC210;
  @media (max-width: 760px) {
    margin-bottom: 10px;
  }
`;

const CardHeader = styled.header`
  position: relative;
  padding: 0 20px 8px 30px;
`;

