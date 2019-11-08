import React from 'react';
import { VictoryChart, VictoryBar, VictoryTooltip, VictoryGroup, VictoryLabel } from 'victory';

const chartAverage = props => {
  const avgRatingsDifficulty = props.avgDifficulty();
  const avgRatingsDifficultyForGraph = avgRatingsDifficulty.map(rating => {
    return {
      x: rating.exerciseID,
      y: rating.rating,
      label: `${rating.exerciseName}
      Moeilijkheid: ${rating.rating}`
    };
  });

  const avgRatingsEnjoyment = props.avgEnjoyment();
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
        data: { strokeWidth: 1 },
        labels: { fontSize: 10, fill: "#fff" }
      }
    },
    group: {
      colorScale: ["#4a90e2", "#000099"]
    }
  };

  return (
    <VictoryChart theme={wincTheme} height={350} width={800}>
      <VictoryLabel 
        text="Gemiddelde beoordeling van alle opdrachten" 
        x={400} y={25} 
        textAnchor="middle"
        style={{ fill: '#4a90e2', fontSize: 20 }} />
      <VictoryGroup offset={3}>
        <VictoryBar 
          data={avgRatingsDifficultyForGraph} 
          labelComponent={
            <VictoryTooltip 
              cornerRadius={5}
              pointerLength={10}
              flyoutStyle={{ stroke: "none", fill: "#4a90e2" }} />} />
        <VictoryBar 
          data={avgRatingsEnjoymentForGraph} 
          labelComponent={
            <VictoryTooltip 
              cornerRadius={5}
              pointerLength={10}
              flyoutStyle={{ stroke: "none", fill: "#4a90e2" }} />} />
      </VictoryGroup>
    </VictoryChart>
  );
};

export default chartAverage;