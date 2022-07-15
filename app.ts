
import { Controller } from './src/controller';
import { Job } from './src/job';

const SSL = require("ssl-verifier");
const express = require('express')
const morgan = require('morgan')
const prisma = require('./src/connection')
var cors = require('cors');
require("dotenv").config()

const app = express();
app.use(cors())
app.use(morgan('dev'))

app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));
app.use(express.text({ limit: '200mb' }));
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use('/cluster', require('./src/routes/cluster.routes'))
app.use('/url', require('./src/routes/url.routes'))
app.use('/user', require('./src/routes/user.routes'))

// app.post('/check', (req, res) => {
//     SSL.Info(req.body.url/*, {port: 443, method: "GET"}*/).then(data => {

//         //console.log(data);
//         let j = {
//             valid: data.valid,
//             validFrom: data.validFrom,
//             validTo: data.validTo,
//             daysRemaining: data.daysRemaining,
//         }
//         res.send(j)
//     }).catch(error => {

//         console.log(error);
//         res.status(500).send({
//             error: error
//         })
//     });

// })
async function main() {
    // Connect the client
    await prisma.$connect()
    // ... you will write your Prisma Client queries here
}
const PORT = process.env.PORT || 80;
app.listen(PORT, async () => {
    console.log('App running on port: ', PORT)
    main()
        .then(() => {
            console.log('Connected to Prisma')
            console.log('Configuring jobs')
            const job = new Job();
            job.initJob();
        })
        .catch((e) => {
            throw e
        })
        .finally(async () => {
            await prisma.$disconnect()
        })

})
