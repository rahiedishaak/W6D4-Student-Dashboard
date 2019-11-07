import React, { Component } from 'react';
import './App.css';

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

        return {
          id: index + 1,
          ratingDifficulty: element.ratingDifficulty,
          studentID: studentID,
          exerciseID: exerciseID
        };
      });

      // create ratingsEnjoyment array for state
      const ratingsEnjoyment = data.map((element, index) => {
        const student = students.find(student => student.name === element.name);
        const studentID = student.id;

        const exercise = exercises.find(exercise => exercise.name === element.exercise);
        const exerciseID = exercise.id;

        return {
          id: index + 1,
          ratingDifficulty: element.ratingEnjoyment,
          studentID: studentID,
          exerciseID: exerciseID
        };
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

  render() {
    return (
      <div className="App"></div>
    );
  }
}

export default App;