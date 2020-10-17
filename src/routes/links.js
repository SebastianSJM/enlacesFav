const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');
const correo  = require('../lib/notificaciones');

router.get('/add', (req, res) => {
    res.render('links/add');
});

router.post('/add', async (req, res) => {
    const { title, url, description } = req.body;
    const datos = await pool.query("SELECT correo FROM users WHERE id = ?", [req.user.id]);
    const newLink = {
        title,
        url,
        description,
        user_id: req.user.id
    };
    //console.log(datos[0].correo);
    await pool.query('INSERT INTO links set ?', [newLink]);
    correo.notificarCorreo("Nuevo Link Añadido","Has añadido un nuevo link", datos[0].correo,true);
    req.flash('success', 'Link Guardado Correctamente');
    res.redirect('/links');
});

router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    res.render('links/list', { links });
});

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE ID = ?', [id]);
    req.flash('success', 'Link Eliminado Con Exito');
    res.redirect('/links');
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    console.log(links);
    res.render('links/edit', {link: links[0]});
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, url} = req.body; 
    const newLink = {
        title,
        description,
        url
    };
    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Link Actualizado Con Exito');
    res.redirect('/links');
});

module.exports = router;