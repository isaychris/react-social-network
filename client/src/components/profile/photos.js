import React from 'react';
import { Link } from 'react-router-dom'

// functional component to display uploaded photos in profile page
const Photos = (props) => {
    // create liked uploaded photo elements from data passed as props
    const photoslist = props.data.map((obj, index) => {
        let link = "/p/" + obj.id
        return (<div key={index} className="user-content image is-square"><Link to={link}><img src={obj.image} alt=""/></Link></div>
        ) 
    })
    

    
    return(
        <div className="grid">
            {photoslist}
        </div>
    )
}

export default Photos;