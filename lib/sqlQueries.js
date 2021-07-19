const mysql = require('mysql');
const cTable = require('console.table');
const chalk = require("chalk");
const inquirer = require('inquirer');

/// LOOK INTO NATIVE consloe.table VS table package

class Queries {

  constructor(parentObj) {
    this.parentObj = parentObj;
    this.connection = mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'Testing123',
      database: 'employee_trackerDB'
    });

  }
  openConnection() {
    this.connection.connect((err) => {
      if (err) throw err;
    })
  }

  // LOOK INTO ORGANIZING (ORDER) THE DISPLAY
  displayEmployeeAll() {
    this.connection.query(
      `SELECT
      e.id AS ID, 
      CONCAT(e.first_name, ' ', e.last_name) AS Employee, 
      role.title AS Role,
      department.name AS Department,
      role.salary AS Salary,
      CONCAT(m.first_name, ' ', m.last_name) AS Manager 
    FROM employee e
    LEFT JOIN role ON e.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee m ON e.manager_id = m.id
    ORDER BY e.first_name;`,
      (err, res) => {
        if (err) console.log(err);
        // BELOW, THE SPLIT AND REJOIN FUNCTION TO INDENT THE TABLE SO IT IS NOT RIGHT AGAINST THE LEFT SIDE OF THE CONSOLE
        let table = cTable.getTable(res);
        let tblSplit = table.split('\n');
        // LOOK INTO CHANGING .map TO .reduce TO DO MORE DETAILED STYLING OF TABLE
        let tblStyle = tblSplit.map((line) => chalk`{cyan.bold ${line}}`);
        console.log(' \n');
        console.log(`        ${tblStyle.join(`\n        `)}`); 
        this.parentObj.navQuestion();
      }
    )
  }

  // ==================================================================

  getDepartmentChoices() {
    let choiceArr;
    this.connection.query(
      `SELECT name FROM department
      `,
      (err, res) => {
        if (err) console.log(err);
        choiceArr = res.reduce((arr, item) => {
          let newItem = chalk`{cyan ${item.name}}`;
          arr.push(newItem);
          return arr;
        }, []);
        choiceArr.unshift(new inquirer.Separator(' '));
        this.parentObj.viewEmployeeDepartment(choiceArr);
      }
    )    
  }

  displayEmployeeByDepartment(department) {
    this.connection.query(
      `SELECT
      e.id AS ID, 
      CONCAT(e.first_name, ' ', e.last_name) AS Employee, 
      role.title AS Role,
      CONCAT(m.first_name, ' ', m.last_name) AS Manager 
    FROM employee e
    LEFT JOIN role ON e.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee m ON e.manager_id = m.id
    WHERE ?
    ORDER BY e.first_name`,
    {
      "department.name": department
    },
      (err, res) => {
        if (err) console.log(err);
        let titleTbl = cTable.getTable([{
          Department: department
        }]);
        console.log(' ');
        console.log(`   ${titleTbl.split(`\n`).join(`\n   `)}`);
        let tblSplit = cTable.getTable(res).split('\n');
        let tblStyle = tblSplit.map((line) => chalk`{cyan.bold ${line}}`);
        console.log(`        ${tblStyle.join(`\n        `)}`); 
        this.parentObj.navQuestion();
      }
    )
  }

  // ==================================================================
  getManagerChoices() {
    let choiceArr = [];
    let managerIndex;
    this.connection.query(
      `SELECT 
      CONCAT(m.first_name, ' ', m.last_name) AS Manager, 
      m.id, 
      role.title AS Role, 
      department.name AS Department  
    FROM employee m
    LEFT JOIN role ON m.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    WHERE m.id IN (SELECT manager_id FROM employee)
    ORDER BY department.name;
      `,
      (err, res) => {
        if (err) console.log(err);
        let checklist = [];
        managerIndex = res.reduce((obj,item) => {
          if (!checklist.includes(item.Department)){
            choiceArr.push(new inquirer.Separator(' '));
            choiceArr.push(new inquirer.Separator(chalk`{magenta  ${item.Department}}`));
            choiceArr.push(new inquirer.Separator());
            checklist.push(item.Department);
          }
          choiceArr.push(chalk`{cyan   ${item.Manager}}`)
          let { Manager, id, Role, Department } = item;
          obj[Manager] = [id, Role, Department];
          return obj;
        }, {});
        this.parentObj.viewEmployeeManager(choiceArr, managerIndex);
      }
    )    
  }

  displayEmployeeByManager(manager, manIndex) {
    this.connection.query(
      `SELECT
      e.id AS ID, 
      CONCAT(e.first_name, ' ', e.last_name) AS Employee,
      role.title AS Role        
    FROM employee e
    LEFT JOIN role ON e.role_id = role.id
    WHERE ?;`,
    {
      "e.manager_id": manIndex[manager][0]
    },
      (err, res) => {
        if (err) console.log(err);
        let titleTbl = cTable.getTable([{
          Manager: manager,
          Role: manIndex[manager][1]
        }]);
        console.log(' ');
        console.log(`   ${titleTbl.split(`\n`).join(`\n   `)}`);
        let tblSplit = cTable.getTable(res).split('\n');
        let tblStyle = tblSplit.map((line) => chalk`{cyan.bold ${line}}`);
        console.log(`        ${tblStyle.join(`\n        `)}`); 
        this.parentObj.navQuestion();
      }
    )
  }

  // ==================================================================
  // COMBINE REDUCE FUNCTIONS
  getRoleChoices() {
    let choiceArr = [];
    let roleIndex;
    this.connection.query(
      `SELECT 
      title,
      role.id,
      salary,
      department.name AS Department
      FROM role
      LEFT JOIN department ON role.department_id = department.id;`,
      (err, res) => {
        if (err) console.log(err);
        let checklist = [];
        roleIndex = res.reduce((obj,item) => {
          if (!checklist.includes(item.Department)) {
            choiceArr.push(new inquirer.Separator(' '));
            choiceArr.push(new inquirer.Separator(chalk`{magenta  ${item.Department}}`));
            choiceArr.push(new inquirer.Separator());
            checklist.push(item.Department);
          }
          choiceArr.push(chalk`{cyan   ${item.title}}`)
          let { title, id, salary, Department } = item;
          obj[title] = [id, salary, Department];
          return obj;
        }, {});
        this.parentObj.viewEmployeeRole(choiceArr, roleIndex);
      }
    )    
  }

  displayEmployeeByRole(role, roleIndex) {
    this.connection.query(
      `SELECT
      e.id AS ID, 
      CONCAT(e.first_name, ' ', e.last_name) AS Employee, 
      CONCAT(m.first_name, ' ', m.last_name) AS Manager 
    FROM employee e
    LEFT JOIN role ON e.role_id = role.id
    LEFT JOIN employee m ON e.manager_id = m.id
    WHERE ?;`,
    {
      "role.id": roleIndex[role][0]
    },
      (err, res) => {
        if (err) console.log(err);
        let titleTbl = cTable.getTable([{
          Role: role,
          Salary: roleIndex[role][1]
        }]);
        console.log(' ');
        console.log(`   ${titleTbl.split(`\n`).join(`\n   `)}`);
        let tblSplit = cTable.getTable(res).split('\n');
        let tblStyle = tblSplit.map((line) => chalk`{cyan.bold ${line}}`);
        console.log(`        ${tblStyle.join(`\n        `)}`); 
        this.parentObj.navQuestion();
      }
    )
  }

  // ==================================================================

  addEmployeeChoicesRole() {
    let roleChoices = [];
    let roleIndex;
    this.connection.query(
      `SELECT 
      role.id,
      department.name AS Department,
      title
      FROM role
      LEFT JOIN department ON role.department_id = department.id
      ORDER BY 
        department.name;
      `,
      (err, res) => {
        if (err) console.log(err);
        let checklist = [];
        roleIndex = res.reduce((obj, item) => {
          if (!checklist.includes(item.Department)){
            roleChoices.push(new inquirer.Separator(' '));
            roleChoices.push(new inquirer.Separator(chalk`{magenta  ${item.Department}}`));
            roleChoices.push(new inquirer.Separator());
            checklist.push(item.Department);
          }     
          let { Department, id, title} = item;
          obj[title] = [id, Department];
          roleChoices.push(chalk`{cyan   ${title}}`)
          return obj;
        }, {});
          // console.log(roleChoices)
          this.parentObj.addEmployeeRole(roleChoices, roleIndex);
      }
    )   
  }

  addEmployeeChoicesManager(role, otherAnswers, roleIndex) {
    let managerChoices = [];
    let managerIndex;
    this.connection.query(
      `SELECT
      e.id,
      role.title, 
      CONCAT(e.first_name, ' ', e.last_name) AS Employee 
    FROM employee e
    LEFT JOIN role ON role.id = e.role_id
    WHERE e.role_id IN (
    SELECT 
    role.id
    FROM role
    LEFT JOIN department ON role.department_id = department.id
    WHERE ?)
    ORDER BY role.id;         
      `,
      {
        "department.name": roleIndex[role][1]
      },
      (err, res) => {
        let checklist = [];
        managerIndex = res.reduce((obj, item) => {
          if (!checklist.includes(item.title)){
            managerChoices.push(new inquirer.Separator(' '));
            managerChoices.push(new inquirer.Separator(chalk`{magenta  ${item.title}}`));
            managerChoices.push(new inquirer.Separator());
            checklist.push(item.title);
          }      
          let { Employee, id, title} = item;
          obj[Employee] = [id, title];
          managerChoices.push(chalk`{cyan   ${Employee}}`)
          return obj;
        }, {});  
        this.parentObj.addEmployeeManager(managerChoices, managerIndex, roleIndex, otherAnswers)
      }
    )
  }

  addEmployeeToDB(managerIndex, roleIndex, managerAnswer, otherAnswers) {
    let { firstName, lastName, role } = otherAnswers;
    // THE .substr AND .split EXTRACT THE ROLE FROM THE COLOR TAGS AND DEPARTMENT NAME THAT ARE ATTACHED TO IT
    role = role.substr(7, role.length - 12);
    let roleID = roleIndex[role][0];
    let manager = managerAnswer.manager; 
    manager = (manager.includes('No Manager') ? 'No Manager' : manager.substr(7, manager.length - 12));
    let managerID = (manager == 'No Manager' ? null : managerIndex[manager][0]);

    this.connection.query(
      `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
      VALUES ("${firstName}", "${lastName}", ${roleID}, ${managerID});
      `,
      (err, res) => {
        if (err) console.log(err);
        console.log(chalk`\n\n{greenBright   Successfully added employee to database: \n\n}{green.bold      ${firstName} ${lastName} -- ${role} }\n\n{yellow =======================================================}\n\n`);
        this.parentObj.navQuestion();
      }
    )
  }

  // ==================================================================


  handleEmployeeNameForUpdates(forRole) {
    let choiceArr = [];
    let employeeIndex;
    this.connection.query(
      `SELECT
      employee.id,
      CONCAT(first_name, ' ', last_name) AS employee,
      role.title,
      department.name AS Department
    FROM employee
    LEFT JOIN role ON role.id = employee.role_id
    LEFT JOIN department ON role.department_id = department.id
    ORDER BY
      department.name,
      employee.first_name;
      `,
      (err, res) => {
        if (err) console.log(err);
        let checklist = [];
        employeeIndex = res.reduce((obj,item) => {
          if (!checklist.includes(item.Department)) {
            choiceArr.push(new inquirer.Separator(' '));
            choiceArr.push(new inquirer.Separator(chalk`{magenta ${item.Department}}`));
            choiceArr.push(new inquirer.Separator());
            checklist.push(item.Department);
          }
          let { title, id, employee } = item;
          obj[employee] = [id, title];
          // CONSIDER SPACING LIST OUT
          choiceArr.push(chalk`{cyan   ${employee}}`)
          return obj;
        }, {});
        this.parentObj.updateEmployeePrep(forRole, choiceArr, employeeIndex);
      }
    )  
  }

  handleUpdateRole(target, employeeIndex) {
    let choiceArr;
    let roleIndex;
    this.connection.query(
      `SELECT 
      title,
      role.id,
      department.name AS Department
      FROM role
      LEFT JOIN department ON role.department_id = department.id
      ORDER BY department.name;`,
      (err, res) => {
        if (err) console.log(err);
        roleIndex = res.reduce((obj,item) => {
          let { title, id, Department } = item;
          obj[title] = [id, Department];
          return obj;
        }, {});
        let checklist = [];
        choiceArr = res.reduce((arr, item) => {
          let newSeparator = item.Department;
          if (!checklist.includes(newSeparator)){
            arr.push(new inquirer.Separator(chalk`{magenta ${newSeparator}}`));
            arr.push(new inquirer.Separator());
            checklist.push(newSeparator)
          }
          let newItem = chalk`{cyan   ${item.title}}`;
          arr.push(newItem);
          return arr;
        }, []);
        // console.log(choiceArr)
        this.parentObj.updateEmployeeRole(choiceArr, roleIndex, target, employeeIndex);
      }
    ) 
  }

  handleUpdateManager(target, employeeIndex) {
    let choiceArr;
    let managerIndex;
    this.connection.query(
      `SELECT
      CONCAT(first_name, ' ', last_name) AS employee, 
        title,
        employee.id AS ID,
        role.id AS roleID,
        department.name AS Department
        FROM employee
        LEFT JOIN role ON role.id = role_id
        LEFT JOIN department ON role.department_id = department.id
        ORDER BY 
      department.name,
      role.id,
      first_name;`,
      (err, res) => {
        if (err) console.log(err);
        managerIndex = res.reduce((obj,item) => {
          let { employee, ID, roleID } = item;
          obj[employee] = [ID, roleID];
          return obj;
        }, {});
        let checklist = [];
        choiceArr = res.reduce((arr, item) => {
          let newSeparator = item.Department;
          let subSeparator = item.title;
          if (!checklist.includes(newSeparator)){
            arr.push(new inquirer.Separator(' '));
            arr.push(new inquirer.Separator(chalk`{cyan ${newSeparator}}`));
            arr.push(new inquirer.Separator());
            checklist.push(newSeparator)
          }
          if (!checklist.includes(subSeparator)){
            arr.push(new inquirer.Separator(' '));
            arr.push(new inquirer.Separator(chalk`{magenta   ${subSeparator}}`));
            arr.push(new inquirer.Separator(' '));
            checklist.push(subSeparator)
          }
          let newItem = `    ${item.employee}`;
          arr.push(newItem);
          return arr;
        }, []);
        // console.log(choiceArr)
        this.parentObj.updateEmployeeManager(choiceArr, managerIndex, target, employeeIndex);
      }
    ) 
  }

  updateRoleDB(role, employee, roleIndex, employeeIndex) {
    this.connection.query(
      'UPDATE employee SET ? WHERE ?',
      [
        {
          role_id: roleIndex[role][0],
        },
        {
          id: employeeIndex[employee][0],
        },
      ],
      (err, res) => {
        if (err) throw err;
        console.log(chalk`\n\n{cyan   Successfully updated {magenta Role} in database: \n\n}{white.bold      ${employee} }{cyan -- }{magenta ${role} }\n\n{yellow =======================================================}\n\n`);
        this.parentObj.navQuestion();
      }
    );
  }

  updateManagerDB(manager, employee, managerIndex, employeeIndex) {
    manager = (manager.includes('No Manager') ? 'No Manager' : manager);
    let managerID = (manager == 'No Manager' ? null : managerIndex[manager][0]);
    this.connection.query(
      'UPDATE employee SET ? WHERE ?',
      [
        {
          manager_id: managerID,
        },
        {
          id: employeeIndex[employee][0],
        },
      ],
      (err, res) => {
        if (err) throw err;
        console.log(chalk`\n\n{cyan   Successfully updated {magenta Manager} in database: \n\n}{white.bold      ${employee} }{cyan is working under }{magenta ${manager} }\n\n{yellow =======================================================}\n\n`);
        this.parentObj.navQuestion();
      }
    );
  }


  // ==================================================================



  getRemoveChoices() {
    let choiceArr = [];
    let removeIndex;
    this.connection.query(
      `SELECT
      employee.id,
      CONCAT(first_name, ' ', last_name) AS employee,
      title,
      department.name AS department
    FROM employee
    LEFT JOIN role ON role.id = employee.role_id
    LEFT JOIN department ON department.id = role.department_id
    ORDER BY
      department.name,
      role.id,
      first_name;
      `,
      (err, res) => {
        if (err) console.log(err);
        let checklist = [];
        removeIndex = res.reduce((obj,item) => {
          if (!checklist.includes(item.department)){
            choiceArr.push(new inquirer.Separator(' '));
            choiceArr.push(new inquirer.Separator(chalk`{white ${item.department}}`));
            choiceArr.push(new inquirer.Separator());
            checklist.push(item.department);
          }
          if (!checklist.includes(item.title)){
            choiceArr.push(new inquirer.Separator(' '));
            choiceArr.push(new inquirer.Separator(chalk`{magenta   ${item.title}}`));
            choiceArr.push(new inquirer.Separator(' '));
            checklist.push(item.title)
          }
          let { title, id, employee } = item;
          obj[employee] = [id, title];
          // CONSIDER SPACING LIST OUT
          choiceArr.push(chalk`{cyan     ${employee}}`)
          return obj;
        }, {});
        this.parentObj.removeEmployee(choiceArr, removeIndex);
      }
    )    
  }

  removeEmployeeFromDB(answer, removeIndex) {
    let employee = (answer.includes('CANCEL') ? 'CANCEL' : answer.substr(9, answer.length - 14));
    if (employee == 'CANCEL') {
      console.log(' ');
      this.parentObj.navQuestion();
    } else {
      let employeeID = removeIndex[employee][0];
      this.connection.query(
        `DELETE FROM employee WHERE id = ${employeeID}`,
        (err, res) => {
          if (err) console.log(err);
          console.log(chalk`\n\n{redBright   Successfully removed employee from database: \n\n}{red.bold      ${employee} -- ${removeIndex[employee][1]} }\n\n{yellow =======================================================}\n\n`);
          this.parentObj.navQuestion();
        }
      )

    }

  }

  // ==================================================================

  getAllRoles() {
    this.connection.query(
      `SELECT title AS Role, salary AS Salary, NAME AS department
      FROM role
      LEFT JOIN department ON 
      department.id = role.department_id
      ORDER BY title;
      `,
      (err, res) => {
        if (err) console.log(err);
        let table = cTable.getTable(res);
        let tblSplit = table.split('\n');
        // LOOK INTO CHANGING .map TO .reduce TO DO MORE DETAILED STYLING OF TABLE
        let tblStyle = tblSplit.map((line) => chalk`{cyan.bold ${line}}`);
        console.log(' \n');
        console.log(`        ${tblStyle.join(`\n        `)}`); 
        this.parentObj.navQuestion();
      }
    )
  }

  getRolesByDepartment() {
    this.connection.query(
      `SELECT name AS department, id
      FROM department;
      `,
      (err, res) => {
        if (err) console.log(err);
        let depIndex= {}; 
        res.map((choice) => depIndex[choice.department] = choice.id);
        let choiceArr = res.map((choice) => chalk`{cyan ${choice.department}}`);
        this.parentObj.rolesByDepartment(choiceArr)
          .then((answer) => {
            let dep = answer.byDepartment;
            dep = dep.substr(5, dep.length - 10);
            this.connection.query(
              `SELECT title AS Role, salary AS Salary
              FROM role
              WHERE ?
              `,
              {
                department_id: depIndex[dep]
              },
              (err, res) => {
                if (err) console.log(err);
                let titleTbl = cTable.getTable([{
                  Department: dep
                }]);
                console.log(' ');
                console.log(`   ${titleTbl.split(`\n`).join(`\n   `)}`);
                let tblSplit = cTable.getTable(res).split('\n');
                let tblStyle = tblSplit.map((line) => chalk`{cyan.bold ${line}}`);
                console.log(`        ${tblStyle.join(`\n        `)}`); 
                this.parentObj.navQuestion();
              }
            )
          })
      }
    )
  }

  addNewRole() {
    this.connection.query(
      `SELECT name AS department, id
      FROM department;
      `,
      (err, res) => {
        if (err) console.log(err);
        let depIndex= {}; 
        res.map((choice) => depIndex[choice.department] = choice.id);
        let choiceArr = res.map((choice) => chalk`{cyan ${choice.department}}`);
        this.parentObj.addRole(choiceArr)
          .then((answers) => {
            if (answers.departmentID == chalk`{redBright CANCEL}`) {
              console.log(' ');
              this.parentObj.navQuestion();
              return;
            } else {
              let dep = answers.departmentID;
              dep = dep.substr(5, dep.length - 10);
              this.connection.query(
                `INSERT INTO role SET ?;
                `,
                {
                  title: answers.roleTitle,
                  salary: answers.roleSalary,
                  department_id: depIndex[dep] 
                },
                (err, res) => {
                  if (err) console.log(err);
                  console.log(chalk`\n\n{greenBright   Successfully added NEW ROLE to database: \n\n}{green.bold      ${answers.roleTitle} in ${dep} }\n\n{yellow =======================================================}\n\n`);
                  this.parentObj.navQuestion();
                }
              )
            }
          });
      });
  }

  removeRole() {
    this.connection.query(
      `SELECT title, department.name AS department, role.id
      FROM role
      LEFT JOIN department ON department.id = role.department_id
      ORDER BY department;
      `,
      (err, res) => {
        if (err) console.log(err);
        let roleIndex= {}; 
        res.map((choice) => roleIndex[choice.title] = [choice.id, choice.department]);
        let checklist = [];
        let choiceArr = []; 
        res.map((item) => {
          if (!checklist.includes(item.department)) {
            choiceArr.push(new inquirer.Separator(' '));
            choiceArr.push(new inquirer.Separator(chalk`{magenta ${item.department}}`));
            choiceArr.push(new inquirer.Separator());
            checklist.push(item.department);
          }
          choiceArr.push( chalk`{cyan ${item.title}}`)
        })
        this.parentObj.removeRole(choiceArr)
          .then((answers) => {
            if (answers.rmRole == chalk`{redBright CANCEL}`) {
              console.log(' ');
              this.parentObj.navQuestion();
              return;
            } else {
              let role = answers.rmRole;
              role = role.substr(5, role.length - 10);
              this.connection.query(
                `DELETE FROM role WHERE ?;
                `,
                {
                  id: roleIndex[role][0]
                },
                (err, res) => {
                  if (err) console.log(err);
                  console.log(chalk`\n\n{redBright   Successfully removed ROLE to database: \n\n}{red.bold      ${role} from ${roleIndex[role][1]} }\n\n{yellow =======================================================}\n\n`);
                  this.parentObj.navQuestion();
                }
              )
            }
          });
      });
  }



  // ==================================================================

  endConnection() {
    this.connection.end();
  }
}

module.exports = Queries;