import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { withStores } from '../../../../common/utils/withStores';
import { Auth } from '../../../../stores/Auth/Auth';
import { Messages } from '../../../../stores/Messages';
import { ChatBox, UserList } from '../../../general';
import styles from './Home.module.scss';

const Home: React.FunctionComponent<IHomeProps> = props => {

    const { user } = props.auth;

    useEffect(() => {

        if (user) {

            props.messages.fetchConversations();

        }

    }, [user]);

    if (!user) {

        return null;

    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>oh hello, <span className={styles.username}>{user.username}</span></h1>
                <span className={styles.welcomeMessage}>
                    <p>welcome to browser-messenger.&nbsp;</p>
                    <a className={styles.logout} onClick={props.auth.logout}>logout</a>
                </span>
            </header>
            <main className={styles.main}>
                <UserList />
                <ChatBox />
            </main>
        </div>
    );

};

export default withStores('auth', 'messages')(observer(Home));

//
// ─── INTERFACES ─────────────────────────────────────────────────────────────────
//

export interface IHomeProps {
    readonly auth: Auth;
    readonly messages: Messages;
}
