import { PrismaClient } from "@prisma/client";
const prisma = require('./connection');
const SSL = require("ssl-verifier");
export class Controller {
    prisma: PrismaClient
    constructor() {
        this.prisma = prisma
    }
    async saveCluster(cluster: string) {
        await this.prisma.cluster.create({
            data: {
                name: cluster,
            }
        }).catch((e: any) => {
            console.log(e)
        })
    }
    listUser() {
        return new Promise(async (resolve, reject) => {
            await this.prisma.user.findMany({
            }).then((data: any) => {
                resolve(data)
            }).catch((e: any) => {
                reject(e)
            })
        })
    }
    listOnlyCluster() {
        return new Promise(async (resolve, reject) => {
            await this.prisma.cluster.findMany({
                include: {
                    urls: true
                }
            }).then((data: any) => {
                resolve(data)
            }
            ).catch((e: any) => {
                reject(e)
            }
            )
        }
        )
    }

    listCluster() {
        return new Promise(async (resolve, reject) => {
            try {
                let data = await this.prisma.cluster.findMany({
                    include: {
                        urls: true
                    }
                })
                //Tenemos que hacer los valores extras
                let newclusters = []
                for (let i = 0; i < data.length; i++) {
                    let newurls: any = []
                    let cluster = data[i]
                    for (let j = 0; j < cluster.urls.length; j++) {
                        let newurl: any = {
                            ...cluster.urls[j],
                        }
                        await this.getSSL(cluster.urls[j].domain).then((ssl) => {
                            newurl.ssl = ssl
                        }).catch((e: any) => {
                            newurl.ssl = null
                        })
                        newurls.push(newurl)
                    }
                    let newdata = { ...cluster }
                    newdata.urls = newurls
                    newclusters.push(newdata)
                }
                resolve(newclusters)
            } catch (e: any) {
                console.log(e)
                reject(e)
            }
        })
    }
    async saveUrl(cluster_id: number, url: string[]) {
        for (let i = 0; i < url.length; i++) {
            await this.prisma.url.create({
                data: {
                    domain: url[i],
                    clusterId: cluster_id,
                }
            }).catch((e: any) => {
                console.log(e)
                throw e
            })
        }
    }
    async saveUser(name: string, email: string, status: number) {
        return new Promise(async (resolve, reject) => {
            await this.prisma.user.create({
                data: {
                    name: name,
                    email: email,
                    status: status,
                }
            }).then((data: any) => {
                resolve(data)
            }).catch((e: any) => {
                reject(e)
            })
        })
    }
    async deleteUrl(url_id: number) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.prisma.url.delete({
                    where: {
                        id: url_id
                    }
                }).catch((e: any) => {
                    reject(e)
                }
                )
                resolve({})
            } catch (e) {
                reject(e)
            }
        })
    }
    async disableUser(user_id: number, status: number) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.prisma.user.update({
                    where: {
                        id: user_id
                    },
                    data: {
                        status: status
                    }
                }).catch((e: any) => {
                    reject(e)
                }
                )
                resolve({})
            } catch (e: any) {
                reject(e)
            }
        })
    }
    async editUser(user_id: number, name: string, email: string, status: number) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.prisma.user.update({
                    where: {
                        id: user_id
                    },
                    data: {
                        name: name,
                        email: email,

                    }
                }).catch((e: any) => {
                    reject(e)
                }
                )
                resolve({})
            } catch (e: any) {
                reject(e)
            }
        })
    }
    async deleteUser(user_id: number) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.prisma.user.delete({
                    where: {
                        id: user_id
                    }
                }).catch((e: any) => {
                    reject(e)
                }
                )
                resolve({})
            } catch (e: any) {
                reject(e)
            }
        })
    }

    async deleteCluster(cluster_id: number) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.prisma.cluster.delete({
                    where: {
                        id: cluster_id
                    }
                }).catch((e: any) => {
                    reject(e)
                }
                )
                resolve({})
            } catch (e: any) {
                reject(e)
            }
        })
    }
    async updateCluster(cluster_id: number, cluster: string) {
        return new Promise(async (resolve, reject) => {
            try {
                let data = await this.prisma.cluster.update({
                    where: {
                        id: cluster_id
                    },
                    data: {
                        name: cluster
                    }
                })
                resolve(data)
            } catch (e: any) {
                console.log(e)
                reject(e)
            }
        })
    }
    async getCluster(cluster_id: number) {
        return new Promise(async (resolve, reject) => {
            try {
                let data = await this.prisma.cluster.findUnique({
                    where: {
                        id: cluster_id
                    },
                    include: {
                        urls: true
                    }
                })
                if (data) {
                    let newurls: any = []
                    for (let i = 0; i < data.urls.length; i++) {
                        let newurl: any = {
                            ...data.urls[i],
                        }
                        await this.getSSL(data.urls[i].domain).then((ssl) => {
                            newurl.ssl = ssl
                        }).catch((e: any) => {
                            newurl.ssl = null
                        })
                        newurls.push(newurl)
                    }
                    let newdata = { ...data }
                    newdata.urls = newurls
                    resolve(newdata)
                } else {
                    resolve(data)
                }
            } catch (e: any) {
                reject(e)
            }
        })
    }
    private getSSL(url: string) {
        return new Promise(async (resolve, reject) => {
            try {
                await SSL.Info(url).then((data: any) => {
                    let ssl = {
                        valid: data.valid,
                        validFrom: data.validFrom,
                        validTo: data.validTo,
                        daysRemaining: data.daysRemaining,
                    }
                    resolve(ssl)
                })
            } catch (e: any) {
                reject(e)
            }
        })
    }


}