import AuthStore, { Auth } from './Auth/Auth';
import MessagesStore, { Messages } from './Messages';
import UsersStore, { Users } from './Users';

export default {
    auth: AuthStore,
    messages: MessagesStore,
    users: UsersStore
};

export interface IStores {
    auth: Auth;
    messages: Messages;
    users: Users;
}
