import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import genStyles from '../../../common/styles/general.module.scss';
import { withStores } from '../../../common/utils/withStores';
import { Users } from '../../../stores/Users';
import { UserCard } from '../index';
import styles from './UserList.module.scss';

const UserList: React.FunctionComponent<IUserListProps> = props => {

    const [isFetching, setIsFetching] = useState(true);

    const state: IUserListState = {
        isFetching,
        setIsFetching
    };

    useEffect(() => {

        props.users.fetchUsers().then(() => setIsFetching(false));

    }, []);

    return (
        <div className={styles.container}>
            <header>
                <h2 className={genStyles.sectionTitle}>users</h2>
                <i>select another user to start chatting</i>
            </header>
            {_renderList(state, props)}
        </div>
    );

};

//
// ─── RENDERING ──────────────────────────────────────────────────────────────────
//

export const _renderList = (
    { isFetching }: IUserListState,
    { users: { totalCount, users } }: IUserListProps
) => {

    if (isFetching) {

        return <div>loading...</div>;

    }

    if (!totalCount) {

        return <div>there are no users to chat with :(</div>;

    }

    return users.map(u => <UserCard key={u.id} user={u} />);

};

export default withStores('users')(observer(UserList));

//
// ─── INTERFACES ─────────────────────────────────────────────────────────────────
//

export interface IUserListProps {
    readonly users: Users;
}

export interface IUserListState {
    readonly isFetching: boolean;
    readonly setIsFetching: (value: boolean) => void;
}
