import React from 'react';
import { Link } from 'react-router-dom'

const Likes = (props) => {
    const likeslist = props.data.map((obj, index) => {
        let link = "/p/" + obj.id
        return (<div key={index} className="user-content image is-square"><Link to={link}><img src={obj.image} alt=""/></Link></div>
        ) 
    })
    return(
        <div className="grid">
            {likeslist}
        </div>
    )
}

export default Likes;