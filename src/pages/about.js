import React from 'react';
import styled from 'styled-components';
import BurgerMenu from '../components/burger/burger';
import Content from '../components/content';
const contentIntroduction1 = {
  title: 'About',
  text: `This is a proof of concept of a user interface client built using React.
The aim of this PoC is create an interactive map that fetches data form the Restful API based on filters.
`,
};

export default class extends React.Component {

  render() {
    return (
      <div>
      <Main id="main">
        <BurgerMenu />
        <Container/>
        <Content content={contentIntroduction1} />
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
const Container = styled.div`
  display: flex;
  width: 100%;
  max-width: 1170px;
  padding: 0 15px;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 150px;

  @media (max-width: 820px) {
    margin-bottom: 80px;
  }

  @media (max-width: 660px) {
    background-image: url(/static/shapes/demo/shape-header-hero.svg);
    background-repeat: no-repeat;
    background-size: 448px 209px;
    padding: 48px 0;
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 550px) {
    background-size: 289px 167px;
    background-position-y: 50px;
    padding: 38px 0;
  }

  @media (max-width: 400px) {
    background-image: none;
    padding-top: 0;
  }
`;

