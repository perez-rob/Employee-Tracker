const inquirer = require('inquirer');
const chalk = require("chalk");


class Questions {

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

      });
  }
}

module.exports = Questions;