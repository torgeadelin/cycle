import React from 'react';
import CalendarView from './CalendarView'
import styled from 'styled-components'
import theme from './theme';
import { space } from 'styled-system'
import NavBar from './components/NavBar'

const Wrapper = styled.div`

`

const Headline = styled.p`
  font-size: 3rem;
  font-weight: bold;
  max-width: 600px;
  ${space};
`

const Intro = styled.p`
  max-width: 500px;
  ${space};
`

function App() {
  return (
    <div className="container" style={{ backgroundColor: theme.colors.white }}>
      <NavBar />
      <Wrapper>
        <Headline mt={6} mb={3}>Cycling in London Over the Past Decade</Headline>
        <Intro mb={6}>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et</Intro>
        <CalendarView />
        <div style={{ height: "300px" }}></div>
      </Wrapper>

    </div>
  );
}

export default App;
