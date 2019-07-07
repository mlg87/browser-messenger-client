import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import * as Yup from 'yup';
import authStyles from '../../../../common/styles/auth.module.scss';
import { withStores } from '../../../../common/utils/withStores';
import { Auth } from '../../../../stores/Auth/Auth';

const initialFormValues: ILoginFormValues = {
    password: '',
    username: ''
};

const Login: React.FunctionComponent<ILoginProps> = props => {

    const [buttonText, setButtonText] = useState<LoginSubmit>('login');
    const [error, setError] = useState<string | undefined>(undefined);
    const [isFetching, setIsFetching] = useState(false);

    const state: ILoginState = {
        buttonText,
        error,
        isFetching,
        setButtonText,
        setError,
        setIsFetching
    };

    return (
        <div className={authStyles.container}>
            <div>
                {error && <div>Error: {error}</div>}
                <h1>login</h1>
                <Formik
                    initialValues={initialFormValues}
                    onSubmit={values => handleSubmit(values, state, props)}
                    validationSchema={LoginSchema}
                >
                    {({ errors, touched }) => (
                        <Form className={authStyles.form}>
                            <Field
                                className={authStyles.field}
                                name='username'
                                placeholder='username'
                                type='text'
                            />
                            {errors.username && touched.username
                                ? <div className={authStyles.error}>{errors.username}</div>
                                : null
                            }
                            <Field
                                className={authStyles.field}
                                name='password'
                                placeholder='password'
                                type='password'
                            />
                            {errors.password && touched.password
                                ? <div className={authStyles.error}>{errors.password}</div>
                                : null
                            }
                            {/* tslint:disable-next-line:max-line-length */}
                            <button className={authStyles.submit} disabled={isFetching} type='submit'>{buttonText}</button>
                        </Form>
                    )}
                </Formik>
                <Link to='/register'>register</Link>
            </div>
        </div>
    );

};

//
// ─── HANDLERS ───────────────────────────────────────────────────────────────────
//

const handleSubmit = async (
    { password, username }: ILoginFormValues,
    state: ILoginState,
    props: ILoginProps
) => {

    state.setIsFetching(true);
    state.setButtonText('submitting');
    try {

        await props.auth.login({ password, username });
        props.history.push('/chat');

    } catch (error) {

        state.setIsFetching(false);
        state.setButtonText('login');
        state.setError(error);

    }

};

export default withStores('auth')(Login);

//
// ─── INTERFACES ─────────────────────────────────────────────────────────────────
//

const LoginSchema = Yup.object().shape({
    password: Yup.string().required(),
    username: Yup.string().required()
});

export interface ILoginFormValues {
    password: string;
    username: string;
}

export interface ILoginProps extends RouteComponentProps {
    readonly auth: Auth;
}

export interface ILoginState {
    readonly buttonText: LoginSubmit;
    readonly error?: string;
    readonly isFetching: boolean;
    readonly setButtonText: (value: LoginSubmit) => void;
    readonly setError: (value?: string) => void;
    readonly setIsFetching: (value: boolean) => void;
}

export type LoginSubmit = 'login' | 'submitting';
