import React from 'react';
import styled from 'styled-components';
import { Marker } from 'react-map-gl';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { positions: this.props.positions };

    this.sanitiseCoordinates = this.sanitiseCoordinates.bind(this);
    this.sanatiseDevice = this.sanatiseDevice.bind(this);
    this.updateDevices = this.updateDevices.bind(this);
  }

  componentDidMount() {
    this.updateDevices(this.props);
  }

  updateDevices(props) {
    console.log(this.state.positions)
    const positions = [
      ...props.positions.filter(device => this.sanatiseDevice(device)).map(device => {
        device.lat = this.sanitiseCoordinates(device.lat);
        device.lon = this.sanitiseCoordinates(device.lon);
        return device;
      }),
    ];
    this.setState({ positions });
  }

  sanitiseCoordinates(coordinate) {
    return typeof coordinate === 'number' ? coordinate : Number(coordinate.replace(/[^0-9.]/g, ''));
  }

  sanatiseDevice(device) {
    if (!device.lon || !device.lat || device.inactive) return false;
    if (device.lat >= 90 || device.lat <= -90) return false;
    if (device.lon >= 180 || device.lon <= -180) return false;
    return true;
  };

  render() {
      const positions = this.props.positions
      return (
      <div>
        {
          positions.map((position, i) => (
            <Marker latitude={Number(position.lat)} longitude={Number(position.lon)} key={i}>
              <Pin onClick={() => this.props.openPopup(position)} />
            </Marker>
          ))
        }
      </div>
    );
  }
}

const Pin = styled.div`
  background-image: linear-gradient(-140deg, #7FC210 0%, #3C851B 100%);
  position: absolute;
  height: 15px;
  width: 15px;
  top: -20px;
  right: -10px;
  transform: rotate(-45deg);
  border-radius: 50% 50% 50% 0;
  cursor: pointer !important;
`;
  //box-shadow: -10px 9px 12px 0 rgba(60, 133, 27, 1);
