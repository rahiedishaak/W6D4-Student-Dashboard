import React, { Component } from 'react';
import { VictoryChart, VictoryBar, VictoryTooltip, VictoryGroup, VictoryLabel } from 'victory';

class ChartAverage extends Component {
  state = {
    filter: 'all'
  }

  filterChangeHandler = event => {
    this.setState({ filter: event.target.value });
  };

  calcAvgRatingDifficulty = () => {
    const exercises = [...this.props.state.exercises];
    const ratingsDifficulty = [...this.props.state.ratingsDifficulty];

    return exercises.map(exercise => {
      const exerciseRatingDifficulty = ratingsDifficulty.filter(rating => rating.exerciseID === exercise.id);
      const totalRatingDifficulty = exerciseRatingDifficulty.reduce((total, current) => {
        return total + current.ratingDifficulty 
      }, 0);
      const avgRatingDifficulty = totalRatingDifficulty / exerciseRatingDifficulty.length;

      return {
        exerciseID: exercise.id,
        exerciseName: exercise.name,
        rating: avgRatingDifficulty
      };
    });
  };

  calcAvgRatingEnjoyment = () => {
    const exercises = [...this.props.state.exercises];
    const ratingsEnjoyment = [...this.props.state.ratingsEnjoyment];

    return exercises.map(exercise => {
      const exerciseRatingEnjoyment = ratingsEnjoyment.filter(rating => rating.exerciseID === exercise.id);
      const totalRatingEnjoyment = exerciseRatingEnjoyment.reduce((total, current) => {
        return total + current.ratingEjoyment 
      }, 0);
      const avgRatingEnjoyment = totalRatingEnjoyment / exerciseRatingEnjoyment.length;

      return {
        exerciseID: exercise.id,
        exerciseName: exercise.name,
        rating: avgRatingEnjoyment
      };
    });
  };

  render() {
    const avgRatingsDifficulty = this.calcAvgRatingDifficulty();
    const avgRatingsDifficultyForGraph = avgRatingsDifficulty.map(rating => {
      return {
        x: rating.exerciseID,
        y: rating.rating,
        label: `${rating.exerciseName}
        Moeilijkheid: ${rating.rating}`
      };
    });

    const avgRatingsEnjoyment = this.calcAvgRatingEnjoyment();
    const avgRatingsEnjoymentForGraph = avgRatingsEnjoyment.map(rating => {
      return {
        x: rating.exerciseID,
        y: rating.rating,
        label: `${rating.exerciseName}
        Vermaak: ${rating.rating}`
      };
    });

    const wincTheme = {
      axis: {
        style: {
          axis: { stroke: "#4a90e2", strokeWidth: 2 },
          grid: { stroke: "none" },
          ticks: { size: 5, stroke: "#4a90e2", strokeWidth: 3 },
          tickLabels: { padding: 3, fontSize: 10, fill: "#4a90e2" }
        }
      },
      bar: {
        style: {
          data: { fill: "#4a90e2", strokeWidth: 0 },
          labels: { fontSize: 10, fill: "#fff" },
        }
      },
      group: { colorScale: ["#4a90e2", "#000099"] }
    };

    const chartDifficulty = <VictoryBar
      data={avgRatingsDifficultyForGraph} 
      labelComponent={
        <VictoryTooltip 
          cornerRadius={5}
          pointerLength={10}
          flyoutStyle={{ stroke: "none", fill: "#4a90e2" }} />} />

    const chartEnjoyment = <VictoryBar 
      data={avgRatingsEnjoymentForGraph} 
      labelComponent={
        <VictoryTooltip 
          cornerRadius={5}
          pointerLength={10}
          flyoutStyle={{ stroke: "none", fill: "#4a90e2" }} />} />

    const chartBoth = <VictoryGroup offset={3}>
      {chartDifficulty}
      {chartEnjoyment}
    </VictoryGroup>

    let chart = null;

    if (this.state.filter === 'all') chart = chartBoth;
    else if (this.state.filter === 'difficulty') chart = chartDifficulty;
    else if (this.state.filter === 'enjoyment') chart = chartEnjoyment

    return (
      <>
        <form onChange={this.filterChangeHandler} style={{ marginTop: '30px' }}>
          <label style={{ marginRight: '30px' }}>
            <input type="radio" name="filter" value="difficulty" /> Moeilijkheid
          </label>
          <label style={{ marginRight: '30px' }}>
            <input type="radio" name="filter" value="enjoyment" /> Vermaak
          </label>
          <label>
            <input type="radio" name="filter" value="all" defaultChecked /> Beide
          </label>
        </form>

        <form style={{ marginTop: '20px' }}>
          {this.props.state.students.map((student, index) => (
            <label key={index} style={index !== 0 ? {marginLeft: '20px'} : null}>
              <input 
                type="checkbox" 
                name="filterStudent" 
                value={student.name.toLowerCase()}
                defaultChecked /> {student.name}
            </label>
          ))}                    
        </form>

        <VictoryChart theme={wincTheme} height={350} width={800}>
          <VictoryLabel 
            text="Gemiddelde beoordeling van alle opdrachten" 
            x={400} y={25} 
            textAnchor="middle"
            style={{ fill: '#4a90e2', fontSize: 20 }} />
          {chart}
        </VictoryChart>
      </>
    );
  }
}

export default ChartAverage;