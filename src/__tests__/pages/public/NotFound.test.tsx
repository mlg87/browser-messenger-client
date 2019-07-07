import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { NotFound } from '../../../components/pages/public';

const setup = () => render(
    <MemoryRouter>
        <NotFound location={{ pathname: '/nope' }} />
    </MemoryRouter>
);

describe('NotFound', () => {

    it('renders', () => {

        const { container } = setup();
        expect(container.firstChild).toMatchSnapshot();

    });

});
