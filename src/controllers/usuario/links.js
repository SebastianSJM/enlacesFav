const express = require('express');
const router = express.Router();
//const notificacionesManager = require('../../lib/notificaciones.manager');
const pool = require('../../database');
const { isLoggedIn } = require('../../lib/auth');

//const { nodemailerConfig } = require("../../environmentVars");
const nodemailer = require("nodemailer");


router.get('/add', (req, res) => {
    res.render('links/add');
});

router.post('/add', async (req, res) => {
    try {
        const { title, url, description } = req.body;
        const newLink = {
            title,
            url,
            description,
            user_id: req.user.id
        };
        await pool.query('INSERT INTO links set ?', [newLink]);

        const datos = await pool.query("SELECT correo FROM users WHERE id = ?", [req.user.id]);
        correo = datos[0].correo;    

        let transporter = nodemailer.createTransport({
            host: "mail.lamegaplaza.com",
            port: 587,
            secure: false,
            auth: {
                user: "prami@lamegaplaza.com",
                pass: "pramipassprami",
            },
            tls: {
                rejectUnauthorized: false
              }
        });

        let info = await transporter.sendMail({
            from: '"Polaru" <prami@lamegaplaza.com>', // sender address,
            to: correo,
            subject: 'Link guardado con exito',
            html: 'Link guardado con titulo '+title+ ' y enlace '+url
          })

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        req.flash('success', 'Link Guardado Correctamente');
        res.redirect('/usuario/links');
    } catch (error) {
        console.log(error);
    }

});

router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    res.render('links/list', { links });
});

router.get('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const datos = await pool.query("SELECT links.title, links.url, users.correo FROM links INNER JOIN users ON users.id = links.user_id WHERE links.id = ?", [id]);
        const correo = datos[0].correo;    
        const title = datos[0].title; 
        const url = datos[0].url; 

        let transporter = nodemailer.createTransport({
            host: "mail.lamegaplaza.com",
            port: 587,
            secure: false,
            auth: {
                user: "prami@lamegaplaza.com",
                pass: "pramipassprami",
            },
            tls: {
                rejectUnauthorized: false
              }
        });

        let info = await transporter.sendMail({
            from: '"Polaru" <prami@lamegaplaza.com>', // sender address,
            to: correo,
            subject: 'Link borrado con exito',
            html: 'Link borrado con titulo '+title+ ' y enlace '+url
          });

          console.log('Message sent: %s', info.messageId);
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info)); 

        await pool.query('DELETE FROM links WHERE ID = ?', [id]);

        req.flash('success', 'Link Eliminado Con Exito');
        res.redirect('/usuario/links');
    } catch (error) {
        console.log(error);
    }
    
});

router.get('/edit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
        res.render('links/edit', { link: links[0] });
    } catch (error) {
        console.log(error);
    }
});

router.post('/edit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, url } = req.body;
        const newLink = {
            title,
            description,
            url
        };
        await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);

        const datos = await pool.query("SELECT correo FROM users WHERE id = ?", [req.user.id]);
        const correo = datos[0].correo;

        let transporter = nodemailer.createTransport({
            host: "mail.lamegaplaza.com",
            port: 587,
            secure: false,
            auth: {
                user: "prami@lamegaplaza.com",
                pass: "pramipassprami",
            },
            tls: {
                rejectUnauthorized: false
              }
        });

        let info = await transporter.sendMail({
            from: '"Polaru" <prami@lamegaplaza.com>', // sender address,
            to: correo,
            subject: 'Link actualizado con exito',
            html: 'Link actualizado con titulo '+title+ ' y enlace '+url
        });

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info)); 

        req.flash('success', 'Link Actualizado Con Exito');
        res.redirect('/usuario/links');
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;