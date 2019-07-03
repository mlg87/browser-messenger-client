// NOTE: taken from here: https://github.com/mobxjs/mobx-react/issues/256#issuecomment-479396805
// makes function components that have the store injected typed correctly
import { inject, IWrappedComponent } from 'mobx-react';
import { IStores } from '../../stores';

export type Subtract<T, K> = Omit<T, keyof K>;

export const withStores = <TStoreProps extends keyof IStores>(...stores: TStoreProps[]) =>
    <TProps extends Pick<IStores, TStoreProps>>(component: React.ComponentType<TProps>) => {

        return (inject(...stores)(component) as any) as
            React.FC<Subtract<TProps, Pick<IStores, TStoreProps>> &
                Partial<Pick<IStores, TStoreProps>>> &
            IWrappedComponent<TProps>;

    };
