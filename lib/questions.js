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
          pageSize: 17,
          message: chalk `{yellow What would you like to do?}`,
          choices: [ new inquirer.Separator(' '), new inquirer.Separator(chalk`{white.bold Employees}`), new inquirer.Separator(), chalk`{cyan.bold view ALL}`, chalk`{cyan.bold view by DEPARTMENT}`, chalk`{cyan.bold view by MANAGER}`, chalk`{cyan.bold view by ROLE}`, chalk `{green.bold NEW employee}`, chalk `{magenta.bold update ROLE}`, chalk `{magenta.bold update MANAGER}`, chalk `{red.bold DELETE employee}`, new inquirer.Separator(" "), new inquirer.Separator(`Roles`), new inquirer.Separator(), chalk `{cyan.bold View All}`, chalk `{cyan.bold View by DEPARTMENT}`, chalk `{green.bold ADD Role}`, chalk `{red.bold REMOVE Role}`, new inquirer.Separator(" "), new inquirer.Separator(`Departments`), new inquirer.Separator(), chalk `{cyan.bold View ALL}`, chalk `{cyan.bold View Personnel Expenses}`, chalk `{green.bold Add Department}`, chalk `{red.bold Remove Department}`, new inquirer.Separator(' '), new inquirer.Separator(), chalk `{red.bold      QUIT}`, new inquirer.Separator()]
        }
      ])
      .then((answers) => {
        switch(answers.nav){
          case chalk`{cyan.bold view ALL}`:
            this.viewAllEmployees();
            break;
          case chalk`{cyan.bold view by DEPARTMENT}`:
            this.handleQueries.getDepartmentChoices();
            break;
          case chalk`{cyan.bold view by MANAGER}`:
            this.handleQueries.getManagerChoices();
            break;
          case chalk`{cyan.bold view by ROLE}`:
            this.handleQueries.getRoleChoices();
            break;
          case chalk `{green.bold NEW employee}`:
            this.handleQueries.addEmployeeChoicesRole();
            break;
          case chalk `{magenta.bold update ROLE}`:
            this.handleQueries.handleEmployeeNameForUpdates(true);
            break;
          case chalk `{magenta.bold update MANAGER}`:
            this.handleQueries.handleEmployeeNameForUpdates(false);
            break;
          case chalk `{red.bold DELETE employee}`:
            this.handleQueries.getRemoveChoices();
            break;
          case chalk `{cyan.bold View All}`:
            this.handleQueries.endConnection();
            break;
          case chalk `{cyan.bold View by DEPARTMENT}`:
            this.handleQueries.endConnection();
            break;
          case chalk `{green.bold ADD Role}`:
            this.handleQueries.endConnection();
            break;
          case chalk `{red.bold REMOVE Role}`:
            this.handleQueries.endConnection();
            break;
          case chalk `{cyan.bold View ALL}`:
            this.handleQueries.endConnection();
            break;
          case chalk `{cyan.bold View Personnel Expenses}`:
            this.handleQueries.endConnection();
            break;
          case chalk `{green.bold Add Department}`:
            this.handleQueries.endConnection();
            break;
          case chalk `{red.bold Remove Department}`:
            this.handleQueries.endConnection();
            break;
          case chalk `{red.bold      QUIT}`:
            console.log(chalk`{cyan \nThank you for using Employee Manager CMS.}`);
            setTimeout(() => {console.log(chalk`{magenta \nGood bye...}`)}, 700);
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
          pageSize: 15,
          message: chalk `{yellow Select a Department:}`,
          choices: [...choiceList]
        }
      ]).then((answer) => {
        // THE .substr METHODS BELOW IS NECESSARY TO REMOVE THE CHALK COLOR TAGS ATTACHED TO THE ANSWER STRING
        let dep = answer.byDepartment;
        this.handleQueries.displayEmployeeByDepartment(dep.substr(5, dep.length - 10));
      })
  }

  viewEmployeeManager(choiceList, manIndex) {
    console.log(' ');

    inquirer
      .prompt([
        {
          name: 'byManager',
          type: 'list',
          pageSize: 15,
          message: chalk `{yellow Select a Manager:}`,
          choices: [...choiceList, new inquirer.Separator(' '), new inquirer.Separator(' ')]
        }
      ]).then((answer) => {
        let manager = answer.byManager;
        this.handleQueries.displayEmployeeByManager(manager.substr(7, manager.length - 12), manIndex);
      })
  }

  viewEmployeeRole(choiceList, roleIndex) {
    console.log(' ');
    inquirer
      .prompt([
        {
          name: 'byRole',
          type: 'list',
          pageSize: 15,
          message: chalk `{yellow Select a Role:}`,
          choices: [...choiceList, new inquirer.Separator(' '), new inquirer.Separator(' ')]
        }
      ]).then((answer) => {
        let role = answer.byRole;
          this.handleQueries.displayEmployeeByRole(role.substr(7, role.length - 12), roleIndex);
      })
  }

  addEmployeeRole(roleChoices, roleIndex) {
    console.log(' ');
    inquirer
      .prompt([
        {
          name: 'firstName',
          type: 'input',
          message: chalk `{yellow What is the employee's first name? }{cyan (or type }{red CANCEL}{cyan to Go Back)}\n   `,
          validate: (input) => {
            if (input.toUpperCase() == `CANCEL`) {
            return true;
            }
            else if (!/^([A-Z][a-z]+([ ]?[a-z]?['-]?[A-Z][a-z]+)*)$/.test(input)) {
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
          when(answers) {
            if (answers.firstName.toUpperCase() == `CANCEL`){
              return false;
            }
            return true;
          },
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
          pageSize: 15,
          message: chalk `{yellow What is the employee's role?}\n   `,
          when(answers) {
            if (answers.firstName.toUpperCase() == `CANCEL`){
              return false;
            }
            return true;
          },
          choices: [...roleChoices, new inquirer.Separator(' '), new inquirer.Separator(' ')] 
        }
      ]).then((answers) => {
        if (answers.firstName.toUpperCase() == `CANCEL`) {
          console.log(' ');
          this.navQuestion();
        } else {
            // dep IS THE PART OF THE SELECTED ANSWER THAT IS JUST THE DEPARTMENT NAME TO BE USED IN THE FOLLOWING FUNCITON
            // IN ORDER TO QUERY JUST THE EMPLOYEES IN THE SAME DEPARTMENT TO BE DISPLAYED AS MANAGER CHOICES IN THE NEXT QUESTION
            let role = answers.role;
            this.handleQueries.addEmployeeChoicesManager(role.substr(7, role.length - 12), answers, roleIndex)
        }
      })
  }

  addEmployeeManager(managerChoices, managerIndex, roleIndex, otherAnswers) {
    console.log(' ');
    inquirer
      .prompt([
        {
          name: 'manager',
          type: 'list',
          pageSize: 15,
          message: chalk `{yellow Who is the employee's manager?}\n   `,
          choices: [chalk`{redBright No Manager}`, new inquirer.Separator(), ...managerChoices, new inquirer.Separator(' '),  new inquirer.Separator(' ')] 
        }
      ]).then((answer) => {
        this.handleQueries.addEmployeeToDB(managerIndex, roleIndex, answer, otherAnswers)
      })
  }


  updateEmployeePrep(forRole, choiceArr, employeeIndex) {
    console.log(' ');
    inquirer
      .prompt([
        {
          name: 'target',
          type: 'list',
          pageSize: 15,
          message: chalk`{yellow Select an employee to update their ${forRole ? 'Role' : 'Manager'}:}`,
          choices: [chalk`{redBright CANCEL}`, new inquirer.Separator(),...choiceArr, new inquirer.Separator(' '), new inquirer.Separator(' ')]
        }
      ]).then((answer) =>{
        if (answer.target == chalk`{redBright CANCEL}`){
          console.log(' ');
          this.navQuestion();
          return;
        }
        forRole ? this.handleQueries.handleUpdateRole(answer.target, employeeIndex) : this.handleQueries.handleUpdateManager(answer.target, employeeIndex);
      })
  }

  updateEmployeeRole(choiceArr, roleIndex, target, employeeIndex) {
    let employee = target.substr(7, target.length - 12);
    console.log(' ');
    inquirer
      .prompt([
        {
          name: 'update',
          type: 'list',
          pageSize: 15,
          message: chalk`{yellow Select a new Role to assign to ${employee}}`,
          choices: [...choiceArr, new inquirer.Separator(' '), new inquirer.Separator(' ')]
        }
      ]).then((answer) =>{
        let role = answer.update;
        this.handleQueries.updateRoleDB(role.substr(7, role.length - 12), employee, roleIndex, employeeIndex);
      })
  }

  updateEmployeeManager(choiceArr, managerIndex, target, employeeIndex) {
    let employee = target.substr(7, target.length - 12);
    console.log(' ');
    inquirer
      .prompt([
        {
          name: 'update',
          type: 'list',
          pageSize: 15,
          message: chalk`{yellow Select a new Manager to assign to ${employee}}`,
          choices: [chalk`{redBright No Manager}`, new inquirer.Separator(), ...choiceArr, new inquirer.Separator(' '), new inquirer.Separator(' ')]
        }
      ]).then((answer) =>{
        let manager = answer.update.trim();
        this.handleQueries.updateManagerDB(manager, employee, managerIndex, employeeIndex);
      })
  }

  removeEmployee(removeChoices, removeIndex) {
    console.log(' ');
    inquirer
      .prompt([
        {
          name: 'remove',
          type: 'list',
          pageSize: 15,
          message: chalk`{yellow Which employee would you like to remove?}`,
          choices: [chalk`{redBright CANCEL}`, new inquirer.Separator(),...removeChoices, new inquirer.Separator(' '), new inquirer.Separator(' ')]
        }
      ]).then((answer) =>{
        this.handleQueries.removeEmployeeFromDB(answer.remove, removeIndex);
      })
  }



  // REMOVE THIS BEFORE FINISH
  testFn() {
    this.handleQueries.displayByDepartment();
  }

}

module.exports = Questions;