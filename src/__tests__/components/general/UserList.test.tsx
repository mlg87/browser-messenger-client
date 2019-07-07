import { render } from '@testing-library/react';
import { Provider } from 'mobx-react';
import React from 'react';
import { UserList } from '../../../components/general';
import appState from '../../../stores';

const setup = () => render(
    <Provider {...appState}>
        <UserList />
    </Provider>
);

describe('UserList', () => {

    it('renders', () => {

        const { container } = setup();
        expect(container.firstChild).toMatchSnapshot();

    });

});
