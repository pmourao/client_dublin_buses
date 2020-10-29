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

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: 53.350140,
        longitude: -6.266155,
        zoom: 11.5,
        bearing: 0,
        pitch: 15,
        width: 800,
        height: 900,
      },
      popupInfo: null,
      mapHeight: 900,
      devices: props.devices,
      operators: [],
      vehicles: [],
      positions: [],
      loadingPositions: false,
      loadingOperator: false,
      loadingVehicles: false,
      startDate: new Date(2012, 11, 8, 0, 0, 1),
      endDate: new Date(2012, 11, 8, 0, 1, 3),
      operator: 'CD',
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
    this.isWeekday = this.isWeekday.bind(this);
  }

  componentDidMount() {
    this.getOperators()
    this.getVehicles()
    this.getVehiclePositions()
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  getOperators() {
    this.setState({
      loadingOperator: true

    });
    var operators = []
    let startStr = + this.state.startDate.getUTCFullYear() + "-" + parseInt(this.state.startDate.getMonth()) + "-" + ('0' + this.state.startDate.getDate()).substr(-2)
     + 'T' + ('0' + this.state.startDate.getHours()).substr(-2) + ':' + ('0' + this.state.startDate.getMinutes()).substr(-2) + ':' + ('0' + this.state.startDate.getSeconds()).substr(-2);
    let endStr = this.state.endDate.getUTCFullYear() + "-" + parseInt(this.state.endDate.getMonth()) + "-" + ('0' + this.state.endDate.getDate()).substr(-2)
     + 'T' + ('0' + this.state.endDate.getHours()).substr(-2) + ':' + ('0' + this.state.endDate.getMinutes()).substr(-2) + ':' + ('0' + this.state.endDate.getSeconds()).substr(-2);
    const apiUrl = 'http://127.0.0.1:5000/v1/operators?start=' + startStr + '&end=' + endStr;
    console.log(apiUrl)
    fetch(apiUrl, {
      crossDomain: true,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(responseJson => {
        responseJson['response']['operators'].forEach(elem => operators.push(
          {
            'label': elem,
            'value': elem,
          }
        ));
        this.setState({
          operators: operators,
          loadingOperator: false
        });
      }
      )
  }

  getVehicles() {
    this.setState({
      loadingVehicles: true,
    });
    var vehicles = []
    var vehicles_labels = []
    let startStr = + this.state.startDate.getUTCFullYear() + "-" + parseInt(this.state.startDate.getMonth())+ "-" + ('0' + this.state.startDate.getDate()).substr(-2)
     + 'T' + ('0' + this.state.startDate.getHours()).substr(-2) + ':' + ('0' + this.state.startDate.getMinutes()).substr(-2) + ':' + ('0' + this.state.startDate.getSeconds()).substr(-2);
    let endStr = this.state.endDate.getUTCFullYear() + "-" + parseInt(this.state.endDate.getMonth()) + "-" + ('0' + this.state.endDate.getDate()).substr(-2)
     + 'T' + ('0' + this.state.endDate.getHours()).substr(-2) + ':' + ('0' + this.state.endDate.getMinutes()).substr(-2) + ':' + ('0' + this.state.endDate.getSeconds()).substr(-2);
    const apiUrl = 'http://127.0.0.1:5000/v1/vehicles?start=' + startStr + '&end=' + endStr + '&operator=' + this.state.operatorId + '&atstop=false';
    console.log(apiUrl)
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
      }
      )
  }
  getVehiclePositions() {
    this.setState({
      loadingVehicles: true,
    });
    console.log(this.state.vehicleId)
    var positions = []
    let startStr = + this.state.startDate.getUTCFullYear() + "-" + parseInt(this.state.startDate.getMonth()) + "-" + ('0' + this.state.startDate.getDate()).substr(-2)
     + 'T' + ('0' + this.state.startDate.getHours()).substr(-2) + ':' + ('0' + this.state.startDate.getMinutes()).substr(-2) + ':' + ('0' + this.state.startDate.getSeconds()).substr(-2);
    let endStr = this.state.endDate.getUTCFullYear() + "-" + parseInt(this.state.endDate.getMonth()) + "-" + ('0' + this.state.endDate.getDate()).substr(-2)
     + 'T' + ('0' + this.state.endDate.getHours()).substr(-2) + ':' + ('0' + this.state.endDate.getMinutes()).substr(-2) + ':' + ('0' + this.state.endDate.getSeconds()).substr(-2);
    const apiUrl = 'http://127.0.0.1:5000/v1/vehicles/' + this.state.vehicleId + '?start=' + startStr + '&end=' + endStr;
    console.log(apiUrl)
    fetch(apiUrl, {
      crossDomain: true,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson)
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
      }
      )
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
              <span style={{color:"black"}}>Lat: {popupInfo.lat}</span><br></br>
              <span style={{color:"black"}}>Lon: {popupInfo.lon}</span>
            </CardHeader>
          </SensorCard>
        </Popup>
      )
    );
  }

  openPopup(device) {
    this.setState({ popupInfo: device });
    //this.getData()
  }

  handleVehicleChange = (newValue) => {
    this.setState({ vehicleId: newValue['label'] });

    console.log(newValue['label'])
    this.getVehiclePositions();
    return newValue;
  }
  handleOperatorChange = (newValue) => {
    console.log(newValue['label'])
    this.setState({ operatorId: newValue['label'] });
    this.getVehicles();
    return newValue;
  }
  isWeekday = date => {
    const day = new Date(2012, 8, 25)
    return (day === date);
  };

  render() {
    const {  viewport, mapHeight, popupInfo, loadingOperator, loadingVehicles, vehicles, operators, positions, vehicleId, operatorId, startDate, endDate } = this.state;
    console.log(positions)
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
            <Subtitle>Use the filters assuming the available day 8/11/2012.</Subtitle>
            <FilterRow >
              Start date
              <DatePicker
                showTimeSelect
                selected={startDate}
                dateFormat='dd.MM.yy HH:MM:SS'
                filterDate={this.isWeekday}
                onChange={date => this.setState({
                  startDate: date,
                })}
                theme={theme}
              />
            </FilterRow>
            <FilterRow >
              End date
             <DatePicker
                showTimeSelect
                selected={endDate}
                dateFormat='dd.MM.yy HH:MM:SS'
                filterDate={this.isWeekday}
                onChange={date => this.setState({
                  endDate: date,
                })}
                theme={theme}
              />
            </FilterRow>
            <FilterRow >
              Operators <p>   </p>
              <Select
                className="select"
                defaultValue={operatorId}
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
              Vehicles<p>   </p>
              <Select
                className="select2"
                isDisabled={false}
                defaultValue={vehicleId}
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
          mapStyle="mapbox://styles/pmourao89/ckgs56su80vqo19px9kluuvq3"
          onViewportChange={this.updateViewport}
          onClick={() => (popupInfo ? this.setState({ popupInfo: null }) : null)}
          mapboxApiAccessToken="pk.eyJ1IjoicG1vdXJhbzg5IiwiYSI6ImNqaDd1ZXBxaDAwNncyeHFsd3dhbDAybnoifQ.qJue5EWgp3BoYfnfiCW7JA">
          <div style={{ position: 'absolute', left: 20, bottom: 50 }}>
            <NavigationControl onViewportChange={this.updateViewport} />
          </div>
          <Markers positions={this.state.positions} openPopup={this.openPopup} />
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

const Subtitle = styled.h4`
  font-size: 19px;
  font-weight: 400;
  line-height: 33px;
  margin-bottom: 60px;
  max-width: 265px;
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
  display: block;
  border-radius: 6px;
  transition: box-shadow 0.19s ease-out;
  position: relative;
  user-select: none;
  cursor: default;
  color: inherit;
  text-decoration: none;
  width: 200px;
  height: 80px;
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

