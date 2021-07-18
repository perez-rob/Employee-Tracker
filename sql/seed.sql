USE employee_trackerDB;

-- DEPARTMENTS

INSERT INTO department (name)  -- ID = 1
VALUES ("Accounting");

INSERT INTO department (name)  -- ID = 2
VALUES ("Sales");

INSERT INTO department (name)  -- ID = 3
VALUES ("Production");

INSERT INTO department (name)  -- ID = 4
VALUES ("Customer Support");

-- ROLES

INSERT INTO role (title, salary, department_id)  -- ID = 1
VALUES ("Accounting Manager", 80000, 1);

INSERT INTO role (title, salary, department_id)  -- ID = 2
VALUES ("Accountant", 50000, 1);

INSERT INTO role (title, salary, department_id)  -- ID = 3
VALUES ("Data Entry", 25000, 1);

INSERT INTO role (title, salary, department_id)  -- ID = 4
VALUES ("Lead Sales", 55000, 2);

INSERT INTO role (title, salary, department_id)  -- ID = 5
VALUES ("Salesperson", 35000, 2);

INSERT INTO role (title, salary, department_id)  -- ID = 6
VALUES ("Foreman", 40000, 3);

INSERT INTO role (title, salary, department_id)  -- ID = 7
VALUES ("Assembly Line", 24000, 3);

INSERT INTO role (title, salary, department_id)  -- ID = 8
VALUES ("Shipping & Receiving", 24000, 3);

INSERT INTO role (title, salary, department_id)  -- ID = 9
VALUES ("Support Lead", 33000, 4);

INSERT INTO role (title, salary, department_id)  -- ID = 10
VALUES ("Support Staff", 24000, 4);

-- EMPLOYEES

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 1
VALUE ("Tom", "Striker", 1, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 2
VALUE ("Mike", "LaFette", 2, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 3
VALUE ("Sara", "Faun", 2, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 4
VALUE ("Peka", "Tomas", 3, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 5
VALUE ("Clinton", "Pizz", 3, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 6
VALUE ("Penny", "Pax", 4, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 7
VALUE ("Max", "Steel", 5, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 8
VALUE ("Cathy", "Steel", 5, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 9
VALUE ("Patrick", "Longfellow", 6, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 10
VALUE ("Charlie", "Ping", 7, 9);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 11
VALUE ("Fung", "Wu", 7, 9);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 12
VALUE ("Peggy", "Sue", 8, 9);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 13
VALUE ("LaToya", "Johnson", 8, 9);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 14
VALUE ("Justin", "Odom", 9, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 15
VALUE ("Debbie", "Martin", 9, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 16
VALUE ("Chicky", "Channy", 10, 14);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 17
VALUE ("Chip", "Chuds", 10, 14);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 18
VALUE ("Flip", "Friggle", 10, 15);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 19
VALUE ("Honduras", "Hippon", 10, 15);








