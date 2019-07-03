import { action, observable } from 'mobx';
import { Api } from '../services';
import { IUser } from './Auth/types';

export class Users {

    //
    // ─── OBSERVABLES ────────────────────────────────────────────────────────────────
    //

    @observable selectedUser?: IUser;
    @observable totalCount: number = 0;
    @observable users: IUser[] = [];

    //
    // ─── ACTIONS ────────────────────────────────────────────────────────────────────
    //

    @action fetchUsers = async () => {

        try {

            const res = await Api.get('/users', null);

            if (!res.ok) {

                const message = res.data && res.data.message;
                throw Error(message || 'Error fetching users.');

            }

            this.totalCount = res.data.count;
            this.users = res.data.users;

            return Promise.resolve();

        } catch (error) {

            this.users = [];

            return Promise.reject(error.message);

        }

    }

    @action updateUsersList = (user: IUser) => {

        const index = this.users.findIndex(u => u.id === user.id);

        this.users[index] = user;

    }

}

const usersStore = new Users();
export default usersStore;
