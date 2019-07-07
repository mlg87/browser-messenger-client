import { render } from '@testing-library/react';
import React from 'react';
import App from '../App/App';

const setup = () => render(<App />);

describe('App', () => {

    it('renders', () => {

        const { container, debug } = setup();
        expect(container.firstChild).toMatchSnapshot();

    });

});
