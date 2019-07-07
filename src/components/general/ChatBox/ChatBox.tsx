import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import genStyles from '../../../common/styles/general.module.scss';
import useDebounce from '../../../common/utils/useDebounce';
import { withStores } from '../../../common/utils/withStores';
import { Auth } from '../../../stores/Auth/Auth';
import { IUser } from '../../../stores/Auth/types';
import { Messages } from '../../../stores/Messages';
import { Users } from '../../../stores/Users';
import styles from './ChatBox.module.scss';

const URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ChatBox: React.FunctionComponent<IChatBoxProps> = props => {

    const conversationRef = useRef<HTMLDivElement>(null);
    const { current: socket } = useRef(io(URL, {
        query: {
            id: props.auth.user!.id
        }
    }));
    // needs to be destructured in main render
    const { selectedUser } = props.users;
    const { conversationId } = props.messages;

    // used to cleanup values of form when the selected user changes
    // tslint:disable-next-line:max-line-length
    const [currentSelectedUserId, setCurrentSelectedUserId] = useState<number | undefined>(selectedUser ? selectedUser.id : undefined);
    const [isFetching, setIsFetching] = useState(false);
    const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
    const [message, setMessage] = useState<string>('');

    const state: IChatBoxState = {
        currentSelectedUserId,
        isFetching,
        isOtherUserTyping,
        message,
        setCurrentSelectedUserId,
        setIsFetching,
        setIsOtherUserTyping,
        setMessage
    };

    // clears form when a new user is selected to chat with
    useCleanup(selectedUser, state, props);

    // update typing indicator on server
    const debouncedMessage = useDebounce(message, 250);
    useEffect(() => {

        let isTyping = false;
        if (debouncedMessage) {

            isTyping = true;

        }

        socket.emit('user-typing', {
            conversationId,
            isTyping,
            userId: props.auth.user!.id
        });

    }, [debouncedMessage]);

    // socket config
    useEffect(() => {

        socket.on('user-connectivity', user => {

            props.users.updateUsersList(user);

        });

        socket.on('update-conversation', newMessage => {

            props.messages.messages.push(newMessage);
            _scrollToBottom(conversationRef);

        });

        socket.on('update-user-typing', event => {

            const { isTyping, userId } = event;
            if (userId === props.users.selectedUser!.id) {

                setIsOtherUserTyping(isTyping);

            }

        });

        socket.on('error', event => {

            // TODO: handle this

        });

        return () => {

            socket.close();

        };

    }, []);

    // get or create the conversation with the selected user
    useEffect(() => {

        if (selectedUser) {

            const conversation = toJS(props.messages.conversations).find(c => {

                return c.user1.id === selectedUser.id || c.user2.id === selectedUser.id;

            });

            if (!conversation) {

                props.messages.createConversation(selectedUser.id);

            } else {

                props.messages.conversationId = conversation.id;

            }

        }

    }, [selectedUser]);

    useEffect(() => {

        if (conversationId) {

            setIsFetching(true);
            props.messages.getMessagesForConversation().then(() => setIsFetching(false));
            socket.emit('join-room', conversationId);

        }

    }, [conversationId]);

    useEffect(() => {

        if (props.messages.messages.length) {

            _scrollToBottom(conversationRef);

        }

    }, [props.messages.messages]);

    return (
        <div className={styles.container}>
            <header>
                <h2 className={genStyles.sectionTitle}>selected conversation</h2>
                {_renderDescriptor(props)}
            </header>
            <div className={styles.conversation} ref={conversationRef}>
                {_renderConversation(state, props)}
            </div>
            {_renderTypingIndicator(state, props)}
            <form
                className={styles.messageContainer}
                data-testid='chat-box-message-form'
                onSubmit={e => _handleSubmit(e, socket, state, props)}
            >
                <input
                    className={styles.messageInput}
                    disabled={!selectedUser}
                    onChange={e => _handleChange(e, state)}
                    placeholder={selectedUser ? 'start typing...' : 'select a user to start a conversation'}
                    value={message}
                />
                <input
                    className={styles.submit}
                    disabled={!selectedUser || !message}
                    type='submit'
                    value='send'
                />
            </form>
        </div>
    );

};

