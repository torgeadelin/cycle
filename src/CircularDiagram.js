import React, { Component } from 'react'

// Data Visualisation Library
import * as d3 from "d3"

// UI libraries & Theme
import styled from 'styled-components'

// UI Components
import Button from './components/Button'
import Flex from './components/Flex'
import theme from './theme'

// Configuration variables
let HEATMAP = ["#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837"]

/**
 * Year buttons wrapper
 */
const Years = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    div {
        margin-top: 10px;
    }
`

const Season = styled.div`
    background-color: ${p => p.color};
    padding: 5px 10px;
`

/**
 * Circular Diagram Chart
 */
export default class CircularDiagram extends Component {
    constructor(props) {
        super(props)

        this.state = {
            currentYearIndex: 2,
        }

        this.grouped = []

    }

    /**
     * Get maximum value from all weeks
     */
    getMaxValue = () => {
        return d3.max(this.grouped.map(d => d.total))
    }

    /**
     * Group data by week
     */
    groupByWeek = (currentIndexYear) => {
        let grouped = d3.nest()
            .key(d => this.getWeekNumber(d.date))
            .entries(this.props.data[currentIndexYear].values)
        grouped.forEach(week => {
            week.total = week.values.reduce((prev, current) => prev + current.amount, 0)
        })
        return grouped
    }

    getWeekNumber = (d) => {
        // Copy date so don't modify original
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        // Get first day of year
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        // Calculate full weeks to nearest Thursday
        var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        // Return array of year and week number
        return weekNo
    }

    async componentDidMount() {

        console.log(this.getMaxValue())
        this.createCircularDiagram()
    }

    /**
     * Create Circular Diagram
     */
    createCircularDiagram = async () => {
        this.grouped = this.groupByWeek(this.state.currentYearIndex)

        // Create scale for color
        let color = d3.scaleQuantize()
            .domain([0, this.getMaxValue()])
            .range(HEATMAP);

        // Set the dimensions and margins of the graph
        var margin = { top: 100, right: 50, bottom: 100, left: 50 },
            width = 800 - margin.left - margin.right,
            height = 800 - margin.top - margin.bottom,
            innerRadius = 140,
            outerRadius = Math.min(width, height) / 2;

        // Apend the SVG object
        var svg = d3.select(".circularDiagram")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");


        // Create scale for x axis
        var x = d3.scaleBand()
            .range([0, 2 * Math.PI])
            .align(0)
            .domain(this.grouped.map((x, i) => i))

        // Create scale for y axis
        var y = d3.scaleLinear()
            .range([innerRadius, outerRadius])
            .domain([0, this.getMaxValue()])

        // Add the bars
        svg.append("g")
            .selectAll("path")
            .data(this.grouped)
            .enter()
            .append("path")
            .attr("fill", d => color(d.total))
            .attr("d", d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(d => y(d.total))
                .startAngle(function (d, i) { return x(i); })
                .endAngle(function (d, i) { return x(i) + x.bandwidth(); })
                .padAngle(0.01)
            )


        // Add labels to the circular graph
        svg.append("g")
            .selectAll("g")
            .data(this.grouped)
            .enter()
            .append("g")
            .attr("text-anchor", function (d, i) { return (x(i) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
            .attr("transform", function (d, i) { return "rotate(" + ((x(i) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + (y(d.total) + 50) + ",0)"; })
            .append("text")
            .text((d, i) => `Week ${i}`)
            .attr("transform", function (d, i) { return (x(i) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
            .style("font-size", "11px")
            .attr("alignment-baseline", "middle")


    }

    /**
     * Helper function to re-render Circular Diagram
     */
    removeCircularDiagram = () => {
        const circularDiagram = document.getElementsByClassName("circularDiagram")[0]
        while (circularDiagram.hasChildNodes())
            circularDiagram.removeChild(circularDiagram.lastChild);
    }

    /**
     * Called whenever the state changes -- user changes year
     * @param {*} prevProps 
     * @param {*} prevState 
     */
    componentDidUpdate(prevProps, prevState) {
        if (prevState.currentYearIndex !== this.state.currentYearIndex) {
            // re render circular diagram
            this.removeCircularDiagram()
            this.createCircularDiagram()
        }
    }

    render() {
        return (
            <div style={{ position: "relative" }}>
                <Flex justify="space-between">
                    <Season color="#c2d9ff">Winter</Season>
                    <Season color="#d0ffcf">Spring</Season>
                </Flex>

                <div style={{ display: "flex", justifyContent: "center" }} className="circularDiagram">
                </div>
                <Flex justify="space-between">
                    <Season color="#fff0cf">Autumn</Season>
                    <Season color="#ffcfcf">Summer</Season>
                </Flex>
                <br />
                <p>Select a year</p>
                <Years>{this.props.data.map((elem, i) => {
                    return (
                        <Button key={i} mr={2} small selected={this.state.currentYearIndex === elem.key - 2010} onClick={() => {
                            this.setState({ currentYearIndex: elem.key - 2010 })
                        }}>{elem.key}</Button>)
                })}</Years>
            </div >
        )
    }
}
