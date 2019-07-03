import * as browserCookies from 'browser-cookies';
import { action, observable } from 'mobx';
import { create, persist } from 'mobx-persist';
import { Api } from '../../services';
import { IUser, IUserCredentials } from './types';

export class Auth {

    //
    // ─── OBSERVABLES ────────────────────────────────────────────────────────────────
    //

    @observable @persist isAuthenticated = false;
    @observable isHydrated = false;
    @persist @observable token = undefined;
    @observable user?: IUser;

    //
    // ─── ACTIONS ────────────────────────────────────────────────────────────────────
    //

    @action login = async (creds: IUserCredentials) => {

        try {

            const body = {
                ...creds
            };

            const res = await Api.post('/auth/login', body);

            if (!res.ok) {

                const message = res.data && res.data.message;
                throw Error(message || 'Not Authenticated');

            }

            this.isAuthenticated = true;
            browserCookies.set('chat-token', res.data.token);
            this.token = res.data.token;
            this.user = res.data.user;

            return Promise.resolve();

        } catch (error) {

            this.isAuthenticated = false;
            this.token = undefined;
            this.user = undefined;

            return Promise.reject(error.message);

        }

    }

    @action logout = () => {

        this.isAuthenticated = false;
        browserCookies.set('chat-token', '');
        this.token = undefined;
        this.user = undefined;

    }

    @action register = async ({ password, username }: IUserCredentials) => {

        try {

            const body = {
                password,
                username
            };

            const res = await Api.post('/auth/register', body);

            if (!res.ok) {

                const message = res.data && res.data.message;
                throw Error(message || 'Not Authenticated');

            }

            this.isAuthenticated = true;
            browserCookies.set('chat-token', res.data.token);
            this.token = res.data.token;
            this.user = res.data.user;

            return Promise.resolve();

        } catch (error) {

            this.isAuthenticated = false;
            this.token = undefined;
            this.user = undefined;

            return Promise.reject(error.message);

        }

    }

    @action validate = async () => {

        try {

            const res = await Api.get('/auth/validate', null);

            if (!res.ok) {

                const message = res.data && res.data.message;
                throw Error(message || 'Not Authenticated');

            }

            this.isAuthenticated = true;
            this.user = res.data.user;

        } catch (error) {

            this.isAuthenticated = false;
            this.token = undefined;
            this.user = undefined;

            return Promise.reject(error.message);

        }

    }

}

const hydrate = create();

const authStore = new Auth();
export default authStore;

hydrate('auth', authStore).then(res => res.isHydrated = true);
