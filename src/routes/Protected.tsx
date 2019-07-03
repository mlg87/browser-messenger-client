import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Home } from '../components/pages/protected';

const Protected: React.FunctionComponent = () => {

    return (
        <Switch>
            <Route path='/home' component={Home} />
        </Switch>
    );

};

export default Protected;
