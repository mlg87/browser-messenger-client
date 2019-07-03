export interface IUserCredentials {
    readonly username: string;
    readonly password: string;
}

export interface IUser {
    readonly id: number;
    readonly isOnline: boolean;
    readonly username: string;
}
