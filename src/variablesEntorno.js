let vars = {};

//Email Nodemailer
vars.email_host = "mail.privateemail.com";
vars.email_port = 587;
vars.email_secure = false;
vars.email_user = "cenabastosonline@polaru.xyz";
vars.email_pass = "cenabastosemail";
vars.email_rejectUnauthorized = false;

//Email Nodemailer
vars.nodemailerConfig = {
    host: vars.email_host,
    port: vars.email_port,
    secure: vars.email_secure,
    auth: {
        user: vars.email_user,
        pass: vars.email_pass
    },
    tls: {
        rejectUnauthorized: vars.email_rejectUnauthorized
    }
};

module.exports = vars;