const mysql = require('mysql');
const cTable = require('console.table');
const chalk = require("chalk");

/// LOOK INTO NATIVE consloe.table VS table package

class Queries {

  constructor(parentObj) {
    this.parentObj = parentObj;
    this.connection = mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'Therapyland1!',
      database: 'employee_trackerDB'
    });

  }
  openConnection() {
    this.connection.connect((err) => {
      if (err) throw err;
    })
  }

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
    LEFT JOIN employee m ON e.manager_id = m.id;`,
      (err, res) => {
        if (err) console.log(err);
        // console.log(res)
        let table = cTable.getTable(res);
        console.log(' ');
        console.log(table);
        this.parentObj.navQuestion();
      }
    )
  }

  // ===========

  getDepartmentChoices() {
    let choiceArr;
    this.connection.query(
      `SELECT name FROM department`,
      (err, res) => {
        if (err) console.log(err);
        choiceArr = res.reduce((arr, item) => {
          let newItem = chalk`{cyan ${item.name}}`;
          arr.push(newItem);
          return arr;
        }, []);
        // console.log(choiceArr)
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
    WHERE ?`,
    {
      "department.name": department
    },
      (err, res) => {
        if (err) console.log(err);
        let titleTbl = cTable.getTable([{
          Department: department
        }]);
        let table = cTable.getTable(res);
        console.log(' ');
        console.log(titleTbl);
        console.table(table);
        this.parentObj.navQuestion();
      }
    )
  }

  // ===========

  getManagerChoices() {
    let choiceArr;
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
    WHERE m.id IN (SELECT manager_id FROM employee);
      `,
      (err, res) => {
        if (err) console.log(err);
        managerIndex = res.reduce((obj,item) => {
          // OBJECT DESTRUCTURING
          let { Manager, id, Role, Department } = item;
          obj[Manager] = [id, Role, Department];
          return obj;
        }, {});
        // console.log(managerIndex)
        choiceArr = res.reduce((arr, item) => {
          let newItem = chalk`{cyan ${item.Manager} -}{greenBright  ${item.Department}}`;
          arr.push(newItem);
          return arr;
        }, []);
        // console.log(choiceArr)
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
          Role: manIndex[manager][1],
          Department: manIndex[manager][2]
        }]);
        let table = cTable.getTable(res);
        console.log(' ');
        console.log(titleTbl);
        console.log(table);
        this.parentObj.navQuestion();
      }
    )
  }

  // ===========

  getRoleChoices() {
    let choiceArr;
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
        roleIndex = res.reduce((obj,item) => {
          // OBJECT DESTRUCTURING
          let { title, id, salary, Department } = item;
          obj[title] = [id, salary, Department];
          return obj;
        }, {});
        // console.log(roleIndex)
        choiceArr = res.reduce((arr, item) => {
          let newItem = chalk`{cyan ${item.title} -}{greenBright  ${item.Department}}`;
          arr.push(newItem);
          return arr;
        }, []);
        // console.log(choiceArr)
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
          Salary: roleIndex[role][1],
          Department: roleIndex[role][2]
        }]);
        let table = cTable.getTable(res);
        console.log(' ');
        console.log(titleTbl);
        console.log(table);
        this.parentObj.navQuestion();
      }
    )
  }

  // ===========

  addEmployeeChoicesRole() {
    let roleChoices = [];
    let roleIndex;
    this.connection.query(
      `SELECT 
      role.id,
      department.name AS Department,
      title
      FROM role
      LEFT JOIN department ON role.department_id = department.id;
      `,
      (err, res) => {
        if (err) console.log(err);
        roleIndex = res.reduce((obj, item) => {     
          let { Department, id, title} = item;
          obj[title] = [id, Department];
          roleChoices.push(chalk`{cyan ${title} - }{magenta ${Department}}`)
          return obj;
        }, {});
          // console.log(roleChoices)
          this.parentObj.addEmployeeRole(roleChoices, roleIndex);
      }
    )   
  }

  addEmployeeChoicesManager(dep, otherAnswers, roleIndex) {
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
    WHERE ?);         
      `,
      {
        "department.name": dep
      },
      (err, res) => {
        if (err) console.log(err);
        managerIndex = res.reduce((obj, item) => {     
          let { Employee, id, title} = item;
          obj[Employee] = [id, title];
          managerChoices.push(chalk`{cyan ${Employee} - }{magenta ${title}}`)
          return obj;
        }, {});  
        this.parentObj.addEmployeeManager(managerChoices, managerIndex, roleIndex, otherAnswers)
      }
    )
  }

  endConnection() {
    this.connection.end();
  }
}

module.exports = Queries;