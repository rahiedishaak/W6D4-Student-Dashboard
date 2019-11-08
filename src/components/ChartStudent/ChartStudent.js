import React from 'react';
import { VictoryChart, VictoryBar, VictoryTooltip, VictoryGroup, VictoryLabel } from 'victory';

const chartStudent = props => {
  const student = props.state.students.find(student => student.name === props.name);

  const studentRatingsDifficulty = props.state.ratingsDifficulty.filter(rating => rating.studentID === student.id);
  const studentRatingsDifficultyForGraph = studentRatingsDifficulty.map(rating => {
    const exercise = props.state.exercises.find(exercise => exercise.id === rating.exerciseID);

    return {
      x: exercise.id,
      y: rating.ratingDifficulty,
      label: `${exercise.name}
      Moeilijkheid: ${rating.ratingDifficulty}`
    }
  });

  const studentRatingsEnjoyment = props.state.ratingsEnjoyment.filter(rating => rating.studentID === student.id);
  const studentRatingsEnjoymentForGraph = studentRatingsEnjoyment.map(rating => {
    const exercise = props.state.exercises.find(exercise => exercise.id === rating.exerciseID);

    return {
      x: exercise.id,
      y: rating.ratingEjoyment,
      label: `${exercise.name}
      Vermaak: ${rating.ratingEjoyment}`
    }
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

  return (
    <VictoryChart theme={wincTheme} height={350} width={800}>
      <VictoryLabel 
        text={'Beoordeling van alle opdrachten door ' + student.name}  
        x={400} y={25} 
        textAnchor="middle"
        style={{ fill: '#4a90e2', fontSize: 20 }} />
      <VictoryGroup offset={3}>
        <VictoryBar
          data={studentRatingsDifficultyForGraph} 
          labelComponent={
            <VictoryTooltip 
              cornerRadius={5}
              pointerLength={10}
              flyoutStyle={{ stroke: "none", fill: "#4a90e2" }} />} />
        <VictoryBar 
          data={studentRatingsEnjoymentForGraph} 
          labelComponent={
            <VictoryTooltip 
              cornerRadius={5}
              pointerLength={10}
              flyoutStyle={{ stroke: "none", fill: "#4a90e2" }} />} />
      </VictoryGroup>
    </VictoryChart>
  );
};

export default chartStudent;