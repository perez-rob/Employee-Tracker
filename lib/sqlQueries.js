const mysql = require('mysql');

class Queries {

  constructor() {
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
      console.log(`connected as id ${this.connection.threadId}\n`);
    })
  }

  displayEmployeeAll() {
    this.connection.query(
      `SELECT * FROM employee;`,
      (err, res) => {
        if (err) console.log(err);
        console.log(res);
      }
    )
  }

  endConnection() {
    this.connection.end();
  }
}

module.exports = Queries;