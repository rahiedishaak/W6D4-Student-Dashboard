import React, { Component } from 'react';
import './App.css';
import { VictoryChart, VictoryBar, VictoryTooltip, VictoryGroup, VictoryLabel } from 'victory';

class App extends Component {
  state = {
    students: [],
    exercises: [],
    ratingsDifficulty: [],
    ratingsEnjoyment: []
  };

  async componentDidMount() {
    try {
      const response = await fetch('https://student-dashboard-9ac2a.firebaseio.com/exercises.json');
      let data = await response.json();
      data = data['-Lt4Y_5GbmJ2k9qGkfHC'];
      
      // create students array for state
      const studentNames = data.reduce((names, current) => {
        if (!names.includes(current.name)) names.push(current.name);
        return names;
      }, []);

      const students = studentNames.map((name, index) => {
        return {
          id: index + 1,
          name: name,
          ratingsDifficulty: [],
          ratingsEnjoyment: []
        };
      });

      // create exercises array for state
      const exerciseNames = data.reduce((names, current) => {
        if (!names.includes(current.exercise)) names.push(current.exercise);
        return names;
      }, []);

      const exercises = exerciseNames.map((name, index) => {
        return {
          id: index + 1,
          name: name,
          ratingsDifficulty: [],
          ratingsEnjoyment: []
        };
      });
      
      // create ratingsDifficulty array for state
      const ratingsDifficulty = data.map((element, index) => {
        const student = students.find(student => student.name === element.name);
        const studentID = student.id;

        const exercise = exercises.find(exercise => exercise.name === element.exercise);
        const exerciseID = exercise.id;

        const newRating = {
          id: index + 1,
          ratingDifficulty: element.ratingDifficulty,
          studentID: studentID,
          exerciseID: exerciseID
        };
        
        student.ratingsDifficulty.push(newRating.id);
        exercise.ratingsDifficulty.push(newRating.id);

        return newRating;
      });

      // create ratingsEnjoyment array for state
      const ratingsEnjoyment = data.map((element, index) => {
        const student = students.find(student => student.name === element.name);
        const studentID = student.id;

        const exercise = exercises.find(exercise => exercise.name === element.exercise);
        const exerciseID = exercise.id;

        const newRating = {
          id: index + 1,
          ratingEjoyment: element.ratingEnjoyment,
          studentID: studentID,
          exerciseID: exerciseID
        };

        student.ratingsEnjoyment.push(newRating.id);
        exercise.ratingsEnjoyment.push(newRating.id);

        return newRating;
      });

      // set state
      this.setState({
        students: students,
        exercises: exercises,
        ratingsDifficulty: ratingsDifficulty,
        ratingsEnjoyment: ratingsEnjoyment
      });
    } catch (error) {
      console.log(error);
    }
  }

  calcAvgRatingDifficulty = () => {
    const exercises = [...this.state.exercises];
    const ratingsDifficulty = [...this.state.ratingsDifficulty];

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
      }
    });
  };

  calcAvgRatingEnjoyment = () => {
    const exercises = [...this.state.exercises];
    const ratingsEnjoyment = [...this.state.ratingsEnjoyment];

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
          data: { strokeWidth: 1 },
          labels: { fontSize: 8, fill: "#455A64" }
        }
      },
      group: {
        colorScale: ["#4a90e2", "#000099"]
      },
    };

    return (
      <div className="App">
        <VictoryChart theme={wincTheme} height={350} width={800}>
          <VictoryLabel 
            text="Gemiddelde beoordeling van alle opdrachten" 
            x={400} y={30} 
            textAnchor="middle"
            style={{ fill: '#4a90e2', fontSize: 18 }}  
          />
          <VictoryGroup offset={3}>
            <VictoryBar 
              data={avgRatingsDifficultyForGraph} 
              labelComponent={
                <VictoryTooltip 
                  cornerRadius={5}
                  pointerLength={10}
                  flyoutStyle={{ stroke: "none", fill: "#4a90e2" }}
                />
              }
            />
            <VictoryBar 
              data={avgRatingsEnjoymentForGraph} 
              labelComponent={
                <VictoryTooltip 
                  cornerRadius={5}
                  pointerLength={10}
                  flyoutStyle={{ stroke: "none", fill: "#4a90e2" }}
                />
              }
            />
          </VictoryGroup>
        </VictoryChart> 
      </div>
    );
  }
}

export default App;