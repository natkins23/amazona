import React from 'react'
import './Rating.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStarHalfStroke, faStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as emptyStar } from '@fortawesome/free-regular-svg-icons'
export default function Rating({ rating, numReviews }) {
    return (
        <>
            <span className="rating">
                <FontAwesomeIcon
                    icon={
                        rating >= 0.8
                            ? faStar
                            : rating >= 0.3
                            ? faStarHalfStroke
                            : emptyStar
                    }
                    className=""
                />
                <FontAwesomeIcon
                    icon={
                        rating >= 1.8
                            ? faStar
                            : rating >= 1.3
                            ? faStarHalfStroke
                            : emptyStar
                    }
                />
                <FontAwesomeIcon
                    icon={
                        rating >= 2.8
                            ? faStar
                            : rating >= 2.3
                            ? faStarHalfStroke
                            : emptyStar
                    }
                />
                <FontAwesomeIcon
                    icon={
                        rating >= 3.8
                            ? faStar
                            : rating >= 3.3
                            ? faStarHalfStroke
                            : emptyStar
                    }
                />
                <FontAwesomeIcon
                    icon={
                        rating >= 4.8
                            ? faStar
                            : rating >= 4.3
                            ? faStarHalfStroke
                            : emptyStar
                    }
                />
            </span>
            <span className="num-ratings"> {numReviews}</span>
        </>
    )
}
