import React from 'react';
import styled from 'styled-components';
import BurgerMenu from '../components/burger/burger';
import SwaggerUi, {presets} from 'swagger-ui';
import 'swagger-ui/dist/swagger-ui.css';

export default class extends React.Component {
  async componentDidMount() {
     SwaggerUi({
      dom_id: '#swaggerContainer',
      url: `https://buses-map-d1556.web.app/api_swagger.json`,
      presets: [presets.apis],
    });
  }

  render() {
    return (
      <div>
      <Main id="main">
        <BurgerMenu />
        <div id="swaggerContainer" />
      </Main>
      
      </div>
    );
  }
}

const Main = styled.div`
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
`;
