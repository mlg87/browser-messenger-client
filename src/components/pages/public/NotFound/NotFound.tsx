import React from 'react';
import { RouteComponentProps } from 'react-router';

export default (props: RouteComponentProps) => {

    return (
        <div>
            <h1>404: Not Found</h1>
            <p>Sorry, Charlie. We don't have anything at <strong>{props.location.pathname}</strong></p>
        </div>
    );

};
