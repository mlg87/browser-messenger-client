import { observer } from 'mobx-react';
import React from 'react';
import { withStores } from '../../../common/utils/withStores';
import { IUser } from '../../../stores/Auth/types';
import { Users } from '../../../stores/Users';
import styles from './UserCard.module.scss';

const UserCard: React.FunctionComponent<IUserCardProps> = props => {

    const { user, users: { selectedUser } } = props;

    const isSelected = selectedUser && selectedUser.id === user.id;

    return (
        <div
            className={styles.container}
            data-testid='user-card'
            onClick={() => _handleClick(props)}
            role='button'
        >
            {isSelected && <div className={styles.selectedIndicator}>>>></div>}
            <div>{user.username}</div>
            {user.isOnline && <div className={styles.statusIndicator} />}
        </div>
    );

};

//
// ─── HANDLERS ───────────────────────────────────────────────────────────────────
//

export const _handleClick = (
    props: IUserCardProps
) => {

    props.users.selectedUser = props.user;

};

export default withStores('users')(observer(UserCard));

//
// ─── INTERFACES ─────────────────────────────────────────────────────────────────
//

export interface IUserCardProps {
    readonly user: IUser;
    readonly users: Users;
}
