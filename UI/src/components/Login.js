import React, { useContext } from 'react';
import { Divider, Form, Input, Button, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { login } from '../services/webApi';
import { AuthContext } from '../services/auth';

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    }
};
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    }
};

export default function Login() {
    const history = useHistory();
    const authData = useContext(AuthContext);
    const onFinish = (values) => {
        login(values).then(({ data }) => {
            if (data) {
                const auth = {
                    Id: data,
                    Name: values.userName,
                    IsAuthenticated: true
                };
                authData.Authenticate(auth);
                notification['success']({
                    message: 'Success',
                    duration: 3,
                    description:
                        `Logged In Successfully!`,
                });
                history.push("/home");
            }
            else {
                notification['error']({
                    message: 'Login',
                    description:
                        'Invalid username or password',
                });
            }
        });
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div>
            <h1 className="textCenter">ETHICAL PIRATES</h1>
            <Divider orientation="left" plain>Advisor Login</Divider>
            <div className="login-warp">
                <Form
                    {...layout}
                    name="basic"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    size={'large'}
                >
                    <Form.Item
                        label="Username"
                        name="userName"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="Enter your  Username" />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            placeholder="Enter your password" />
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">Login</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}