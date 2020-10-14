import React, { useContext } from 'react';
import { Layout, notification } from 'antd';
import {
    UserOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../services/auth';

const { Header } = Layout;

export default function ASide() {
    const history = useHistory();
    const authData = useContext(AuthContext);
    return (
        <Header className="site-layout-sub-header-background" style={{
            display: 'grid',
            gridTemplateColumns: '80% 20%',
            background: '#001529',
            color: 'white'
        }} >
            <div className="alignLeft">
                <div className="icons-list">
                    <UserOutlined />
                </div>
                <span className="margin-left15 name">{authData.Name}</span>
            </div>
            <div className="alignCenter">
                <div className="icons-list">
                    <LogoutOutlined />
                </div>
                <span className="margin-left15">
                    <a href="javascript:void" onClick={(evt) => {
                        const data = {
                            isAuthendicated: false,
                            Id: '',
                            Name: ''
                        };
                        authData.Authenticate(data);
                        history.push("/login");
                        notification['info']({
                            message: 'Logged Out',
                            duration: 3,
                            description:
                                `Logged out Successfully.!`,
                        });
                    }}>Signout</a>
                </span>
            </div>
        </Header>
    );
}