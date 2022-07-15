import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, CardTitle, Col, Form, FormGroup, Input, Label, Row, Spinner, Table, Toast, ToastBody, ToastHeader } from 'reactstrap'
import constants from '../../utils/constants'
import axios from 'axios';
import { Link } from 'react-router-dom';

const AddCluster = () => {
    const [add, setAdd] = useState(false)
    const [name, setName] = useState('')
    const [message, setMessage] = useState('Defecto')
    const [title, setTitle] = useState('')
    const [showToast, setShowToast] = useState(false)
    const [data, setData] = useState([])
    const [edit, setEdit] = useState(false)
    const [selectedId, setSelectedId] = useState(-1)
    const [editName, setEditName] = useState('')
    const [loading, setloading] = useState(false)
    useEffect(() => {
        getInfo()
    }, [])
    const getInfo = () => {
        const url = `${constants.API_URL}/cluster/listcluster`
        axios.get(url)
            .then(res => {
                setData(res.data.data)
                setloading(true)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const url = `${constants.API_URL}/cluster/add`

        console.log(url)
        axios.post(url, {
            cluster: name
        }).then((res) => {
            if (res.status === 201) {
                setTitle('Exito')
                setMessage('Cluster agregado correctamente')
                setShowToast(true)
                setAdd(false)
                setName('')
                getInfo()
            } else {
                setTitle('Error')
                setMessage('Error al agregar el cluster')
                setShowToast(true)
            }
        }).catch((err) => {
            setTitle('Error')
            setMessage('Error al agregar el cluster')
            setShowToast(true)
        })
        setAdd(false)
    }
    const handleEdit = (e) => {
        e.preventDefault()
        const url = `${constants.API_URL}/cluster`
        axios.put(url, {
            cluster: editName,
            cluster_id: selectedId
        }).then((res) => {
            if (res.status === 200) {
                setTitle('Exito')
                setMessage('Cluster editado correctamente')
                setShowToast(true)
                setEdit(false)
                setEditName('')
                getInfo()
            } else {
                setTitle('Error')
                setMessage('Error al editar el cluster')
                setShowToast(true)
            }
        }).catch((e) => {
            setTitle('Error')
            setMessage('Error al editar el cluster')
            setShowToast(true)
        })

    }
    const deleteClusteer = (id) => {
        if (data[id].urls.length === 0) {
            const url = `${constants.API_URL}/cluster/${data[id].id}`
            axios.delete(url).then((res) => {
                if (res.status === 200) {
                    setTitle('Exito')
                    setMessage('Cluster eliminado correctamente')
                    setShowToast(true)
                    getInfo()
                } else {
                    setTitle('Error')
                    setMessage('Error al eliminar el cluster')
                    setShowToast(true)
                }
            }).catch((e) => {
                setTitle('Error')
                setMessage('Error al eliminar el cluster')
                setShowToast(true)
            })
        } else {
            setTitle('Error')
            setMessage('No se puede eliminar el cluster porque tiene urls asociadas')
            setShowToast(true)
        }
    }
    if (loading)
        return (
            <>
                {
                    showToast && (
                        <div className="p-3 my-2 rounded " style={{
                            position: 'absolute',
                            top: '0',
                            right: '0',
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
                    <Col lg="12" className='mb-3 text-end' >
                        <Button className="btn" color="primary"
                            onClick={() => setAdd(!add)}
                        >
                            Agregar
                        </Button>
                    </Col>
                    {
                        add && (
                            <Col>

                                <Card>
                                    <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                                        <i className="bi-plus-lg me-2"> </i>
                                        Agregar un nuevo cluster
                                    </CardTitle>
                                    <CardBody>
                                        <Form onSubmit={handleSubmit}>
                                            <FormGroup>
                                                <Label for="AGHB">Nombre</Label>
                                                <Input
                                                    id="clusterName"
                                                    name="clusterName"
                                                    placeholder="Nombre del cluster"
                                                    type="text"
                                                    onChange={(e) => setName(e.target.value)}
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
                    {
                        edit && (
                            <Col>

                                <Card>
                                    <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                                        <i className="bi-plus-lg me-2"> </i>
                                        Editar nombre del cluster
                                    </CardTitle>
                                    <CardBody>
                                        <Form onSubmit={handleEdit}>
                                            <FormGroup>
                                                <Label for="AGHB">Nombre</Label>
                                                <Input
                                                    id="clusterName"
                                                    name="clusterName"
                                                    placeholder="Nombre del cluster"
                                                    type="text"
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    value={editName}
                                                />
                                            </FormGroup>
                                            <div className='text-end'>
                                                <Button >Editar</Button>
                                            </div>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </Col>
                        )
                    }

                    <Col lg="12">
                        <Card>
                            <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                                <i className="bi bi-box me-2"> </i>
                                Listado de clusters
                            </CardTitle>
                            <CardBody>
                                <Table className="no-wrap mt-3 align-middle" responsive >
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Nombre</th>
                                            <th>Urls</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data.map((item, index) => (
                                                <tr key={index} className="border-top" >
                                                    <td>{index + 1}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.urls.length}</td>
                                                    <td >
                                                        <div>
                                                            <Link to={"/url/" + item.id + '/view'}>
                                                                <Button className="btn mx-1" color="success">
                                                                    <i className="bi bi-eye"></i>
                                                                </Button>
                                                            </Link>
                                                            <Link to={"/url/" + item.id + '/createurl'}>
                                                                <Button className="btn mx-1" color="primary">
                                                                    <i className="bi-plus-lg"></i>
                                                                </Button>
                                                            </Link>

                                                            <Button className="btn mx-1" color="secondary"
                                                                onClick={() => {
                                                                    setEditName(item.name)
                                                                    setEdit(true)
                                                                    setSelectedId(item.id)

                                                                }
                                                                }
                                                            >
                                                                <i className="bi bi-pencil-square"></i>
                                                            </Button>
                                                            <Button className="btn mx-1" color="danger"
                                                                onClick={() => deleteClusteer(index)}
                                                            >
                                                                <i className="bi bi-x-lg"></i>
                                                            </Button>
                                                        </div>

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
    else return (
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

export default AddCluster