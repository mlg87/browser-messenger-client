import React from 'react';
import { Link } from 'react-router-dom';
import authStyles from '../../../../common/styles/auth.module.scss';
import styles from './Landing.module.scss';

export default () => {

    return (
        <div className={authStyles.container}>
            <div>
                <h1>welcome. let's do some chatting.</h1>
                <span className={styles['link-container']}>
                    <Link to='/login'>login</Link>
                    <Link to='/register'>register</Link>
                </span>
            </div>
        </div>
    );

};
