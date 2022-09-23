import Card from 'react-bootstrap/Card'
import { Link } from 'react-router-dom'

export default function CartItem(props) {
    return (
        <Card animation="border" role="status">
            <Link>{props.name}</Link>
            <img src={props.image}></img>
        </Card>
    )
}
