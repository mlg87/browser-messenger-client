import { create } from 'apisauce';
import * as browserCookies from 'browser-cookies';
import qs from 'qs';
import store from '../stores';

export default class Api {

    static async get(url: string, params): Promise<any> {

        this._setHeaders();

        return await this._client.get(url, params);

    }

    static async post(url: string, payload): Promise<any> {

        this._setHeaders();

        const body = JSON.stringify(payload);

        return await this._client.post(url, body);

    }

    static async put(url: string, payload) {

        this._setHeaders();

        return await this._client.put(url, payload);

    }

    static async delete(url: string) {

        this._setHeaders();

        return await this._client.delete(url);

    }

    /*tslint:disable:object-literal-sort-keys*/
    private static _client = create({
        baseURL: process.env.REACT_APP_API_URL,
        paramsSerializer(params) {

            return qs.stringify(params, { arrayFormat: 'brackets' });

        }
    });
    /*tslint:enable:object-literal-sort-keys*/

    private static _setHeaders() {

        const token = browserCookies.get('chat-token');

        if (!token) {

            return null;

        }

        this._client.addResponseTransform(response => {

            if (response.status === 401) {

                store.auth.token = undefined;
                store.auth.isAuthenticated = false;

            }

        });

        this._client.addRequestTransform(request => {

            request.headers['Content-Type'] = 'application/json';

        });

        return this._client.addRequestTransform(request => {

            request.headers.Authorization = `Bearer ${token}`;

        });

    }

}
