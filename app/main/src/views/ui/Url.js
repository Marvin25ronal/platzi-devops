import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Alert, Button, Card, CardBody, CardTitle, Col, Form, FormGroup, Input, Label, Row, Spinner, Table, Toast, ToastBody, ToastHeader } from 'reactstrap'
import constants from '../../utils/constants'
import Moment from 'moment';

export default function Url() {
    const id = useParams().id
    const mode = useParams().mode
    const [data, setData] = useState({})
    const [loading, setloading] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [domain, setDomain] = useState('')
    const [showToast, setShowToast] = useState(false)
    const [message, setMessage] = useState('Defecto')
    const [title, setTitle] = useState('')
    /*
    Vamos a tener unos modos para utilizar el codigo y la tabla
    1. Modo para ver url-- no se abre el modal
    2. Modo para agregar url-- se abre el modal
    */
    useEffect(() => {
        getData()
        if (mode === 'createurl') {
            setOpenModal(true)
        }
    }, [id])

    const getData = async () => {
        axios.get(`${constants.API_URL}/cluster/${id}`).then((res) => {
            console.log(res.data.data)
            setData(res.data.data)
            setloading(true)
        }).catch((err) => {
            console.log(err)
        }
        )
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        const url = `${constants.API_URL}/url/add`
        //Tenemos que separar las urls

        const urls = domain.split(',')
        axios.post(url, {
            urls: urls,
            cluster_id: parseInt(id)
        }).then((res) => {
            if (res.status === 201) {
                setTitle('Exito')
                setMessage('Urls agregadas correctamente')
                setShowToast(true)
                //setOpenModal(false)
                setDomain('')
                getData()
            } else {
                setTitle('Error')
                setMessage('Error al agregar la url')
                setShowToast(true)
            }
        }).catch((err) => {
            setTitle('Error')
            setMessage('Error al agregar la url')
            setShowToast(true)
        }
        )
    }
    const delteUrl = async (id) => {
        const url = `${constants.API_URL}/url/${id}`
        axios.delete(url).then((res) => {
            if (res.status === 200) {
                setTitle('Exito')
                setMessage('Url eliminada correctamente')
                setShowToast(true)
                getData()
            }
        }).catch((err) => {
            setTitle('Error')
            setMessage('Error al eliminar la url')
            setShowToast(true)
        }
        )
    }

    Moment.locale('es');
    if (loading) {
        return (
            <>
                {
                    showToast && (
                        <div className="p-3 my-2 rounded " style={{
                            position: 'absolute',
                            top: '0',
                            right: '0',
                            zIndex: '1'
                        }} >
                            <Toast onClick={() => setShowToast(false)}>
                                <ToastHeader icon="primary">
                                    {title}
                                </ToastHeader>
                                <ToastBody>
                                    {message}
                                </ToastBody>
                            </Toast>
                        </div>
                    )
                }
                <Row>
                    {
                        openModal && mode == 'createurl' && (
                            <Col lg="12">
                                <Card>
                                    <CardTitle tag="h6" className='border-bottom p-3 mb-0'>
                                        <i className="bi bi-link-45deg"></i>
                                        Agregar url a {data.name}
                                    </CardTitle>
                                    <CardBody>
                                        <Form onSubmit={handleSubmit}>
                                            <FormGroup>
                                                <Label>Dominio de url (separada por comas)</Label>
                                                <Input
                                                    id="domainName"
                                                    name="domainName"
                                                    placeholder="Dirección de url"
                                                    type="text"
                                                    onChange={(e) => setDomain(e.target.value)}
                                                    value={domain}
                                                />
                                            </FormGroup>
                                            <div className='text-end'>
                                                <Button >Submit</Button>
                                            </div>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </Col>
                        )
                    }
                    <Col>
                        <Card>
                            <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                                <i className="bi bi-card-text me-2"> </i>
                                {data.name}
                            </CardTitle>
                            <CardBody>
                                <Table bordered>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Dominio</th>
                                            <th>Estado</th>
                                            <th>Fecha de vencimiento</th>
                                            <th>Dias restantes</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            loading && data.urls.map((domain, index) => (
                                                <tr key={index}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td>{domain.domain}</td>
                                                    <td>
                                                        {
                                                            domain.ssl == null && (
                                                                <Alert color="danger">
                                                                    Error en la url
                                                                </Alert>
                                                            )
                                                        }
                                                        {
                                                            (domain.ssl != null) ? (



                                                                (domain.ssl.valid === true) ? (
                                                                    <Alert color="success">
                                                                        Valida
                                                                    </Alert>
                                                                )
                                                                    :
                                                                    (
                                                                        (domain.ssl.daysRemaining < 5 &&
                                                                            domain.ssl.daysRemaining > 1) ? (
                                                                            <Alert color="warning">
                                                                                Proxima a vencer
                                                                            </Alert>
                                                                        )
                                                                            :
                                                                            <Alert color="danger">
                                                                                Es necesario renovar
                                                                            </Alert>
                                                                    )
                                                            )
                                                                :
                                                                null
                                                        }
                                                    </td>
                                                    <td>{domain.ssl != null ? Moment(domain.ssl.validTo).format('DD/MM/YYYY') : 'Error'}</td>
                                                    <td>{domain.ssl != null ? domain.ssl.daysRemaining : "Error"}</td>
                                                    <td>
                                                        <Button className="btn mx-1" color="danger"
                                                            onClick={() => delteUrl(domain.id)}
                                                        >
                                                            <i className="bi bi-x-lg"></i>
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </>
        )
    } else {
        return (
            <Row>
                <Col lg="12">
                    <Card>
                        <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                            Cargando.....
                        </CardTitle>
                        <CardBody className='text-center'>
                            <Spinner />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        )
    }

}