//
// ─── HOOKS ──────────────────────────────────────────────────────────────────────
//

const useCleanup = (
    selectedUser: IUser | undefined,
    state: IChatBoxState,
    props: IChatBoxProps
) => {

    useEffect(() => {

        if (selectedUser && selectedUser.id !== state.currentSelectedUserId) {

            state.setMessage('');
            state.setCurrentSelectedUserId(selectedUser.id);
            props.messages.messages = [];

        }

    }, [selectedUser]);

};

//
// ─── RENDERING ──────────────────────────────────────────────────────────────────
//

const _renderConversation = (
    state: IChatBoxState,
    props: IChatBoxProps
) => {

    const { messages, auth } = props;

    if (state.isFetching) {

        return <div>loading...</div>;

    }

    if (!messages.messages.length && props.users.selectedUser) {

        return <div>this is the beginning of your conversation</div>;

    }

    return toJS(messages.messages).map(m => {

        const classes = [styles.messageBubble];
        // messages returned from socket dont have full user as from, just id
        if (auth.user!.id === (m.from.id || m.from)) {

            classes.push(styles.currentUser);

        } else {

            classes.push(styles.otherUser);

        }

        return (
            <div key={m.id} className={classes.join(' ')}>
                <div className={styles.timestamp}>{moment.utc(m.createdAt).local().format('HH:mm MM/DD/YY')}</div>
                <div>{m.message}</div>
            </div>
        );

    });

};

const _renderDescriptor = (
    props: IChatBoxProps
) => {

    const { selectedUser } = props.users;

    if (!selectedUser) {

        return <i>no conversation selected. pick one from the user list</i>;

    }

    return <i>conversation with {selectedUser.username}</i>;

};

const _renderTypingIndicator = (
    state: IChatBoxState,
    props: IChatBoxProps
) => {

    let content = '';

    if (state.isOtherUserTyping) {

        content = `${props.users.selectedUser!.username} is typing...`;

    }

    return <div className={styles.typingIndicator}>{content}</div>;

};

//
// ─── HANDLERS ───────────────────────────────────────────────────────────────────
//

export const _handleChange = (
    e,
    state: IChatBoxState
) => {

    state.setMessage(e.target.value);

};

export const _handleSubmit = (
    e: React.SyntheticEvent,
    socket: SocketIOClient.Socket,
    state: IChatBoxState,
    props: IChatBoxProps
) => {

    e.preventDefault();

    // ts null check
    if (!socket) {

        return null;

    }

    socket.emit('new-message', {
        conversationId: props.messages.conversationId,
        from: props.auth.user!.id,
        to: props.users.selectedUser!.id,
        message: state.message
    });

    state.setMessage('');

};

//
// ─── HELPERS ────────────────────────────────────────────────────────────────────
//

const _scrollToBottom = (
    ref: React.RefObject<HTMLDivElement>
) => {

    if (!ref.current) {

        return null;

    }

    ref.current.scrollTop = ref.current.scrollHeight;

};

export default withStores('auth', 'messages', 'users')(observer(ChatBox));

//
// ─── INTERFACES ─────────────────────────────────────────────────────────────────
//

export interface IChatBoxProps {
    readonly auth: Auth;
    readonly messages: Messages;
    readonly users: Users;
}

export interface IChatBoxState {
    readonly currentSelectedUserId?: number;
    readonly isFetching: boolean;
    readonly isOtherUserTyping: boolean;
    readonly message?: string;
    readonly setCurrentSelectedUserId: (value?: number) => void;
    readonly setIsFetching: (value: boolean) => void;
    readonly setIsOtherUserTyping: (value: boolean) => void;
    readonly setMessage: (value: string) => void;
}
