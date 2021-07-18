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
          choices: [chalk`{cyan.bold View All Employees}`, chalk`{cyan View Employees by Department}`, chalk`{cyan View Employees by Manager}`, chalk`{cyan View Employees by Role}`, chalk `{green Add Employee}`, chalk `{magenta Update Employee's Role}`, chalk `{magenta Update Employee's Manager}`, chalk `{red.bold Remove Employee}`, new inquirer.Separator(), chalk `{cyan.bold View All Roles}`, chalk `{cyan View Roles by Department}`, chalk `{green Add Role}`, chalk `{red.bold Remove Role}`, new inquirer.Separator(), chalk `{cyan.bold View All Departments}`, chalk `{cyan View Department Personnel Expenses}`, chalk `{green Add Department}`, chalk `{red.bold Remove Department}`, new inquirer.Separator(' '), new inquirer.Separator(), chalk `{red.bold      QUIT}`, new inquirer.Separator(), new inquirer.Separator('\n')]
        }
      ])
      .then((answers) => {
        switch(answers.nav){
          case chalk`{cyan.bold View All Employees}`:
            this.viewAllEmployees();
            break;
          case chalk`{cyan View Employees by Department}`:
            this.handleQueries.getDepartmentChoices();
            break;
          case chalk`{cyan View Employees by Manager}`:
            this.handleQueries.getManagerChoices();
            break;
          case chalk`{cyan View Employees by Role}`:
            this.handleQueries.getRoleChoices();
            break;
          case chalk `{red.bold      QUIT}`:
            console.log(chalk`{yellow \nThank you for using Employee Manager CMS.}`);
            setTimeout(() => {console.log(chalk`{yellow \nGood bye...}`)}, 700);
            this.closeDB();
            break;
          default:
            console.log('UNDER CONSTRUCTION');
            this.navQuestion(); 
        }
        /// ADD AND "ORDER BY>>>" TO THE ROLES AND PERHAPS OTHERS
      });
  }

  viewAllEmployees() {
    this.handleQueries.displayEmployeeAll();

  }

  viewEmployeeDepartment(choiceList) {
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
          this.handleQueries.displayEmployeeByDepartment(answer.byDepartment.substr(5, answer.byDepartment.length - 10));
      })
  }

  viewEmployeeManager(choiceList, manIndex) {
    inquirer
      .prompt([
        {
          name: 'byManager',
          type: 'list',
          message: chalk `{yellow Which manager would you like to see employees for?}`,
          choices: [...choiceList]
        }
      ]).then((answer) => {
        // THE SUBSTRING METHOD BELOW IS NECESSARY TO REMOVE THE CHALK COLOR TAGS ATTACHED TO THE ANSWER STRING
          this.handleQueries.displayEmployeeByManager(answer.byManager.substr(5, answer.byManager.length - 10), manIndex);
      })
  }

  viewEmployeeRole(choiceList, roleIndex) {
    inquirer
      .prompt([
        {
          name: 'byRole',
          type: 'list',
          message: chalk `{yellow Which role would you like to see employees for?}`,
          choices: [...choiceList]
        }
      ]).then((answer) => {
        // THE SUBSTRING METHOD BELOW IS NECESSARY TO REMOVE THE CHALK COLOR TAGS ATTACHED TO THE ANSWER STRING
          this.handleQueries.displayEmployeeByRole(answer.byRole.substr(5, answer.byRole.length - 10), roleIndex);
      })
  }

  // REMOVE THIS BEFORE FINISH
  testFn() {
    this.handleQueries.displayByDepartment();
  }

}

module.exports = Questions;