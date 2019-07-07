import { act, fireEvent, render } from '@testing-library/react';
import React from 'react';
import io from 'socket.io-client';
import { ChatBox } from '../../../components/general';
import { IChatBoxProps } from '../../../components/general/ChatBox/ChatBox';
import appState from '../../../stores';
import { Messages } from '../../../stores/Messages';

jest.mock('socket.io-client', () => {

    const socket = {
        close: jest.fn(),
        emit: jest.fn(),
        on: jest.fn(),

    };

    return () => socket;

});

const startingProps: IChatBoxProps = {
    ...appState,
    auth: {
        ...appState.auth,
        user: {
            id: 23,
            isOnline: true,
            username: 'test-auth-user'
        }
    }
};

const setup = (props: IChatBoxProps = startingProps) => render(

    <ChatBox {...props} />
);

describe('ChatBox', () => {

    beforeEach(() => {

        jest.resetAllMocks();

    });

    it('renders', () => {

        const { container } = setup();
        expect(container.firstChild).toMatchSnapshot();

    });

    describe('the conversation between the authed user and another user', () => {

        it('renders a message saying it is the beginning of the convesation if there are no messages', () => {

            const props = {
                ...startingProps,
                users: {
                    ...startingProps.users,
                    selectedUser: {
                        id: 456,
                        isOnline: false,
                        username: 'test-456'
                    }
                }
            };
            const { container } = setup(props);

            expect(container.firstChild).toMatchSnapshot();

        });

        it('renders the messages from the users if there are any', () => {

            const messages = new Messages();
            messages.messages = [
                {
                    createdAt: '2019-07-02 21:51:29.637306', from: 23, id: 1, to: 456, message: 'hi'
                }
            ];

            const props = {
                ...startingProps,
                users: {
                    ...startingProps.users,
                    selectedUser: {
                        id: 456,
                        isOnline: false,
                        username: 'test-456'
                    }
                },
                messages
            };
            const { container } = setup(props);

            expect(container.firstChild).toMatchSnapshot();

        });

        it('submits the message when the user pushes send or hits enter and there is a value in the input', () => {

            const conversationId = 999;
            const messages = new Messages();
            messages.conversationId = conversationId;
            messages.messages = [
                {
                    createdAt: '2019-07-02 21:51:29.637306', from: 23, id: 1, to: 456, message: 'hi'
                }
            ];

            const props = {
                ...startingProps,
                users: {
                    ...startingProps.users,
                    selectedUser: {
                        id: 456,
                        isOnline: false,
                        username: 'test-456'
                    }
                },
                messages
            };
            const message = 'second message';
            const { getByPlaceholderText, getByTestId } = setup(props);
            const mocket = io();

            fireEvent.change(getByPlaceholderText('start typing...'), { target: { value: message } });
            fireEvent.submit(getByTestId('chat-box-message-form'));

            expect(mocket.emit).toHaveBeenLastCalledWith('new-message', {
                conversationId,
                from: startingProps.auth.user!.id,
                message,
                to: props.users.selectedUser.id
            });

        });

    });

});
