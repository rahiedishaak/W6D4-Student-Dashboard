import React, { Component } from 'react';
import './App.css';
import { Switch, Route, NavLink } from 'react-router-dom';
import ChartAverage from '../ChartAverage/ChartAverage';
import ChartStudent from '../ChartStudent/ChartStudent';

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

  render() {
    const styleUl = {
      listStyleType: 'none',
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '20px'
    };

    const styleLi = {
      border: '1px solid #ccc',
      boxShadow: '0 2px 2px #eee',
      padding: '10px',
      marginLeft: '10px'
    };

    const styleLiFirst = {
      border: '1px solid #ccc',
      boxShadow: '0 2px 2px #eee',
      padding: '10px',
      marginLeft: '0'
    };

    return (
      <div className="App">
        <h1 style={{ color: '#4a90e2' }}>Winc Academy Student Dashboard</h1>
        <Switch>
          <Route 
            path="/" exact
            render={props => <ChartAverage {...props} state={{...this.state}} />} 
          />
          {this.state.students.map(student => (
            <Route 
              path={"/" + student.name.toLowerCase()} exact key={student.id}
              render={props => <ChartStudent {...props} name={student.name} state={{...this.state}} />}
            />
          ))}
        </Switch>
        <nav>
          <p>Overzicht per student:</p>
          <ul style={styleUl}>
            {this.state.students.map((student, index) => (
              <li key={student.id} style={index !== 0 ? styleLi : styleLiFirst}>
                <NavLink to={"/" + student.name.toLowerCase()}>{student.name}</NavLink>
              </li>
            ))}
            <li style={styleLi}>
              <NavLink to={"/"} exact>Voorpagina</NavLink>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default App;