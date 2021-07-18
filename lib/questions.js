const inquirer = require('inquirer');
const chalk = require("chalk");
const Queries = require('./sqlQueries');



class Questions {
  constructor() {
    this.handleQueries = new Queries(this);
  }

  startDB() {
    this.handleQueries.openConnection();
  }

  closeDB() {
    this.handleQueries.endConnection();
  }

  navQuestion() {
    inquirer
      .prompt([
        {
          // EDIT COLORS TO RGB BLUE THEME
          name: 'nav',
          type: 'list',
          message: chalk `{yellow What would you like to do?}`,
          choices: [chalk`{cyan View All Employees}`, chalk`{cyan View Employees By Department}`, chalk`{cyan View Employees By Manager}`, chalk `{blue Add Employee}`, chalk `{red Remove Employee}`, chalk `{magenta Update Employee Role}`, chalk `{magenta Update Employee Manager}`]
        }
      ])
      .then((answers) => {
        switch(answers.nav){
          case chalk`{cyan View All Employees}`:
            this.viewAll();
            break;
          case chalk`{cyan View Employees By Department}`:
            this.handleQueries.getDepartmentChoices();
            break;
          case chalk`{cyan View Employees By Manager}`:
            this.handleQueries.getManagerChoices();
            break;
          default:
            console.log('UNDER CONSTRUCTION'); 
        }

      });
  }

  viewAll() {
    this.handleQueries.displayEmployeeAll();

  }

  viewDepartment(choiceList) {
    inquirer
      .prompt([
        {
          name: 'byDepartment',
          type: 'list',
          message: chalk `{yellow Which department would you like to see employees for?}`,
          choices: [...choiceList]
        }
      ]).then((answer) => {
        // THE SUBSTRING METHOD BELOW IS NECESSARY TO REMOVE THE CHALK COLOR TAGS ATTACHED TO THE ANSWER STRING
          this.handleQueries.displayByDepartment(answer.byDepartment.substr(5, answer.byDepartment.length - 10));
      })
  }

  // REMOVE THIS BEFORE FINISH
  testFn() {
    this.handleQueries.displayByDepartment();
  }

}

module.exports = Questions;