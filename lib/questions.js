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
          case chalk `{green Add Employee}`:
            this.handleQueries.addEmployeeChoicesRole();
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
    console.log(' ');
    inquirer
      .prompt([
        {
          name: 'byDepartment',
          type: 'list',
          message: chalk `{yellow Select a Department:}`,
          choices: [...choiceList, new inquirer.Separator()]
        }
      ]).then((answer) => {
        // THE .substr AND .split METHODS BELOW ARE NECESSARY TO REMOVE THE CHALK COLOR TAGS ATTACHED TO THE ANSWER STRING
        this.handleQueries.displayEmployeeByDepartment(answer.byDepartment.substr(5, answer.byDepartment.length - 10));
      })
  }

  viewEmployeeManager(choiceList, manIndex) {
    console.log(' ');

    inquirer
      .prompt([
        {
          name: 'byManager',
          type: 'list',
          message: chalk `{yellow Select a Manager:}`,
          choices: [...choiceList, new inquirer.Separator()]
        }
      ]).then((answer) => {
        // THE .substr AND .split METHODS BELOW ARE NECESSARY TO REMOVE THE CHALK COLOR TAGS ATTACHED TO THE ANSWER STRING
        this.handleQueries.displayEmployeeByManager(answer.byManager.substr(5).split(' -')[0], manIndex);
      })
  }

  viewEmployeeRole(choiceList, roleIndex) {
    console.log(' ');
    inquirer
      .prompt([
        {
          name: 'byRole',
          type: 'list',
          message: chalk `{yellow Select a Role:}`,
          choices: [...choiceList, new inquirer.Separator()]
        }
      ]).then((answer) => {
        // THE .substr AND .split METHODS BELOW ARE NECESSARY TO REMOVE THE CHALK COLOR TAGS ATTACHED TO THE ANSWER STRING
          this.handleQueries.displayEmployeeByRole(answer.byRole.substr(5).split(' -')[0], roleIndex);
      })
  }

  addEmployeeRole(roleChoices, roleIndex) {
    console.log(' ');
    inquirer
      .prompt([
        {
          name: 'firstName',
          type: 'input',
          message: chalk `{yellow What is the employee's first name?}\n   `,
          validate: (input) => {
            if (!/^([A-Z][a-z]+([ ]?[a-z]?['-]?[A-Z][a-z]+)*)$/.test(input)) {
                return 'Employee name must contain at least one upper-case and one lower-case letter and only contain letters, single spaces, or dashes';
            } else {
                return true;
            }
          } 
        },
        {
          name: 'lastName',
          type: 'input',
          message: chalk `{yellow What is the employee's last name?}\n   `,
          validate: (input) => {
            if (!/^([A-Z][a-z]+([ ]?[a-z]?['-]?[A-Z][a-z]+)*)$/.test(input)) {
                return 'Employee name must contain at least one upper-case and one lower-case letter and only contain letters, single spaces, or dashes';
            } else {
                return true;
            }
          } 
        },
        {
          name: 'role',
          type: 'list',
          message: chalk `{yellow What is the employee's role?}\n   `,
          choices: [...roleChoices, new inquirer.Separator()] 
        }
      ]).then((answers) => {
          // dep IS THE PART OF THE SELECTED ANSWER THAT IS JUST THE DEPARTMENT NAME TO BE USED IN THE FOLLOWING FUNCITON
          // IN ORDER TO QUERY JUST THE EMPLOYEES IN THE SAME DEPARTMENT TO BE DISPLAYED AS MANAGER CHOICES IN THE NEXT QUESTION
          let dep = answers.role.split(' -')[1];
          dep = (dep.substr(11, dep.length - 16));
          this.handleQueries.addEmployeeChoicesManager(dep, answers, roleIndex)
      })
  }

  addEmployeeManager(managerChoices, managerIndex, roleIndex, otherAnswers) {
    console.log(' ');
    inquirer
      .prompt([
        {
          name: 'manager',
          type: 'list',
          message: chalk `{yellow Who is the employee's manager?}\n   `,
          choices: [chalk`{redBright No Manager}`, new inquirer.Separator(), ...managerChoices, new inquirer.Separator()] 
        }
      ]).then((answer) => {
        this.handleQueries.addEmployeeToDB(managerIndex, roleIndex, answer, otherAnswers)
      })
  }

  // REMOVE THIS BEFORE FINISH
  testFn() {
    this.handleQueries.displayByDepartment();
  }

}

module.exports = Questions;