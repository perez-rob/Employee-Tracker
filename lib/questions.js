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
          choices: [chalk`{cyan View All Employees}`, chalk`{cyan View All Employees By Department}`, chalk`{cyan View All Employees By Manager}`, chalk `{blue Add Employee}`, chalk `{red Remove Employee}`, chalk `{magenta Update Employee Role}`, chalk `{magenta Update Employee Manager}`]
        }
      ])
      .then((answers) => {
        switch(answers.nav){
          case chalk`{cyan View All Employees}`:
            this.viewAll();
            break;
          case chalk`{cyan View All Employees By Department}`:
            console.log('VIEW ALL BY DEP');
            break;
          default:
            console.log('UNDER CONSTRUCTION'); 
        }

      });
  }

  viewAll() {
    this.handleQueries.displayEmployeeAll();

  }
}

module.exports = Questions;