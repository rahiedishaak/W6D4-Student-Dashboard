import React, { Component } from 'react';
import './App.css';
import { VictoryChart, VictoryBar, VictoryTooltip, VictoryGroup } from 'victory';

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
        label: `${rating.exerciseName} | ${rating.rating}`
      };
    });

    const avgRatingsEnjoyment = this.calcAvgRatingEnjoyment();
    const avgRatingsEnjoymentForGraph = avgRatingsEnjoyment.map(rating => {
      return {
        x: rating.exerciseID,
        y: rating.rating,
        label: `${rating.exerciseName} | ${rating.rating}`
      };
    });

    const wincTheme = {
      area: {
        style: {
          data: {
            fill: "#212121"
          },
          labels: {
            fontFamily: "'Roboto', 'Helvetica Neue', Helvetica, sans-serif",
            fontSize: 12,
            letterSpacing: "normal",
            padding: 8,
            fill: "#455A64",
            stroke: "transparent",
            strokeWidth: 0
          }
        },
        width: 350,
        height: 350,
        padding: 50
      },
      axis: {
        style: {
          axis: {
            fill: "transparent",
            stroke: "#90A4AE",
            strokeWidth: 2,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          },
          axisLabel: {
            textAnchor: "middle",
            fontFamily: "'Roboto', 'Helvetica Neue', Helvetica, sans-serif",
            fontSize: 12,
            letterSpacing: "normal",
            padding: 8,
            fill: "#455A64",
            stroke: "transparent",
            strokeWidth: 0
          },
          grid: {
            fill: "none",
            stroke: "none"
          },
          ticks: {
            fill: "transparent",
            size: 5,
            stroke: "#90A4AE",
            strokeWidth: 1,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          },
          tickLabels: {
            fontFamily: "'Roboto', 'Helvetica Neue', Helvetica, sans-serif",
            fontSize: 12,
            letterSpacing: "normal",
            padding: 8,
            fill: "#455A64",
            stroke: "transparent",
            strokeWidth: 0
          }
        },
        width: 350,
        height: 350,
        padding: 50
      },
      bar: {
        style: {
          data: {
            fill: "#4a90e2",
            padding: 0,
            strokeWidth: 0
          },
          labels: {
            fontFamily: "'Roboto', 'Helvetica Neue', Helvetica, sans-serif",
            fontSize: 8,
            letterSpacing: "normal",
            padding: 8,
            fill: "#455A64",
            stroke: "transparent",
            strokeWidth: 0
          }
        },
        width: 350,
        height: 350,
        padding: 20
      },
      boxplot: {
        style: {
          max: {
            padding: 8,
            stroke: "#455A64",
            strokeWidth: 1
          },
          maxLabels: {
            fontFamily: "'Roboto', 'Helvetica Neue', Helvetica, sans-serif",
            fontSize: 12,
            letterSpacing: "normal",
            padding: 8,
            fill: "#455A64",
            stroke: "transparent",
            strokeWidth: 0
          },
          median: {
            padding: 8,
            stroke: "#455A64",
            strokeWidth: 1
          },
          medianLabels: {
            fontFamily: "'Roboto', 'Helvetica Neue', Helvetica, sans-serif",
            fontSize: 12,
            letterSpacing: "normal",
            padding: 8,
            fill: "#455A64",
            stroke: "transparent",
            strokeWidth: 0
          },
          min: {
            padding: 8,
            stroke: "#455A64",
            strokeWidth: 1
          },
          minLabels: {
            fontFamily: "'Roboto', 'Helvetica Neue', Helvetica, sans-serif",
            fontSize: 12,
            letterSpacing: "normal",
            padding: 8,
            fill: "#455A64",
            stroke: "transparent",
            strokeWidth: 0
          },
          q1: {
            padding: 8,
            fill: "#455A64"
          },
          q1Labels: {
            fontFamily: "'Roboto', 'Helvetica Neue', Helvetica, sans-serif",
            fontSize: 12,
            letterSpacing: "normal",
            padding: 8,
            fill: "#455A64",
            stroke: "transparent",
            strokeWidth: 0
          },
          q3: {
            padding: 8,
            fill: "#455A64"
          },
          q3Labels: {
            fontFamily: "'Roboto', 'Helvetica Neue', Helvetica, sans-serif",
            fontSize: 12,
            letterSpacing: "normal",
            padding: 8,
            fill: "#455A64",
            stroke: "transparent",
            strokeWidth: 0
          }
        },
        boxWidth: 20,
        width: 350,
        height: 350,
        padding: 50
      },
      candlestick: {
        style: {
          data: {
            stroke: "#455A64"
          },
          labels: {
            fontFamily: "'Roboto', 'Helvetica Neue', Helvetica, sans-serif",
            fontSize: 12,
            letterSpacing: "normal",
            padding: 8,
            fill: "#455A64",
            stroke: "transparent",
            strokeWidth: 0
          }
        },
        candleColors: {
          positive: "#ffffff",
          negative: "#455A64"
        },
        width: 350,
        height: 350,
        padding: 50
      },
      chart: {
        width: 800,
        height: 300,
        padding: 50
      },
      errorbar: {
        borderWidth: 8,
        style: {
          data: {
            fill: "transparent",
            opacity: 1,
            stroke: "#455A64",
            strokeWidth: 2
          },
          labels: {
            fontFamily: "'Roboto', 'Helvetica Neue', Helvetica, sans-serif",
            fontSize: 12,
            letterSpacing: "normal",
            padding: 8,
            fill: "#455A64",
            stroke: "transparent",
            strokeWidth: 0
          }
        },
        width: 350,
        height: 350,
        padding: 50
      },
      group: {
        colorScale: [
          "#F4511E",
          "#FFF59D",
          "#DCE775",
          "#8BC34A",
          "#00796B",
          "#006064"
        ],
        width: 350,
        height: 350,
        padding: 50
      },
      legend: {
        colorScale: [
          "#F4511E",
          "#FFF59D",
          "#DCE775",
          "#8BC34A",
          "#00796B",
          "#006064"
        ],
        gutter: 10,
        orientation: "vertical",
        titleOrientation: "top",
        style: {
          data: {
            type: "circle"
          },
          labels: {
            fontFamily: "'Roboto', 'Helvetica Neue', Helvetica, sans-serif",
            fontSize: 12,
            letterSpacing: "normal",
            padding: 8,
            fill: "#455A64",
            stroke: "transparent",
            strokeWidth: 0
          },
          title: {
            fontFamily: "'Roboto', 'Helvetica Neue', Helvetica, sans-serif",
            fontSize: 12,
            letterSpacing: "normal",
            padding: 5,
            fill: "#455A64",
            stroke: "transparent",
            strokeWidth: 0
          }
        }
      },
      line: {
        style: {
          data: {
            fill: "transparent",
            opacity: 1,
            stroke: "#455A64",
            strokeWidth: 2
          },
          labels: {
            fontFamily: "'Roboto', 'Helvetica Neue', Helvetica, sans-serif",
            fontSize: 12,
            letterSpacing: "normal",
            padding: 8,
            fill: "#455A64",
            stroke: "transparent",
            strokeWidth: 0
          }
        },
        width: 350,
        height: 350,
        padding: 50
      },
      pie: {
        colorScale: [
          "#F4511E",
          "#FFF59D",
          "#DCE775",
          "#8BC34A",
          "#00796B",
          "#006064"
        ],
        style: {
          data: {
            padding: 8,
            stroke: "#ECEFF1",
            strokeWidth: 1
          },
          labels: {
            fontFamily: "'Roboto', 'Helvetica Neue', Helvetica, sans-serif",
            fontSize: 12,
            letterSpacing: "normal",
            padding: 20,
            fill: "#455A64",
            stroke: "transparent",
            strokeWidth: 0
          }
        },
        width: 350,
        height: 350,
        padding: 50
      },
      scatter: {
        style: {
          data: {
            fill: "#455A64",
            opacity: 1,
            stroke: "transparent",
            strokeWidth: 0
          },
          labels: {
            fontFamily: "'Roboto', 'Helvetica Neue', Helvetica, sans-serif",
            fontSize: 12,
            letterSpacing: "normal",
            padding: 8,
            fill: "#455A64",
            stroke: "transparent",
            strokeWidth: 0
          }
        },
        width: 350,
        height: 350,
        padding: 50
      },
      stack: {
        colorScale: [
          "#F4511E",
          "#FFF59D",
          "#DCE775",
          "#8BC34A",
          "#00796B",
          "#006064"
        ],
        width: 350,
        height: 350,
        padding: 50
      },
      tooltip: {
        style: {
          fontFamily: "'Roboto', 'Helvetica Neue', Helvetica, sans-serif",
          fontSize: 12,
          letterSpacing: "normal",
          padding: 5,
          fill: "#455A64",
          stroke: "transparent",
          strokeWidth: 0,
          pointerEvents: "none"
        },
        flyoutStyle: {
          stroke: "#212121",
          strokeWidth: 1,
          fill: "#f0f0f0",
          pointerEvents: "none"
        },
        cornerRadius: 5,
        pointerLength: 10
      },
      voronoi: {
        style: {
          data: {
            fill: "transparent",
            stroke: "transparent",
            strokeWidth: 0
          },
          labels: {
            fontFamily: "'Roboto', 'Helvetica Neue', Helvetica, sans-serif",
            fontSize: 12,
            letterSpacing: "normal",
            padding: 5,
            fill: "#455A64",
            stroke: "transparent",
            strokeWidth: 0,
            pointerEvents: "none"
          },
          flyout: {
            stroke: "#212121",
            strokeWidth: 1,
            fill: "#f0f0f0",
            pointerEvents: "none"
          }
        },
        width: 350,
        height: 350,
        padding: 50
      }
    };
    

    return (
      <div className="App">
        <VictoryChart theme={wincTheme}>
          <VictoryGroup offset={2}>
            <VictoryBar 
              data={avgRatingsDifficultyForGraph} 
              labelComponent={<VictoryTooltip />}
            />
            <VictoryBar 
              data={avgRatingsEnjoymentForGraph} 
              labelComponent={<VictoryTooltip />}
            />
          </VictoryGroup>
        </VictoryChart> 
      </div>
    );
  }
}

export default App;