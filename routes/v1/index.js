const router = require('express').Router();

const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'db_employees',
    password: '123',
    port: 5432,
});


// Welcome route
router.get('/', (req, res) => {
    res.status(200).json({
        status: true,
        message: 'Welcome to Employees API',
        data: null
    });
});

// Get all employees
router.get('/employees', async (req, res) => {
    try {
        const allEmployees = await pool.query('SELECT * FROM employees');
        res.status(200).json({
            status: true,
            message: null,
            data: allEmployees.rows
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            status: false,
            message: 'Server error',
            data: null
        });
    }
});

// Get employee details
router.get('/employees/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const employee = await pool.query('SELECT * FROM employees WHERE id = $1', [id]);
        if (employee.rows.length === 0) {
            return res.status(404).json({
                status: false,
                message: `Can't find employee with id ${id}`,
                data: null
            });
        }
        res.status(200).json({
            status: true,
            message: null,
            data: employee.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            status: false,
            message: 'Server error',
            data: null
        });
    }
});

// Create new employee
router.post('/employees', async (req, res) => {
    const { name, departement, salary, is_manager } = req.body;
    if (!name || !departement || salary === undefined || is_manager === undefined) {
        return res.status(400).json({
            status: false,
            message: 'Name, departement, salary, and is_manager are required',
            data: null
        });
    }
    try {
        await pool.query(
            'INSERT INTO employees (name, departement, salary, is_manager) VALUES ($1, $2, $3, $4)',
            [name, departement, salary, is_manager]
        );
        res.status(201).json({
            status: true,
            message: 'Employee created successfully',
            data: null // Or return the created employee details if needed
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            status: false,
            message: 'Server error',
            data: null
        });
    }
});

// Update employee details
router.put('/employees/:id', async (req, res) => {
    const id = req.params.id;
    const { name, departement, salary, is_manager } = req.body;
    try {
        const result = await pool.query(
            'UPDATE employees SET name = $1, departement = $2, salary = $3, is_manager = $4 WHERE id = $5',
            [name, departement, salary, is_manager, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({
                status: false,
                message: `Can't find employee with id ${id}`,
                data: null
            });
        }
        res.status(200).json({
            status: true,
            message: 'Employee updated successfully',
            data: null // Or return the updated employee details if needed
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            status: false,
            message: 'Server error',
            data: null
        });
    }
});

// Delete employee
router.delete('/employees/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await pool.query('DELETE FROM employees WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({
                status: false,
                message: `Can't find employee with id ${id}`,
                data: null
            });
        }
        res.status(200).json({
            status: true,
            message: 'Employee deleted successfully',
            data: null
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            status: false,
            message: 'Server error',
            data: null
        });
    }
});

module.exports = router;