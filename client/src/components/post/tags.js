import React from 'react';
import { Link } from 'react-router-dom'

// functional component to display all commments of a photo
const Tags = (props) => {

    // create comments elements from data passed as props
    const tagslist = props.data.map((obj, index) => {
        return (<span class="tag">{obj}</span>
        ) 
    })

    return (
        <div className="tags">
            {tagslist}
      </div>
    );
}

export default Tags;