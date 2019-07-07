import { render } from '@testing-library/react';
import { Provider } from 'mobx-react';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { Landing } from '../../../components/pages/public';
import appState from '../../../stores';

const setup = () => render(
    <Provider {...appState}>
        <MemoryRouter>
            <Landing />
        </MemoryRouter>
    </Provider>
);

describe('Landing', () => {

    it('renders', () => {

        const { container } = setup();
        expect(container.firstChild).toMatchSnapshot();

    });

});
