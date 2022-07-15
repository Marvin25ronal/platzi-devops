import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Alert, Button, Card, CardBody, CardTitle, Col, Form, FormGroup, Input, Label, Row, Spinner, Table, Toast, ToastBody, ToastHeader } from 'reactstrap'
import constants from '../../utils/constants'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
const User = () => {
    const [add, setAdd] = useState(false)
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [data, setData] = useState([])
    const [edit, setEdit] = useState(false)
    const [loading, setloading] = useState(false)
    const [editName, setEditName] = useState('')
    const [editEmail, setEditEmail] = useState('')
    const [selected, setSelected] = useState(-1)
    const [message, setMessage] = useState('Defecto')
    const [title, setTitle] = useState('')
    useEffect(() => {
        getInfo()
    }, [])
    const handleSubmit = (e) => {
        e.preventDefault()
        const url = `${constants.API_URL}/user`
        axios.post(url, {
            name: userName,
            email,
            status: 1
        }).then(res => {
            setTitle('Exito')
            setMessage('Usuario agregado correctamente')
            setShowToast(true)
            setAdd(false)
            setUserName('')
            setEmail('')
            getInfo()
        }
        ).catch(err => {
            console.log(err)
        })
    }
    const getInfo = () => {
        const url = `${constants.API_URL}/user/list`
        axios.get(url)
            .then(res => {
                setData(res.data.data)
                setloading(true)
            })
            .catch(err => {
                console.log(err)
            })
    }
    const disableUser = (id, status) => {
        const url = `${constants.API_URL}/user/disable/${id}/${status == 1 ? 0 : 1}`
        axios.put(url)
            .then(res => {
                setTitle('Exito')
                setMessage('Usuario actualizado correctamente')
                setShowToast(true)
                getInfo()
            })
            .catch(err => {
                console.log(err)
            })
    }
    const handleEdit = (e) => {
        e.preventDefault()
        const url = `${constants.API_URL}/user/edit/${selected}`
        axios.put(url, {
            name: editName,
            email: editEmail,
        }).then(res => {
            setTitle('Exito')
            setMessage('Usuario actualizado correctamente')
            setShowToast(true)
            setEdit(false)
            setEditName('')
            setEditEmail('')

            getInfo()
        }
        ).catch(err => {
            console.log(err)
        }
        )

    }
    const handleDelete = (id) => {

        MySwal.fire({
            title: '¿Desea eliminar este usuario?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Confirmar',
            denyButtonText: `Cancelar`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                const url = `${constants.API_URL}/user/${id}`
                axios.delete(url)
                    .then(res => {
                        setTitle('Exito')
                        setMessage('Usuario eliminado correctamente')
                        setShowToast(true)
                        getInfo()
                    })
                    .catch(err => {
                        console.log(err)
                    }
                    )
            }
        })

    }

    const [showToast, setShowToast] = useState(false)

    if(loading){
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
                                        Agregar un nuevo usuario
                                    </CardTitle>
                                    <CardBody>
                                        <Form onSubmit={handleSubmit}>
                                            <FormGroup>
                                                <Label for="AGHB">Nombre</Label>
                                                <Input
                                                    id="clusterName"
                                                    name="clusterName"
                                                    placeholder="Nombre del usuario"
                                                    type="text"
                                                    onChange={(e) => setUserName(e.target.value)}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="AGHB">Correo</Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    placeholder="Correo del usuario"
                                                    type="email"
                                                    onChange={(e) => setEmail(e.target.value)}
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
                                        Editar usuario
                                    </CardTitle>
                                    <CardBody>
                                        <Form onSubmit={handleEdit}>
                                            <FormGroup>
                                                <Label for="AGHB">Nombre</Label>
                                                <Input
                                                    id="clusterName"
                                                    name="clusterName"
                                                    placeholder="Nombre del usuario"
                                                    type="text"
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    value={editName}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="AGHB">Correo</Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    placeholder="Correo del usuario"
                                                    type="email"
                                                    onChange={(e) => setEditEmail(e.target.value)}
                                                    value={editEmail}
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
                                Listado de usuarios
                            </CardTitle>
                            <CardBody>
                                <Table className="no-wrap mt-3 align-middle" responsive >
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Nombre</th>
                                            <th>Correo</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data.map((item, index) => (
                                                <tr key={index} className="border-top" >
                                                    <td>{index + 1}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.email}</td>
                                                    <td >
                                                        {
                                                            item.status === 1 ? (
                                                                <Alert color="success">
                                                                    Activo
                                                                </Alert>
                                                            ) :
                                                                (
                                                                    <Alert color="warning">
                                                                        Inactivo
                                                                    </Alert>
                                                                )
                                                        }
                                                    </td>
                                                    <td>
                                                        <Button className='btn mx-1' color="primary"
                                                            onClick={() => { setEdit(true); setSelected(item.id); setEditName(item.name); setEditEmail(item.email) }}
                                                        >
                                                            <i className="bi bi-pencil-square"></i>
                                                        </Button>
                                                        <Button className='btn mx-1' color="secondary"
                                                            onClick={() => disableUser(item.id, item.status)}
                                                        >
                                                            <i className="bi bi-arrow-left-right"></i>
                                                        </Button>
                                                        <Button className="btn mx-1" color="danger"
                                                            onClick={() => handleDelete(item.id)}
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
    }else{
        return (
            <Row>
                <Col lg="12">
                    <Card>
                        <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                            Cargando.....
                        </CardTitle>
                        <CardBody className='text-center'>
                            <Spinner/>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        )
    }
    
}

export default User