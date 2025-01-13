const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3001;
app.use(cors());

const DB = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'gritfit_db'
});

DB.connect((err) => {
    if (err) throw err;
    console.log('Connected to gritfit database!');
});

// Query del get de la tabla categorías
app.get('/api/categories', (req, res) => {
    const MY_SQL = 'SELECT * FROM categories';
    DB.query(MY_SQL, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

//Query del get de la tabla de productos
app.get('/api/products', (req, res) => {
    const MY_SQL = 'SELECT * FROM PRODUCT';
    DB.query(MY_SQL, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
})

// Query del GET que nos da la lista de productos por categoría seleccionada
app.get('/api/productsXcategories/:id', (req, res) => {
    // Obtenemos el id de la categoría desde los parámetros de la URL
    const categoryId = req.params.id;

    // Consulta SQL corregida
    const MY_SQL = `
        SELECT PRODUCT.product_name, PRODUCT.price, PRODUCT.image_url 
        FROM PRODUCT 
        INNER JOIN CATEGORY ON PRODUCT.id_category = CATEGORY.id_category 
        WHERE CATEGORY.id_category = ?`;

    // Ejecutamos la consulta, pasando el id de la categoría como parámetro
    DB.query(MY_SQL, [categoryId], (err, result) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.json(result);
    });
});


//Ponemos a escuchar el servidor
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}!`);
});