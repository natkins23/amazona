import React, { useEffect, useReducer } from 'react'
// import logger from 'use-reducer-logger'
import axios from 'axios'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Product from '../components/Product'
import { Helmet } from 'react-helmet-async'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'

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
            return { ...state, loading: false, products: action.payload }
        case ACTIONS.FAIL:
            return { ...state, loading: false, error: action.payload }
        default:
            return state
    }
}

export default function HomeScreen() {
    const [{ loading, error, products }, dispatch] = useReducer(reducer, {
        products: [],
        loading: true,
        error: '',
    })
    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: ACTIONS.REQUEST })
            try {
                const result = await axios.get('/api/products')
                dispatch({ type: ACTIONS.SUCCESS, payload: result.data })
            } catch (error) {
                dispatch({ type: ACTIONS.FAIL, payload: error.message })
            }
        }
        fetchData()
    }, [])
    return (
        <div>
            <Helmet>
                <title>Amazona</title>
            </Helmet>
            <h1>Featured Products</h1>
            <div className="products">
                {loading ? (
                    <LoadingBox />
                ) : error ? (
                    <MessageBox variant="danger"> {error} </MessageBox>
                ) : (
                    <Row>
                        {products.map((product) => (
                            <Col
                                key={product.slug}
                                sm={6}
                                md={4}
                                lg={3}
                                className="mb-3"
                            >
                                <Product product={product}></Product>
                            </Col>
                        ))}
                    </Row>
                )}
            </div>
        </div>
    )
}
