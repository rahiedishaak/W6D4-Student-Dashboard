import React, { Component } from 'react';
import './App.css';
import ChartAverage from '../ChartAverage/ChartAverage';

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
        return { id: index + 1, name: name, ratingsDifficulty: [], ratingsEnjoyment: [] };
      });

      // create exercises array for state
      const exerciseNames = data.reduce((exercises, current) => {
        if (!exercises.includes(current.exercise)) exercises.push(current.exercise);
        return exercises;
      }, []);

      const exercises = exerciseNames.map((name, index) => {
        return { id: index + 1, name: name, ratingsDifficulty: [], ratingsEnjoyment: [] };
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

  // Calculate average ratings
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
      };
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
    return (
      <div className="App">
        <ChartAverage
          avgDifficulty={this.calcAvgRatingDifficulty}
          avgEnjoyment={this.calcAvgRatingEnjoyment}
        />        
      </div>
    );
  }
}

export default App;