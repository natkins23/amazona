import React, { useContext, useEffect, useReducer, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import Form from 'react-bootstrap/Form'
import { Store } from '../Store'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { getError } from '../utils'
import { toast } from 'react-toastify'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import Button from 'react-bootstrap/Button'

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true }
        case 'FETCH_SUCCESS':
            return {
                ...state,
                users: action.payload,
                loading: false,
            }
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload }
        case 'UPDATE_REQUEST':
            return { ...state, loadingUpdate: true }
        case 'UPDATE_SUCCESS':
            return { ...state, loadingUpdate: false, users: action.payload }
        case 'UPDATE_FAIL':
            return { ...state, loadingUpdate: false, error: action.payload }
        default:
            return state
    }
}

export default function UserEditScreen() {
    const { state } = useContext(Store)
    const { userInfo } = state
    const navigate = useNavigate()
    const params = useParams()
    const { id: userId } = params

    const [name, setName] = useState(userInfo.name)
    const [email, setEmail] = useState(userInfo.email)
    const [isAdmin, setIsAdmin] = useState(userInfo.isAdmin)

    const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
        loading: 'true',
        error: '',
    })

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            dispatch({ type: 'UPDATE_REQUEST' })
            await axios.put(
                `/api/users/${userId}`,
                {
                    _id: userId,
                    name,
                    email,
                    isAdmin,
                },
                { headers: { authorization: `bearer ${userInfo.token}` } }
            )
            dispatch({ type: 'UPDATE_SUCCESS' })
            toast.success('User updated successfully')
            navigate('/admin/users')
        } catch (err) {
            toast.error(getError(err))
            dispatch({ type: 'UPDATE_FAIL' })
        }
    }

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' })
                const { data } = await axios.get(`/api/users/${userId}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                })
                setName(data.name)
                setEmail(data.email)
                setIsAdmin(data.isAdmin)
                dispatch({ type: 'FETCH_SUCCESS', payload: data })
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
            }
        }
        fetchUsers()
    }, [userId, userInfo])

    return (
        <div>
            <Helmet>
                <title>Edit User</title>
            </Helmet>
            <h1>Edit User</h1>
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <>
                    <Form onSubmit={submitHandler}>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            ></Form.Control>
                        </Form.Group>
                        <Form.Check
                            className="mb-3"
                            type="checkbox"
                            id="isAdmin"
                            label="isAdmin"
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                        />

                        <div className="mb-3">
                            <Button type="submit">Update</Button>
                        </div>
                    </Form>
                </>
            )}
        </div>
    )
}
