const mysql = require('mysql');
const cTable = require('console.table');

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