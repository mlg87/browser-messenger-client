import { act, fireEvent, render } from '@testing-library/react';
import React from 'react';
import { UserCard } from '../../../components/general';
import { IUserCardProps } from '../../../components/general/UserCard/UserCard';
import appState from '../../../stores';

const startingProps: IUserCardProps = {
    user: {
        id: 123,
        isOnline: true,
        username: 'test'
    },
    users: appState.users
};

const setup = (props: IUserCardProps = startingProps) => render(
    <UserCard  {...props} />
);

describe('UserCard', () => {

    it('renders', () => {

        const { container } = setup();
        expect(container.firstChild).toMatchSnapshot();

    });

    it('sets the selected user when the user clicks the card', () => {

        const { container, getByRole } = setup();
        const card = getByRole('button');

        act(() => {

            fireEvent.click(card);

        });

        expect(container.firstChild).toMatchSnapshot();
        expect(appState.users.selectedUser).toBeDefined();
        expect(appState.users.selectedUser!.id).toEqual(123);

    });

});
