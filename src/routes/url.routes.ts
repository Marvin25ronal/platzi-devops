import { Router, Request, Response } from 'express'
import { Controller } from '../controller';
const router = Router();
const controller = new Controller()

router.post('/add', (req: Request, res: Response) => {
    //Agregamos la nueva url
    const { urls, cluster_id } = req.body;
    controller.saveUrl(cluster_id, urls).then(() => {
        res.status(201).send({
            message: 'Url saved'
        })
    }).catch((e) => {
        res.status(500).send({
            message: e
        })
    }
    )
})

router.delete('/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    controller.deleteUrl(parseInt(id)).then(() => {
        res.status(200).send({
            message: 'Url deleted'
        })
    }).catch((e) => {
        res.status(500).send({
            message: e
        })
    }
    )
})


module.exports = router;