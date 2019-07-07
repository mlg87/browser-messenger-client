import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { withStores } from '../common/utils/withStores';
import { Landing, Login, NotFound, Register } from '../components/pages/public';
import { Auth } from '../stores/Auth/Auth';
import { Protected } from './index';

const AuthCheck = ({ component: Component, isAuthenticated, ...other }) => {

    const render = props => {

        if (isAuthenticated) {

            return <Redirect push to={{ pathname: '/chat' }} />;

        }

        return <Component {...props} />;

    };

    return (
        <Route
            {...other}
            render={render}
        />
    );

};

const PrivateRoute = ({ component: Component, isAuthenticated, ...other }) => {

    const render = props => {

        if (isAuthenticated) {

            return <Component {...props} />;

        }

        return <Redirect push to={{ pathname: '/login' }} />;

    };

    return (
        <Route
            {...other}
            render={render}
        />
    );

};

const Root: React.FunctionComponent<IRootProps> = props => {

    // this needs to be referenced in the main "render" so the mobx observer
    // works correctly
    const { isAuthenticated } = props.auth;

    useEffect(() => {

        props.auth.validate();

    }, []);

    return (
        <BrowserRouter>
            <Switch>
                <AuthCheck isAuthenticated={isAuthenticated} exact path='/' component={Landing} />
                <AuthCheck isAuthenticated={isAuthenticated} path='/login' component={Login} />
                <AuthCheck isAuthenticated={isAuthenticated} path='/register' component={Register} />
                <PrivateRoute isAuthenticated={isAuthenticated} path='/chat' component={Protected} />
                <Route component={NotFound} />
            </Switch>
        </BrowserRouter>
    );

};

export default withStores('auth')(observer(Root));

//
// ─── INTERFACES ─────────────────────────────────────────────────────────────────
//

export interface IRootProps {
    readonly auth: Auth;
}
