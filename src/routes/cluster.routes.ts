import { Router, Request, Response } from 'express'
import { Controller } from '../controller';
const router = Router();
const controller = new Controller()
router.post('/add', (req: Request, res: Response) => {
    //Agregamos el nuevo cluster
    const { cluster } = req.body;
    controller.saveCluster(cluster).then(() => {
        res.status(201).send({
            message: 'Cluster saved'
        })
    }).catch((e) => {
        res.status(500).send({
            message: e
        })
    })
})
router.get('/list', async (req: Request, res: Response) => {
    await controller.listCluster().then((data) => {
        res.status(200).send({
            data: data
        })
    }).catch((e) => {
        res.status(500).send({
            error: e
        })
    })
})
router.get('/listcluster', async (req: Request, res: Response) => {
    await controller.listOnlyCluster().then((data) => {
        res.status(200).send({
            data: data
        })
    }).catch((e) => {
        res.status(500).send({
            error: e
        })
    })
})

router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    await controller.getCluster(parseInt(id)).then((data) => {
        res.status(200).send({
            data: data
        })
    }).catch((e) => {
        res.status(500).send({
            error: e
        })
    })
})

router.put('/', async (req: Request, res: Response) => {
    const { cluster_id, cluster } = req.body;
    await controller.updateCluster(parseInt(cluster_id), cluster).then(() => {
        res.status(200).send({
            message: 'Cluster updated'
        })
    }).catch((e) => {
        res.status(500).send({
            message: e
        })
    })

})

router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    await controller.deleteCluster(parseInt(id)).then(() => {
        res.status(200).send({
            message: 'Cluster deleted'
        })
    }).catch((e) => {
        res.status(500).send({
            message: e
        })
    }
    )
}
)

module.exports = router