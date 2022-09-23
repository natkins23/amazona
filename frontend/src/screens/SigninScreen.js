import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Container from 'react-bootstrap/esm/Container'
import Form from 'react-bootstrap/esm/Form'
import { Helmet } from 'react-helmet-async'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Store } from '../Store'
import { getError } from '../utils'

export default function SigninScreen() {
    const navigate = useNavigate()
    const { search } = useLocation()
    const redirectInURL = new URLSearchParams(search).get('redirect')
    const redirect = redirectInURL ? redirectInURL : '/'

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { state, dispatch: ctxDispatch } = useContext(Store)
    const { userInfo } = state
    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.post('/api/users/signin', {
                email,
                password,
            })
            ctxDispatch({ type: 'USER_SIGNIN', payload: data })
            localStorage.setItem('userInfo', JSON.stringify(data))
            navigate(redirect || '/')
        } catch (error) {
            toast.error(getError(error))
        }
    }
    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, redirect, userInfo])
    return (
        <Container className="small-container">
            <Helmet>
                <title>Sign In</title>
            </Helmet>{' '}
            <h1 className="my-3">Sign In</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="my-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                        type="email"
                        required
                    ></Form.Control>
                </Form.Group>
                <Form.Group className="my-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                        type="password"
                        required
                    ></Form.Control>
                </Form.Group>
                <div className="my-3">
                    <Button type="submit">Sign In</Button>
                </div>
                <div className="my-3">
                    New Customer?{` `}
                    <Link to={`/signup?redirect=${redirect}`}>
                        {' '}
                        Create your account
                    </Link>
                </div>
            </Form>
        </Container>
    )
}
