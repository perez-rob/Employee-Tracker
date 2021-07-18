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
      role.title AS Position,
      department.name AS Department,
      role.salary AS Salary,
      CONCAT(m.first_name, ' ', m.last_name) AS Manager 
    FROM employee e
    LEFT JOIN role ON e.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee m ON e.manager_id = m.id;`,
      (err, res) => {
        if (err) console.log(err);
        let table = cTable.getTable(res);
        console.log('\n', table);
        this.parentObj.navQuestion();
      }
    )
  }

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
      role.title AS Position,
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
          Department:' ' + department
        }]);
        let table = cTable.getTable(res);
        console.log('\n', titleTbl);
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
      role.title AS Position, 
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
          let { Manager, id, Position, Department } = item;
          obj[Manager] = [id, Position, Department];
          return obj;
        }, {});
        console.log(managerIndex)
        choiceArr = res.reduce((arr, item) => {
          let newItem = chalk`{cyan ${item.Manager} - ${item.Department}}`;
          arr.push(newItem);
          return arr;
        }, []);
        console.log(choiceArr)
        this.parentObj.viewEmployeeManager(choiceArr, managerIndex);
      }
    )    
  }

  displayEmployeeByManager(manager, manIndex) {
    this.connection.query(
      `SELECT
      e.id AS ID, 
      CONCAT(e.first_name, ' ', e.last_name) AS Employee,
      role.title AS Position        
    FROM employee e
    LEFT JOIN role ON e.role_id = role.id
    WHERE ?;`,
    // THE .split(' - ') METHODS IN THE FOLLOWING LINES ARE NEEDED BECAUSE THE MANAGER PARAMETER HAS
    // THE DEPARTMENT NAME ATTACHED TO IT WHICH NEEDS TO BE REMOVED TO USE THE STRING CORRECTLY
    {
      "e.manager_id": manIndex[manager.split(' - ')[0]][0]
    },
      (err, res) => {
        if (err) console.log(err);
        let titleTbl = cTable.getTable([{
          Manager:' ' + manager.split(' - ')[0],
          Position: ' ' + manIndex[manager.split(' - ')[0]][1],
          Department: ' ' + manIndex[manager.split(' - ')[0]][2]
        }]);
        let table = cTable.getTable(res);
        console.log('\n', titleTbl);
        console.log(table);
        this.parentObj.navQuestion();
      }
    )
  }

  endConnection() {
    this.connection.end();
  }
}

module.exports = Queries;