import React from "react";
import { Route, Redirect } from "react-router-dom";

// renders route and passes along props, used to redirect unauthenticated users to login
export default function PrivateRoute({component: Component, authenticated, ...rest}) {
    return (
        <Route  {...rest} 
        render={ props => authenticated === true ? (<Component {...props} {...rest} />) : (<Redirect to="/login" />)}
        />
    );
}