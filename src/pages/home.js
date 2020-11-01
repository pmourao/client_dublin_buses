import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router';
import BurgerMenu from '../components/burger/burger';
import Map from '../components/map';
class HomePage extends React.Component {

  render() {
    return (
      <Main id="main">
        <BurgerMenu />
        <Map ></Map>
      </Main>
    );
  }
}

export default withRouter(HomePage);

const Main = styled.div`
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
`;

