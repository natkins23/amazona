import React, { useContext } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Helmet } from 'react-helmet-async'
import MessageBox from '../components/MessageBox'
import { Store } from '../Store'
import { Link, useNavigate } from 'react-router-dom'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleMinus } from '@fortawesome/free-solid-svg-icons'
import Card from 'react-bootstrap/Card'
import axios from 'axios'

export default function CartScreen() {
    const { state, dispatch: cxtDispatch } = useContext(Store)
    const {
        cart: { cartItems },
    } = state

    const itemCount = cartItems.reduce((a, c) => a + c.quantity, 0)
    const totalPrice = cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
    const navigate = useNavigate()
    const updateCartHandler = async (item, quantity) => {
        const { data } = await axios.get(`api/products/${item._id}`)
        if (data.countInStock < quantity) {
            window.alert('Sorry. Product is out of stock')
            return
        }
        cxtDispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...item, quantity },
        })
        navigate(`/cart`)
    }
    const removeItemCartHandler = async (item) => {
        cxtDispatch({
            type: 'CART_REMOVE_ITEM',
            payload: item,
        })
    }
    const checkoutHandler = async (item) => {
        navigate(`/signin?redirect=/shipping`)
    }
    return (
        <div>
            <Helmet>
                <title>Shopping Cart</title>
            </Helmet>
            <h1>Shopping Cart</h1>
            <div className="cart-items">
                <Row>
                    <Col md={8}>
                        {cartItems.length === 0 ? (
                            <MessageBox>
                                Cart is empty <Link to="/">Go Shopping</Link>
                            </MessageBox>
                        ) : (
                            <ListGroup>
                                {cartItems.map((item) => (
                                    <ListGroup.Item key={item._id}>
                                        <Row className="align-items-center">
                                            <Col md={4}>
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="img-fluid rounded img-thumbnail"
                                                ></img>{' '}
                                                <Link
                                                    to={`/product/${item.slug}`}
                                                >
                                                    {item.name}
                                                </Link>
                                            </Col>
                                            <Col md={3}>
                                                <Button
                                                    variant="light"
                                                    disabled={
                                                        item.quantity === 1
                                                    }
                                                    onClick={() =>
                                                        updateCartHandler(
                                                            item,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faCircleMinus}
                                                    />
                                                </Button>{' '}
                                                <span>{item.quantity}</span>{' '}
                                                <Button
                                                    variant="light"
                                                    disabled={
                                                        item.quantity ===
                                                        item.countInStock
                                                    }
                                                    onClick={() =>
                                                        updateCartHandler(
                                                            item,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                >
                                                    <i className="fas fa-plus-circle"></i>
                                                </Button>
                                            </Col>
                                            <Col md={3}>${item.price}</Col>
                                            <Col md={2}>
                                                <Button
                                                    variant="light"
                                                    onClick={() =>
                                                        removeItemCartHandler(
                                                            item
                                                        )
                                                    }
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </Button>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </Col>
                    <Col md={4}>
                        <Card>
                            <Card.Body>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <h3>
                                            Subtotal ({itemCount}
                                            {` `}
                                            {itemCount > 1 ? `items` : `item`})
                                            : ${totalPrice}
                                        </h3>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <div className="d-grid">
                                            <Button
                                                variant="primary"
                                                type="button"
                                                disabled={cartItems.length < 1}
                                                onClick={checkoutHandler}
                                            >
                                                Proceed To Checkout
                                            </Button>
                                        </div>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    )
}
