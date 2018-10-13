import React, { Component } from 'react';

const Updates = () => {
    return(
        <div className="updates">
            <div className="panel-block" style={{padding: 0 + "px"}}>
            <table className="table is-striped is-fullwidth">
              <tbody>
                <tr>
                <td>
                    <div className="media">
                        <figure className="image is-32x32">
                        <img src="https://picsum.photos/200/?random" alt="Placeholder image"/>
                        </figure>
                        <div className="media-right">
                            <span>username</span>
                        </div>
                    </div>
                </td>
                <td>3 mins ago</td>
            </tr>
            <tr>
                <td>
                    <div className="media">
                        <figure className="image is-32x32">
                        <img src="https://picsum.photos/200/?random" alt="Placeholder image"/>
                        </figure>
                        <div className="media-right">
                            <span>username</span>
                        </div>
                    </div>
                </td>
                <td>1 hour ago</td>
            </tr>
        </tbody>
        </table>
    </div>
    </div>
    )
}

export default Updates;