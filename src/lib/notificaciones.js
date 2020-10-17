let notificaciones = {};
//const pool = require("../database");
const { nodemailerConfig } = require('../variablesEntorno');
const nodemailer = require("nodemailer");

notificaciones.notificarCorreo = async (titulo, descripcion,  correoUsuario, enviarCorreo) => {
    try {
        //Envie un correo
        if (enviarCorreo) {
            console.log("2");
            contentHTML = `
            <h1>${titulo}</h1>
            <p>${descripcion}</p>`;

            //Configurar Emisor
            let transporter = nodemailer.createTransport(nodemailerConfig);
            //configurar Receptor
            let info = await transporter.sendMail({
                from: '"Polaru Corp" ' + nodemailerConfig.email_user, // sender address,
                to: correoUsuario,
                subject: titulo,
                html: contentHTML
            });

            console.log(info);

        }
        return { error: false };
    } catch (error) {
        return { error: true };
    }
};

module.exports = notificaciones;