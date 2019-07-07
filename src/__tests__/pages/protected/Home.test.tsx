import { render } from '@testing-library/react';
import { Provider } from 'mobx-react';
import React from 'react';
import { Home } from '../../../components/pages/protected';
import appState from '../../../stores';

const setup = () => render(
    <Provider {...appState}>
        <Home />
    </Provider>
);

describe('Home', () => {

    it('renders', () => {

        const { container } = setup();
        expect(container.firstChild).toMatchSnapshot();

    });

});
