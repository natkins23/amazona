import axios from 'axios'
import React, { useContext, useEffect, useReducer } from 'react'
import Button from 'react-bootstrap/Button'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { Store } from '../Store'
import { getError } from '../utils'

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
        case 'DELETE_REQUEST':
            return { ...state, loadingDelete: true }
        case 'DELETE_SUCCESS':
            return { ...state, loadingDelete: false, successDelete: true }
        case 'DELETE_FAIL':
            return { ...state, loadingDelete: false }
        case 'DELETE_RESET':
            return { ...state, loadingDelete: false, successDelete: false }
        default:
            return state
    }
}

export default function UserListScreen() {
    const { state } = useContext(Store)
    const { userInfo } = state
    const navigate = useNavigate()

    const [{ loading, error, users, loadingDelete, successDelete }, dispatch] =
        useReducer(reducer, {
            loading: 'true',
            error: '',
        })

    const userDeleteHandler = async (userId) => {
        if (window.confirm('Are you sure you want to delete?')) {
            try {
                dispatch({ type: 'DELETE_REQUEST' })
                await axios.delete(`/api/users/${userId}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                })
                dispatch({ type: 'DELETE_SUCCESS' })
            } catch (err) {
                dispatch({ type: 'DELETE_FAIL' })
                toast.error(getError(err))
            }
        }
    }

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' })
                const { data } = await axios.get(`/api/users`, {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                })
                dispatch({ type: 'FETCH_SUCCESS', payload: data })
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
            }
        }
        if (successDelete) {
            dispatch({ type: 'DELETE_RESET' })
        } else {
            fetchUsers()
        }
    }, [userInfo, successDelete])

    return (
        <div>
            <Helmet>
                <title>Users</title>
            </Helmet>
            <h1>Users</h1>
            {loadingDelete && <LoadingBox></LoadingBox>}
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>EMAIL</th>
                                <th>IS ADMIN</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user._id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.isAdmin ? 'YES' : 'NO'}</td>
                                    <td>
                                        <Button
                                            type="button"
                                            variant="light"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/user/${user._id}`
                                                )
                                            }
                                        >
                                            Edit
                                        </Button>
                                        &nbsp;
                                        <Button
                                            type="button"
                                            variant="light"
                                            onClick={() =>
                                                userDeleteHandler(user._id)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    )
}
