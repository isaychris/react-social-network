import React from 'react';
import { Link } from 'react-router-dom'
import * as moment from 'moment'

// functional component for sidebar component in main page
const Updates = (props) => {
    // create Update elements from data passed as props
    const updateslist = props.data.map((obj, index) => {
        let last_update = obj.last_update != undefined ? moment(obj.last_update).fromNow() : "never"

        return (<tr key={index}>
            <td>
                <div className="media">
                    <figure className="image is-32x32">
                    <img src={obj.profile_pic} alt=""/>
                    </figure>
                    <div className="media-right">
                        <Link to={`/u/${obj.username}`}>{obj.username}</Link>
                    </div>
                </div>
            </td>
            <td>{last_update}</td>
        </tr>)
    })



    return(
        <div className="updates">
            <div className="panel-block" style={{padding: 0 + "px"}}>
            <table className="table is-striped is-fullwidth">
                <tbody>
                {props.data == 0 && (
                    <tr><td className="has-text-centered">There are no updates</td></tr>)
                }

                {updateslist}
                </tbody>
            </table>
        </div>
        </div>
    )
}

export default Updates;