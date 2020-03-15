import React from 'react'
import * as d3 from "d3"
import Button from './components/Button'
import theme from "./theme"
import cycles from "./data/cycles.csv"
import styled from 'styled-components'

let width = 1400,
    height = 300,
    cellSize = 25;

let heapmap_pink = ["#FD496D", "#CC548B", "#9661AC", "#7569C0", "#585695", "#504E80", "#434261"].reverse()
let heatmap_green = ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837"].reverse()
let heatmap_red = ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf"]

const Years = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    div {
        margin-top: 10px;
    }
`

export default class CalendarView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            maxValue: 0,
            currentYearIndex: 1,
            data: []
        }
    }

    createCalendarView = () => {
        let color = d3.scaleQuantize()
            .domain([0, this.getMaxValue()])
            .range(heatmap_green);

        var svg = d3.select("body")
            .selectAll(".calendarView")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height * 1])
            .attr("font-family", "sans-serif")
            .attr("font-size", 12)
            .attr("color", theme.colors.black)

        var year = svg.selectAll("g")
            .data([this.state.data[this.state.currentYearIndex]])
            .join("g")
            .attr("transform", (d, i) => `translate(40,${height * i + cellSize * 1.5})`)

        // year
        year.append("text")
            .attr("x", -5)
            .attr("y", -5)
            .attr("font-weight", "bold")
            .attr("text-anchor", "end")
            .attr("fill", theme.colors.black)
            .text((d) => d.key);

        // Week days on the column
        year.append("g")
            .attr("text-anchor", "end")
            .selectAll("text")
            .data(d3.range(7).map(i => new Date(1995, 0, i)))
            .join("text")
            .attr("x", -5)
            .attr("y", d => (((d.getUTCDay() + 6) % 7) + 0.5) * cellSize)
            .attr("dy", "0.31em")
            .attr("fill", theme.colors.black)
            .text(d => "SMTWTFS"[d.getUTCDay()])


        year.append("g")
            .selectAll("rect")
            .data((d) => {
                return d.values
            })
            .join("rect")
            .attr("width", cellSize - 1)
            .attr("height", cellSize - 1)
            .attr("x", d => d3.utcMonday.count(d3.utcYear(d.date), d.date) * cellSize + 0.5)
            .attr("y", d => (((d.date.getUTCDay() + 6) % 7) * cellSize + 0.5))
            .attr("fill", d => color(d.amount))
            .append("title")
            .text(d => d.date + "\n" + d.amount)

        let month = year.append("g")
            .selectAll("g")
            .data((d) => d3.utcMonths(d3.utcMonth(d.values[0].date), d.values[d.values.length - 1].date))
            .join("g");

        month.filter((d, i) => i).append("path")
            .attr("fill", "none")
            .attr("stroke", "#ffffff")
            .attr("stroke-width", 2.5)
            .attr("d", this.pathMonth);

        month.append("text")
            .attr("x", d => d3.utcSunday.count(d3.utcYear(d), d3.utcSunday.ceil(d)) * cellSize + 2)
            .attr("y", -5)
            .attr("fill", theme.colors.black)
            .text(d3.utcFormat("%b"));

    }

    pathMonth = (t) => {
        const n = 7
        const d = Math.max(0, Math.min(n, (t.getUTCDay() + 6) % 7))
        const w = d3.utcMonday.count(d3.utcYear(t), t);
        return `${d === 0 ? `M${w * cellSize},0`
            : d === n ? `M${(w + 1) * cellSize},0`
                : `M${(w + 1) * cellSize},0V${d * cellSize}H${w * cellSize}`}V${n * cellSize}`;
    }

    getMaxValue = () => {
        return d3.max(
            this.state.data.reduce((prev, next) => {
                return prev.concat(next.values)
            }, []),
            x => x.amount)
    }

    async componentDidMount() {
        let data_ = await this.loadData(cycles)
        this.setState({ data: data_ }, () => {
            this.createCalendarView()
        })
    }

    removePreviousCalendarView = () => {
        const chart = document.getElementsByClassName("calendarView")[0];
        while (chart.hasChildNodes())
            chart.removeChild(chart.lastChild);
    }


    componentDidUpdate(prevProps, prevState) {
        if (prevState.currentYearIndex !== this.state.currentYearIndex) {
            this.removePreviousCalendarView()
            this.createCalendarView()
        }

    }

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

    render() {
        return (
            <div>
                <div className="calendarView">
                </div>
                <p>Select a year</p>
                <Years>{this.state.data.map(elem => {
                    return (
                        <Button mr={2} small selected={this.state.currentYearIndex === elem.key - 2010} onClick={() => {
                            this.setState({ currentYearIndex: elem.key - 2010 })
                        }}>{elem.key}</Button>)
                })}</Years>

            </div >


        )
    }

}










