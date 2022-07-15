
import { HtmlTemplate } from "./htmlTemplate";
import { Mailer } from "./email"
const schedule = require('node-schedule');
const prisma = require('./connection');
const SSL = require("ssl-verifier");

export class Job {
    initJob() {
        const rule = new schedule.RecurrenceRule();
        rule.hour = 0
        rule.minute = 0
        rule.tz = 'America/Guatemala'
        schedule.scheduleJob(rule, async () => {
            await this.runJob();
        });
    }
    async runJob() {
        console.log('Start job ');
        let first_alert = process.env.FIRST_ALERT || 5
        let second_alert = process.env.SECOND_ALERT || 3
        let third_alert = process.env.THIRD_ALERT || 1
        const mailer = new Mailer()
        first_alert = parseInt(first_alert.toString())
        second_alert = parseInt(second_alert.toString())
        third_alert = parseInt(third_alert.toString())
        //Tenemos que listar todos los clusters con sus urls
        try {
            let clusters = await prisma.cluster.findMany({
                include: {
                    urls: true,
                }
            })
            let clusters_with_errors: any[] = []
            //Tenemos que verficar cada una de las urls
            for (let i = 0; i < clusters.length; i++) {
                let cluster = clusters[i]
                let cluster_error: {
                    name: string,
                    urls_first_alert: any[],
                    urls_second_alert: any[],
                    urls_third_alert: any[],
                    urls_not_valid: any[],
                } = {
                    name: cluster.name,
                    urls_first_alert: [],
                    urls_third_alert: [],
                    urls_second_alert: [],
                    urls_not_valid: []
                }
                for (let j = 0; j < cluster.urls.length; j++) {
                    let url = cluster.urls[j]
                    await SSL.Info(url.domain).then((ssl: any) => {
                        if (ssl.valid) {

                            if (ssl.daysRemaining > first_alert) {
                                //No hacemos nada aun esta bien
                                return;
                            } else {
                                let newError = {
                                    domain: url.domain,
                                    daysRemaining: ssl.daysRemaining,
                                    validTo: ssl.validTo,
                                    valid: ssl.valid,
                                }
                                if (ssl.daysRemaining <= third_alert) {
                                    //Hacemos una alerta
                                    cluster_error.urls_third_alert.push(newError)
                                } else if (ssl.daysRemaining <= second_alert) {
                                    cluster_error.urls_second_alert.push(newError)
                                } else if (ssl.daysRemaining <= first_alert) {
                                    cluster_error.urls_first_alert.push(newError)
                                }
                            }
                        } else {
                            //Tenemos que crear una lista de clusters con sus urls
                            let newError = {
                                domain: url.domain,
                                daysRemaining: ssl.daysRemaining,
                                validTo: ssl.validTo,
                                valid: ssl.valid,
                            }
                            cluster_error.urls_not_valid.push(newError)
                        }
                    })

                }
                clusters_with_errors.push(cluster_error)
            }

            //Ya tenemso todo ordenado es hora de enviar los correos
            console.table(clusters_with_errors)
            const htmlTemplate = new HtmlTemplate();
            //Ya tenemos el template tenemos que dividir cada uno de los que tengan la primera alerta
            let clusters_with_first_alert: any[] = []
            let clusters_with_second_alert: any[] = []
            let clusters_with_third_alert: any[] = []
            let clusters_with_not_valid: any[] = []
            for (let i = 0; i < clusters_with_errors.length; i++) {
                //Dividimos uno por uno
                let cluster = clusters_with_errors[i]
                if (cluster.urls_first_alert.length > 0) {
                    for (let j = 0; j < cluster.urls_first_alert.length; j++) {
                        let url = cluster.urls_first_alert[j]
                        clusters_with_first_alert.push([clusters_with_first_alert.length + 1, cluster.name, url.domain, url.daysRemaining, url.validTo, url.valid])
                    }

                }
                if (cluster.urls_second_alert.length > 0) {
                    for (let j = 0; j < cluster.urls_second_alert.length; j++) {
                        let url = cluster.urls_second_alert[j]
                        clusters_with_second_alert.push([clusters_with_second_alert.length + 1, cluster.name, url.domain, url.daysRemaining, url.validTo, url.valid])
                    }
                }
                if (cluster.urls_third_alert.length > 0) {
                    for (let j = 0; j < cluster.urls_third_alert.length; j++) {
                        let url = cluster.urls_third_alert[j]
                        clusters_with_third_alert.push([clusters_with_third_alert.length + 1, cluster.name, url.domain, url.daysRemaining, url.validTo, url.valid])
                    }
                }
                if (cluster.urls_not_valid.length > 0) {
                    for (let j = 0; j < cluster.urls_not_valid.length; j++) {
                        let url = cluster.urls_not_valid[j]
                        clusters_with_not_valid.push([clusters_with_not_valid.length + 1, cluster.name, url.domain, url.daysRemaining, url.validTo, url.valid])
                    }
                }
            }
            let code = htmlTemplate.createCode(clusters_with_first_alert, clusters_with_second_alert, clusters_with_third_alert, clusters_with_not_valid, first_alert, second_alert, third_alert)
            //htmlTemplate.createTable(clusters_with_first_alert)
            //Leemos de la base de datos los usuarios
            let users = await prisma.user.findMany({
                where: {
                    status: 1
                }
            })
            if (clusters_with_first_alert.length == 0 && clusters_with_second_alert.length == 0 && clusters_with_third_alert.length == 0 && clusters_with_not_valid.length == 0) {
                console.log('NO HAY RESTANTES')
                return;
            }
            //Les mandamos correo con el codigo
            for (let i = 0; i < users.length; i++) {
                let user = users[i]
                mailer.sendMail(user.email, user.name, code)
            }

        } catch (e) {
            console.log(e)
        }

    }
}