import { render } from '@testing-library/react';
import { Provider } from 'mobx-react';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { Register } from '../../../components/pages/public';
import appState from '../../../stores';

const setup = () => render(
    <Provider {...appState}>
        <MemoryRouter>
            <Register />
        </MemoryRouter>
    </Provider>
);

describe('Register', () => {

    it('renders', () => {

        const { container } = setup();
        expect(container.firstChild).toMatchSnapshot();

    });

});
