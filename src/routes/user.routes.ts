import { Router, Request, Response } from 'express'
import { Controller } from '../controller';
const router = Router();
const controller = new Controller()
router.get('/list', async (req: Request, es: Response) => {
    await controller.listUser().then((data) => {
        es.status(200).send({
            data: data
        })
    }
    ).catch((e) => {
        es.status(500).send({
            error: e
        })
    }
    )
})

router.post('/', async (req: Request, res: Response) => {
    const { name, email, status } = req.body;
    await controller.saveUser(name, email, status).then(() => {
        res.status(201).send({
            message: 'User saved'
        })
    }).catch((e) => {
        res.status(500).send({
            message: e
        })
    })
})
router.put('/disable/:id/:status', (req: Request, res: Response) => {
    const { id, status } = req.params;
    controller.disableUser(parseInt(id), parseInt(status)).then(() => {
        res.status(200).send({
            message: 'user disabled'
        })
    }
    ).catch((e) => {
        res.status(500).send({
            message: e
        })
    }
    )
})
router.put('/edit/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, status } = req.body;
    controller.editUser(parseInt(id), name, email, status).then(() => {
        res.status(200).send({
            message: 'user updated'
        })
    }
    ).catch((e) => {
        res.status(500).send({
            message: e
        })
    }
    )
})
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    await controller.deleteUser(parseInt(id)).then(() => {
        res.status(200).send({
            message: 'User deleted'
        })
    }).catch((e) => {
        res.status(500).send({
            message: e
        })
    }
    )
})

module.exports = router;