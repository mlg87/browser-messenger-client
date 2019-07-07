import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import * as Yup from 'yup';
import authStyles from '../../../../common/styles/auth.module.scss';
import { withStores } from '../../../../common/utils/withStores';
import { Auth } from '../../../../stores/Auth/Auth';

const initialFormValues: IRegisterFormValues = {
    password: '',
    passwordConfirm: '',
    username: ''
};

const Register: React.FunctionComponent<IRegisterProps> = props => {

    const [buttonText, setButtonText] = useState<RegisterSubmit>('register');
    const [error, setError] = useState<string | undefined>(undefined);
    const [isFetching, setIsFetching] = useState(false);

    const state: IRegisterState = {
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
                <h1>register</h1>
                <Formik
                    initialValues={initialFormValues}
                    onSubmit={values => handleSubmit(values, state, props)}
                    validationSchema={RegisterSchema}
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
                            }<Field
                                className={authStyles.field}
                                name='passwordConfirm'
                                placeholder='confirm password'
                                type='password'
                            />
                            {errors.passwordConfirm && touched.passwordConfirm
                                ? <div className={authStyles.error}>{errors.passwordConfirm}</div>
                                : null
                            }
                            {/* tslint:disable-next-line:max-line-length */}
                            <button className={authStyles.submit} disabled={isFetching} type='submit'>{buttonText}</button>
                        </Form>
                    )}
                </Formik>
                <Link to='/login'>login</Link>
            </div>
        </div>
    );

};

//
// ─── HANDLERS ───────────────────────────────────────────────────────────────────
//

const handleSubmit = async (
    { password, username }: IRegisterFormValues,
    state: IRegisterState,
    props: IRegisterProps
) => {

    state.setIsFetching(true);
    state.setButtonText('submitting');
    try {

        await props.auth.register({ password, username });
        props.history.push('/chat');

    } catch (error) {

        state.setIsFetching(false);
        state.setButtonText('register');
        state.setError(error);

    }

};

export default withStores('auth')(Register);

//
// ─── INTERFACES ─────────────────────────────────────────────────────────────────
//

const RegisterSchema = Yup.object().shape({
    password: Yup.string()
        .min(8, 'too short')
        .max(60, 'too long')
        .trim()
        .required('required'),
    passwordConfirm: Yup.string()
        .oneOf([Yup.ref('password'), null], 'passwords must match')
        .required('required'),
    username: Yup.string()
        .min(2, 'too short')
        .max(30, 'too long')
        .required('required')
});

export interface IRegisterFormValues {
    password: string;
    passwordConfirm: string;
    username: string;
}

export interface IRegisterProps extends RouteComponentProps {
    readonly auth: Auth;
}

export interface IRegisterState {
    readonly buttonText: RegisterSubmit;
    readonly error?: string;
    readonly isFetching: boolean;
    readonly setButtonText: (value: RegisterSubmit) => void;
    readonly setError: (value?: string) => void;
    readonly setIsFetching: (value: boolean) => void;
}

export type RegisterSubmit = 'register' | 'submitting';
