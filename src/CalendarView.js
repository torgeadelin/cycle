import React from 'react'

// Data Visualisation Library
import * as d3 from 'd3'

// UI libraries & Theme
import theme from './theme';
import styled from 'styled-components'

// UI Components
import Button from './components/Button'


// Configuration variables
let WIDTH = 1400,
    HEIGHT = 300,
    CELL_SIZE = 25;

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

/**
 * Calendar Heatmap Data Visualisation
 */
export default class CalendarView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            maxValue: 0,
            currentYearIndex: 1,
        }
    }
    /**
     * Create calendar view heat map
     * Implementation inspired from https://observablehq.com/@d3/calendar-view
     */
    createCalendarView = () => {
        // Create scale for color heat map
        let color = d3.scaleQuantize()
            .domain([0, this.getMaxValue()])
            .range(HEATMAP)


        // Create SVG
        var svg = d3.select("body")
            .selectAll(".calendarView")
            .append("svg")
            .attr("width", WIDTH)
            .attr("height", HEIGHT)
            .attr("viewBox", [0, 0, WIDTH, HEIGHT])
            .attr("font-family", "sans-serif")
            .attr("font-size", 12)
            .attr("color", theme.colors.black)

        // Create Year label
        var year = svg.selectAll("g")
            .data([this.props.data[this.state.currentYearIndex]])
            .join("g")
            .attr("transform", (d, i) => `translate(40, ${HEIGHT * i + CELL_SIZE * 1.5})`)
        year.append("text")
            .attr("x", -5)
            .attr("y", - 5)
            .attr("font-weight", "bold")
            .attr("text-anchor", "end")
            .attr("fill", theme.colors.black)
            .text((d) => d.key)

        // Week days on the column
        year.append("g")
            .attr("text-anchor", "end")
            .selectAll("text")
            .data(d3.range(7).map(i => new Date(1995, 0, i)))
            .join("text")
            .attr("x", -5)
            .attr("y", d => (((d.getUTCDay() + 6) % 7) + 0.5) * CELL_SIZE)
            .attr("dy", "0.31em")
            .attr("fill", theme.colors.black)
            .text(d => "SMTWTFS"[d.getUTCDay()])

        // Fill cells
        year.append("g")
            .selectAll("rect")
            .data((d) => d.values)
            .join("rect")
            .attr("width", CELL_SIZE - 1)
            .attr("height", CELL_SIZE - 1)
            .attr("x", d => d3.utcMonday.count(d3.utcYear(d.date), d.date) * CELL_SIZE + 0.5)
            .attr("y", d => (((d.date.getUTCDay() + 6) % 7) * CELL_SIZE + 0.5))
            .style("fill", d => color(d.amount))
            .append("title")
            .text(d => d.date + "\n" + d.amount)

        // Add month labels
        let month = year.append("g")
            .selectAll("g")
            .data((d) => d3.utcMonths(d3.utcMonth(d.values[0].date), d.values[d.values.length - 1].date))
            .join("g");

        // Add path to separate months
        month.filter((d, i) => i).append("path")
            .attr("fill", "none")
            .attr("stroke", theme.colors.white)
            .attr("stroke-width", 2.5)
            .attr("d", this.pathMonth);

        // Add month text 
        month.append("text")
            .attr("x", d => d3.utcSunday.count(d3.utcYear(d), d3.utcSunday.ceil(d)) * CELL_SIZE + 2)
            .attr("y", - 5)
            .attr("fill", theme.colors.black)
            .text(d3.utcFormat("%b"))

    }

    /**
     * Create bar chart on top of calendar heat map
     */
    createBarChartTop = () => {

        // Create scale for bar chart
        let y = d3.scaleLinear()
            .domain([0, d3.max(this.groupByMonth(this.state.currentYearIndex), d => d.total)]).nice()
            .range([0, 100])

        // Create SVG for bar chart
        let svg = d3.select("body")
            .selectAll(".barChartTop")
            .append("svg")
            .attr("width", WIDTH)
            .attr("height", HEIGHT / 2)
            .attr("viewBox", [0, 0, WIDTH, HEIGHT / 2])
            .attr("font-family", "sans-serif")
            .attr("font-size", 12)
            .attr("color", theme.colors.black)
            .attr("transform", "scale(1, -1)")

        // Add bars 
        svg.selectAll("g")
            .data(this.groupByMonth(this.state.currentYearIndex))
            .enter()
            .append("rect")
            .attr("x", d => 40 + d3.utcSunday.count(d3.utcYear(new Date(2011, d.key, 1)), d3.utcSunday.ceil(new Date(2011, d.key, 1))) * CELL_SIZE + 2)
            .attr("y", - 5)
            .attr("width", 20)
            .attr("height", d => y(d.total))
            .attr("fill", theme.colors.green)

    }
    /**
     * Create path separating months
     */
    pathMonth = (t) => {
        const n = 7
        const d = Math.max(0, Math.min(n, (t.getUTCDay() + 6) % 7))
        const w = d3.utcMonday.count(d3.utcYear(t), t);
        return `${d === 0 ? `M${w * CELL_SIZE},0`
            : d === n ? `M${(w + 1) * CELL_SIZE},0`
                : `M${(w + 1) * CELL_SIZE},0V${d * CELL_SIZE}H${w * CELL_SIZE}`}V${n * CELL_SIZE}`;
    }

    /**
     * Get max value in data set
     */
    getMaxValue = () => {
        return d3.max(
            this.props.data.reduce((prev, next) => {
                return prev.concat(next.values)
            }, []),
            elem => elem.amount)
    }
    componentDidMount() {
        this.createBarChartTop()
        this.createCalendarView()
    }

    /**
     * Helper function to re-render Calendar View
     */
    removePreviousCalendarView = () => {
        const chart = document.getElementsByClassName("calendarView")[0];
        while (chart.hasChildNodes())
            chart.removeChild(chart.lastChild);
    }

    /**
     * Helper function to re-render Bar Chart View
     */
    removePreviousBarChartView = () => {
        const barChart = document.getElementsByClassName("barChartTop")[0]
        while (barChart.hasChildNodes())
            barChart.removeChild(barChart.lastChild);
    }

    /**
     * Called whenever the state changes -- user changes year
     * @param {*} prevProps 
     * @param {*} prevState 
     */
    componentDidUpdate(prevProps, prevState) {
        if (prevState.currentYearIndex !== this.state.currentYearIndex) {
            // re render calendar heat map
            this.removePreviousCalendarView()
            this.createCalendarView()

            // re render bar chart
            this.removePreviousBarChartView()
            this.createBarChartTop()
        }
    }

    /**
     * Group data by month 
     */
    groupByMonth = (currentIndexYear) => {
        let grouped = d3.nest()
            .key(d => d.date.getMonth())
            .entries(this.props.data[currentIndexYear].values)
        grouped.forEach(month => {
            month.total = month.values.reduce((prev, current) => prev + current.amount, 0)
        })
        return grouped
    }

    render() {
        return (
            <div>
                <div className="barChartTop"></div>
                <div className="calendarView"></div>
                <div className="legeng"></div>
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










