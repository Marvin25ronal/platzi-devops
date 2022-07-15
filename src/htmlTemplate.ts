const fs = require('fs')
export class HtmlTemplate {
    htmlTemplate: string
    constructor() {
        this.htmlTemplate = fs.readFileSync(__dirname + '/../../public/emailTemplate.html', 'utf8')
        //console.log(url)
        //this.htmlTemplate = prisma.
        // this.htmlTemplate=fs.readFile('')
    }
    private createTitle(title: string): string {
        return `<tr> <td class="esd-structure es-p40t es-p10r es-p10l" align="left"> <table cellpadding="0" cellspacing="0" width="100%"> <tbody> <tr> <td width="580" class="esd-container-frame" align="center" valign="top"> <table cellpadding="0" cellspacing="0" width="100%"> <tbody> <tr> <td align="center" class="esd-block-text"> <br> <br> <h1>$title </h1> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr>`
            .replace('$title', title.toString())
    }
    createTable(data: any) {
        const code = `<tr>
        <td class="text-center" style="text-align: center;width: 100%" >
            <table style="margin:auto; width:100%" border="1" >
                <thead>
                    <th>#</th>
                    <th>Cluster</th>
                    <th>Dominio</th>
                    <th>Días restantes</th>
                    <th>Fecha de vencimiento</th>
                </thead>
                <tbody>
                    ${data.map((item: any) => {
            return `<tr>
                        <td>${item[0]}</td>
                        <td>${item[1]}</td>
                        <td>${item[2]}</td>
                        <td>${item[3]}</td>
                        <td>${item[4]}</td>
                    </tr>`
        })}
                </tbody>
            </table>
        </td>
    </tr>`
        return code
    }
    createCode(urls_first_alert: any[], urls_second_alert: any[], urls_third_alert: any[], urls_not_valid: any[], first_alert: number, second_alert: number, third_alert: number) {
        let code = this.htmlTemplate
        let tables = ''
        if (urls_first_alert.length > 0) {
            tables = this.createTitle(`Certificados menor a ${first_alert}`)
            tables += this.createTable(urls_first_alert)
        }
        if (urls_second_alert.length > 0) {
            tables += this.createTitle(`Certificados menor a ${second_alert}`)
            tables += this.createTable(urls_second_alert)
        }
        if (urls_third_alert.length > 0) {
            tables += this.createTitle(`Certificados menor a ${third_alert}`)
            tables += this.createTable(urls_third_alert)
        }
        if (urls_not_valid.length > 0) {
            tables += this.createTitle(`Certificados no válidos`)
            tables += this.createTable(urls_not_valid)
        }
        code = code.replace('$code', tables)
        return code
    }

}