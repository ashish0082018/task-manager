const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const dotenv=require('dotenv')
const app = express();

dotenv.config();
// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: process.env.SQL_PASSWORD, 
    database: process.env.DATABASE
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes

// Get All Todos
app.get("/",(req,res)=>{
    res.render('home');
})

app.get('/todo', (req, res) => {
    const query = 'SELECT * FROM todos';
    db.query(query, (err, results) => {
        if (err) throw err;
        res.render('index', { todos: results });
    });
});

// Add Todo
app.post('/add', (req, res) => {
    const { task } = req.body;
    const query = 'INSERT INTO todos (task) VALUES (?)';
    db.query(query, [task], (err, result) => {
        if (err) throw err;
        res.redirect('/todo');
    });
});

// Edit Todo Form
app.get('/edit/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM todos WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) throw err;
        res.render('edit', { todo: result[0] });
    });
});

// Update Todo
app.post('/update/:id', (req, res) => {
    const { id } = req.params;
    const { task, status } = req.body;
    const query = 'UPDATE todos SET task = ?, status = ? WHERE id = ?';
    db.query(query, [task, status, id], (err, result) => {
        if (err) throw err;
        res.redirect('/todo');
    });
});

// Delete Todo
app.get('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM todos WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) throw err;
        res.redirect('/todo');
    });
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
