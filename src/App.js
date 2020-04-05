import React, { Component } from 'react';

// Data Visualisation Library
import * as d3 from "d3"

// UI libraries & Theme
import theme from './theme';
import styled from 'styled-components'
import { space } from 'styled-system'

// UI Components
import NavBar from './components/NavBar'
import Link from './components/Link';

// d3 Visualisations
import CalendarView from './CalendarView'
import CircularDiagram from './CircularDiagram'

// Data source file 
import cycles from "./data/cycles.csv"

/**
 * Headline text, located on the main page
 */
const Headline = styled.p`
  font-size: 4rem;
  font-weight: bold;
  max-width: 700px;
  ${space};
  span {
  }
`
/**
 * Introduction, description below Headline  
 */
const Intro = styled.p`
  max-width: 500px;
  ${space};
`

/**
 * Main Application / Single Page App
 */
export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [{ key: "", values: [] }]
    }
  }

  /**
   * Loading data from the csv file
   * and attaching it to the state
   */
  async componentDidMount() {
    let result = await this.loadData(cycles)
    this.setState({
      data: result
    })
  }

  /**
   * Function to load data from a csv file
   */
  loadData = async (fileName) => {
    return await d3.csv(fileName).then(csv => {
      //group data by year
      var data = d3.nest()
        .key(function (d) { return d.date.split("-")[0]; })
        .entries(csv)
      // convert the string date to actual date object
      data.forEach(a => {
        a.values.forEach(b => {
          b.date = d3.utcParse("%Y-%m-%d")(b.date)
          b.amount = parseInt(b.amount.toString().replace(",", ""))
        })
      })
      return data
    }).catch(error => {
      console.log(error)
      throw error
    })
  }

  /**
   * Render the components in this Page
   */
  render() {
    if (this.state.data.length === 1) {
      return <div>Loading...</div>
    } else {
      return (
        <div className="container" style={{ backgroundColor: theme.colors.white }}>
          <NavBar />
          <div>
            <Headline mt={6} mb={3}><span>Cycling in London Over the Past Decade</span></Headline>
            <Intro mb={6}>Lorem ipsum dolor sit amet, <Link href="">consetetur</Link>  sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et</Intro>
            <CalendarView data={this.state.data} />
            <div style={{ height: "100px" }}></div>
            <CircularDiagram data={this.state.data} />
            <div style={{ height: "100px" }}></div>
          </div>

        </div>
      )
    }
  }
}
