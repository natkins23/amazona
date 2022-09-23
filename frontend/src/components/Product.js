import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Rating from './Rating'
import { Store } from '../Store'
import axios from 'axios'

export default function Product({ product }) {
    const navigate = useNavigate()
    const { state, dispatch: cxtDispatch } = useContext(Store)
    const {
        cart: { cartItems },
    } = state
    const addToCartHandler = async () => {
        const existItem = cartItems.find((x) => x._id === product._id)
        const quantity = existItem ? existItem.quantity + 1 : 1
        const { data } = await axios.get(`/api/products/${product._id}`)
        if (data.countInStock < quantity) {
            window.alert('Sorry. Product is out of stock')
            return
        }
        cxtDispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...product, quantity },
        })
        navigate(`/cart`)
    }
    return (
        <Card className="product">
            <Link to={`/product/${product.slug}`}>
                <Card.Img
                    variant="top"
                    src={product.image}
                    alt={product.name}
                ></Card.Img>
            </Link>

            <Card.Body className="product-info">
                <Link to={`/product/${product.slug}`}>
                    <Card.Title>{product.name}</Card.Title>
                </Link>
                <Rating
                    rating={product.rating}
                    numReviews={product.numReviews}
                ></Rating>
                <Card.Text>${product.price}</Card.Text>
                <Button
                    onClick={addToCartHandler}
                    disabled={product.countInStock < 1}
                >
                    {product.countInStock ? `Add to cart` : `Out of Stock`}
                </Button>
            </Card.Body>
        </Card>
    )
}
