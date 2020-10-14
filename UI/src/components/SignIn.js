import React, { useEffect } from 'react';
import LoginHeader from './LoginHeader';
import Footer from "./Footer";
import Login from './Login';
import { Layout } from 'antd';
import { login } from '../services/webApi';

const { Content } = Layout;

function SignIn() {
    return (
        <div className="App grid-container">
            <div className="grid-item">
                <LoginHeader></LoginHeader>
            </div>
            <div className="grid-item grid-content">
                <Content style={{ padding: '0 50px' }}>
                    <div className="site-layout-content">
                        <Login></Login>
                    </div>
                </Content>
            </div>
            <div className="grid-item">
                <Footer></Footer>
            </div>
        </div>
    );
}

export default SignIn;
