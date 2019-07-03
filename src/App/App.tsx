import { Provider } from 'mobx-react';
import React from 'react';
import { Root } from '../routes';
import appState from '../stores';

const App: React.FunctionComponent = () => (
    <div>
        <Provider {...appState}>
            <Root />
        </Provider>
    </div>
);

export default App;
