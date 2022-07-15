const nodemailer = require("nodemailer");

export class Mailer {
    config = {
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    }
    transporter = nodemailer.createTransport(this.config);
    async sendMail(to: string, subject: string, html: string) {
        let template = html
        template = template.replace("$user", subject)
        await this.transporter.sendMail({
            from: `${process.env.EMAIL_FROM} <${process.env.EMAIL_USER}>`,
            to: to,
            text: '',
            subject: process.env.EMAIL_SUBJECT,
            html: template
        }, (err:any, info:any) => {
            if (err) {
                // log.error("NO SE PUEDE MANDAR CORREO ", err.message)
                console.log(err)
                throw err
            } else {
                // log.info("CORREO ENVIADO A " + to)
                console.log('MENSAJE ENVIADO A  ' + to)
                console.log("Message sent: %s", info.messageId);

            }
        })
    }
}