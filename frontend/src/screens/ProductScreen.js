import axios from 'axios'
import { useContext, useEffect, useReducer } from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Badge from 'react-bootstrap/esm/Badge'

import { useNavigate, useParams } from 'react-router-dom'
import Rating from '../components/Rating'
import Button from 'react-bootstrap/Button'
import { Helmet } from 'react-helmet-async'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { getError } from '../utils'
import { Store } from '../Store'

const ACTIONS = {
    REQUEST: 'FETCH_REQUEST',
    SUCCESS: 'FETCH_SUCCESS',
    FAIL: 'FETCH_FAIL',
}
const reducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.REQUEST:
            return { ...state, loading: true }
        case ACTIONS.SUCCESS:
            return { ...state, product: action.payload, loading: false }
        case ACTIONS.FAIL:
            return { ...state, loading: false, error: action.payload }
        default:
            return state
    }
}

export default function ProductScreen() {
    const navigate = useNavigate()
    const params = useParams()
    const { slug } = params
    const [{ loading, error, product }, dispatch] = useReducer(reducer, {
        product: [],
        loading: true,
        error: '',
    })

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: ACTIONS.REQUEST })
            try {
                const result = await axios.get(`/api/products/slug/${slug}`)
                dispatch({ type: ACTIONS.SUCCESS, payload: result.data })
            } catch (err) {
                dispatch({ type: ACTIONS.FAIL, payload: getError(err) })
            }
        }
        fetchData()
    }, [slug])

    const { state, dispatch: cxtDispatch } = useContext(Store)
    const { cart } = state
    const addToCartHandler = async () => {
        const existItem = cart.cartItems.find((x) => x._id === product._id)
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
    return loading ? (
        <LoadingBox />
    ) : error ? (
        <MessageBox variant="danger"> {error} </MessageBox>
    ) : (
        <Row>
            <Col md={6}>
                <img
                    className="img-large"
                    src={product.image}
                    alt={product.name}
                ></img>
            </Col>
            <Col md={3}>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <Helmet>
                            <title>{product.name}</title>
                        </Helmet>
                        <h1>{product.name}</h1>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Rating
                            rating={product.rating}
                            numReviews={product.numReviews}
                        ></Rating>
                    </ListGroup.Item>
                    <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                    <ListGroup.Item>
                        Description: {product.description}
                    </ListGroup.Item>
                </ListGroup>
            </Col>
            <Col md={3}>
                <Card>
                    <Card.Body>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        <h5>Status:</h5>
                                    </Col>
                                    <Col className="text-center">
                                        {product.countInStock ? (
                                            <h5>
                                                <Badge bg="success">
                                                    In Stock
                                                </Badge>
                                            </h5>
                                        ) : (
                                            <h5>
                                                <Badge bg="danger">
                                                    Unavailable
                                                </Badge>
                                            </h5>
                                        )}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            {product.countInStock > 0 && (
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            <h5>Stock:</h5>
                                        </Col>
                                        <Col className="text-center">
                                            <h5>{product.countInStock}</h5>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            )}
                            <ListGroup.Item>
                                <div className={`d-grid`}>
                                    <Button
                                        onClick={addToCartHandler}
                                        disabled={
                                            product.countInStock === 0 && 'true'
                                        }
                                        variant="primary"
                                    >
                                        Add to Cart
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}
