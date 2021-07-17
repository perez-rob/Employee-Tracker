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
VALUES ("Accountant", 50000, 1);

INSERT INTO role (title, salary, department_id)  -- ID = 2
VALUES ("Data Entry", 25000, 1);

INSERT INTO role (title, salary, department_id)  -- ID = 3
VALUES ("Lead Sales", 55000, 2);

INSERT INTO role (title, salary, department_id)  -- ID = 4
VALUES ("Salesperson", 35000, 2);

INSERT INTO role (title, salary, department_id)  -- ID = 5
VALUES ("Foreman", 40000, 3);

INSERT INTO role (title, salary, department_id)  -- ID = 6
VALUES ("Assembly Line", 24000, 3);

INSERT INTO role (title, salary, department_id)  -- ID = 7
VALUES ("Shipping & Receiving", 24000, 3);

INSERT INTO role (title, salary, department_id)  -- ID = 8
VALUES ("Support Lead", 33000, 4);

INSERT INTO role (title, salary, department_id)  -- ID = 9
VALUES ("Support Staff", 24000, 4);

-- EMPLOYEES

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 1
VALUE ("Tom", "Striker", 1, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 2
VALUE ("Mike", "LaFette", 1, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 3
VALUE ("Sara", "Faun", 1, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 4
VALUE ("Peka", "Tomas", 2, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 5
VALUE ("Clinton", "Pizz", 2, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 6
VALUE ("Penny", "Pax", 3, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 7
VALUE ("Max", "Steel", 4, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 8
VALUE ("Cathy", "Steel", 4, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 9
VALUE ("Patrick", "Longfellow", 5, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 10
VALUE ("Charlie", "Ping", 6, 9);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 11
VALUE ("Fung", "Wu", 6, 9);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 12
VALUE ("Peggy", "Sue", 7, 9);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 13
VALUE ("LaToya", "Johnson", 7, 9);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 14
VALUE ("Justin", "Odom", 8, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 15
VALUE ("Debbie", "Martin", 8, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 16
VALUE ("Chicky", "Channy", 9, 14);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 17
VALUE ("Chip", "Chuds", 9, 14);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 18
VALUE ("Flip", "Friggle", 9, 15);

INSERT INTO employee (first_name, last_name, role_id, manager_id)  -- ID = 19
VALUE ("Honduras", "Hippon", 9, 15);








