import React, { Component } from 'react';
import './App.css';
import { VictoryChart, VictoryBar, VictoryVoronoiContainer, VictoryTooltip } from 'victory';

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
          ratingDifficulty: element.ratingEnjoyment,
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

  render() {
    const avgRatingsDifficulty = this.calcAvgRatingDifficulty();
    const avgRatingsDifficultyForGraph = avgRatingsDifficulty.map(rating => {
      return {
        x: rating.exercise,
        y: rating.rating,
        label: `${rating.exerciseName} | ${rating.rating}`
      };
    });

    return (
      <div className="App">
        <VictoryChart>
          <VictoryBar 
            data={avgRatingsDifficultyForGraph} 
            labelComponent={<VictoryTooltip />}
          />
        </VictoryChart> 
      </div>
    );
  }
}

export default App;