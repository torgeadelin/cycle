import React, { Component } from 'react';

// Data Visualisation Library
import * as d3 from "d3"

// UI libraries & Theme
import theme from './theme';
import styled from 'styled-components'
import { space } from 'styled-system'

// UI Components
import NavBar from './components/NavBar'
import Link from './components/Link'
import { ReactComponent as Loading } from './img/loading.svg'
import Flex from './components/Flex'


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
  max-width: 700px;
  line-height: 1.7rem;
  ${space};
`

const Text = styled.p`
  line-height: 1.7rem;
`
const Section = styled.p`
  font-size: 1.3rem;
  font-weight: 500;
  background-color: ${theme.colors.lightGreen};
  padding: 5px 10px;
  display: inline-block;
  margin-bottom: 0px;
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
      return <div style={{ display: "flex", height: "100vh", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <Loading />
        <p>Loading...</p>
      </div>
    } else {
      return (
        <div className="container" style={{ backgroundColor: theme.colors.white }}>
          <NavBar />
          <div>
            <Headline mt={6} mb={3}><span>Cycling in London Over the Past Decade</span></Headline>
            <Intro mb={6}>This website is presenting data based on London Santander Cycle hires visually, in order to make it easier to analyse trends and peak periods of Londoners being active. The dataset was taken from <Link href="https://data.london.gov.uk/dataset/number-bicycle-hires">London Data Store</Link></Intro>
            <div>

              <Section>Research questions</Section>
              <Flex dir="row">
                <Text>Some of the questions we are trying to answer by analysing the data are finding which <strong>seasons are more popular for bikers</strong>, what months of the year are the most preferred ones.</Text>
                <Text style={{ marginLeft: 70 }}> We’re also looking at how the percentage of cyclists has increased over the past 10 years, illustrating how physical activity trends have changed. Other interesting findings are analysing the physical activity trends by season (i.e, do people tendto be more healthy in summer or winter?)
              </Text>
              </Flex>

            </div>
            <Section>Calendar Heatmap </Section>
            <CalendarView data={this.state.data} />
            <br /><br />
            <Section>Calendar Heatmap Results</Section>
            <Flex>
              <Text>After analysing the calendar heatmap from above, we can first notice that cycling hires have risen since the moment of the start of Santander service over the past 10 years. If you compare year 2011 and 2019, you can see a high increase over the whole calendar. (low opacity of green means few hires, while high opacity of green means high number of hires)</Text>
              <Text style={{ marginLeft: 70 }}>
                Another interesting fact that we noticed is that Spring and Summer periods usually tend to be more popular amongst cyclists. That's probably because of the good and dry weather. This data shows that people are more active in these periods.
              </Text>
            </Flex>
            <div style={{ height: "50px" }}></div>
            <Section>Circular Barplot</Section>
            <br /><br />
            <CircularDiagram data={this.state.data} />
            <br /><br />
            <Section>Circular Barplot Results</Section>
            <Flex>
              <Text>The purpose of the circular barplot is to provide a quick way of comparing opposite periods of time across the year. The first quarter on the top-right repreents the Spring season, bottom-right -- Summer, bottom-left -- Autumn and top-left -- Winter. For example, in year 2019 we can see an interesting difference between the hot and the cold seasons. Spring and Winter are less popular than Summer and Autumn.</Text>
              <Text style={{ marginLeft: 70 }}>
                Each bar on the circle represents data in a week of the year. We had to limit the visualisatoin and decided to use weeks instead of days to make data more readable. (days was too crowded).
              </Text>
            </Flex>
            <br /><br />
            <Section>Conclusion</Section>
            <Flex>
              <Text style={{ flexShrink: 2 }}>To conclude, it was intereseting to work with d3, and we're quite impressed with what we have achieved. d3 seems like a powerful library and has so many features! Further improvments to this project would involve making visualisations more interactive, adding legends(which we tried but with no success) and making the web application responsive. Moreover, the bar chart above the calendar heatmap seems to have a few alignment issues with the Months labels -- this could be improved in future versions.</Text>
              <Text style={{ marginLeft: 70 }}>
                <strong>King's Student Number</strong> K1763986
              </Text>
            </Flex>
            <div style={{ height: "100px" }}></div>
          </div>
        </div >
      )
    }
  }
}
