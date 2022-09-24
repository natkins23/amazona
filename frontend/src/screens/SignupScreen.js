import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import { Helmet } from 'react-helmet-async'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Store } from '../Store'
import { getError } from '../utils'

export default function SignupScreen() {
    const navigate = useNavigate()
    const { search } = useLocation()
    const redirectInURL = new URLSearchParams(search).get('redirect')
    const redirect = redirectInURL ? redirectInURL : '/'

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const { state, dispatch: ctxDispatch } = useContext(Store)
    const { userInfo } = state
    const submitHandler = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }
        try {
            const { data } = await axios.post('/api/users/signup', {
                name,
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
                <title>Sign Up</title>
            </Helmet>{' '}
            <h1 className="my-3">Sign Up</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="my-3" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        onChange={(e) => {
                            setName(e.target.value)
                        }}
                        type="name"
                        required
                    ></Form.Control>
                </Form.Group>
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
                <Form.Group className="my-3" controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        onChange={(e) => {
                            setConfirmPassword(e.target.value)
                        }}
                        type="password"
                        required
                    ></Form.Control>
                </Form.Group>
                <div className="my-3">
                    <Button type="submit">Sign Up</Button>
                </div>
                <div className="my-3">
                    Already have an account?{` `}
                    <Link to={`/signin?redirect=${redirect}`}> Sign-In</Link>
                </div>
            </Form>
        </Container>
    )
}
