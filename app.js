const express = require('express');
const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'db_employees',
    password: '123',
    port: 5432,
});

const app = express();
const port = 3000;

app.use(express.json());

// listing all resources
app.get('/employees', async (req, res) => {
    try {
        const allEmployees = await pool.query('SELECT * FROM employees');
        res.json(allEmployees.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// getting a resource
app.get('/employees/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const employee = await pool.query('SELECT * FROM employees WHERE id = $1', [id]);
        res.json(employee.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// creating a resource
app.post('/employees', async (req, res) => {
    try {
        const name = req.body.name;
        const departement = req.body.departement;
        const salary = req.body.salary;
        const is_manager = req.body.is_manager;
        const newEmployee = await pool.query(
            'INSERT INTO employees (name, departement, salary, is_manager) VALUES ($1, $2, $3, $4)',
            [name, departement, salary, is_manager]
        );
        res.json(newEmployee.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// updating a resource
app.put('/employees/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const name = req.body.name;
        const departement = req.body.departement;
        const salary = req.body.salary;
        const is_manager = req.body.is_manager;       
        const updateEmployee = await pool.query(
            'UPDATE employees SET name = $1, department = $2, salary = $3, is_manager = $4 WHERE id = $5',
            [name, department, salary, is_manager, id]
        );
        res.json(updateEmployee.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// deleting a resource
app.delete('/employees/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await pool.query('DELETE FROM employees WHERE id = $1', [id]);
        res.json('employee was deleted');
    } catch (err) {
        console.error(err.message);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
