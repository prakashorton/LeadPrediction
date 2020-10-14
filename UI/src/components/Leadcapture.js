import React, {
    useState,
    useContext,
    useEffect
} from 'react';
import { UserOutlined, MailOutlined } from '@ant-design/icons';
import {
    Form,
    Input,
    Button,
    Radio,
    InputNumber,
    PageHeader,
    notification
} from 'antd';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../services/auth';
import { addLeadCapture } from '../services/webApi';

const tailLayout = {
    wrapperCol: {
        offset: 4,
        span: 8,
    },
};

export default function Leadcapture() {
    const history = useHistory();
    const authData = useContext(AuthContext);
    const [leadData, setLeadData] = useState({});
    const [componentSize, setComponentSize] = useState('default');

    useEffect(() => {
        resetLeadCapture();
    }, []);

    const resetLeadCapture = () => {
        const leadModel = {
            Name: '',
            Income: null,
            Age: null,
            Gender: '',
            NetWorth: null,
            GoalType: ''
        }
        setLeadData({ ...leadModel });
    };

    const onFormChange = (changedValues, allValues) => {
        setLeadData({ ...leadData, ...changedValues });
    };
    const onFinish = (data) => {
        data = {
            ...data, AdvisorId:
                authData.Id,
            'AdvisorName': authData.Name,
            'GoalType': Number(data.GoalType),
            'Gender': Number(data.Gender)
        };

        addLeadCapture(data).then(() => {
            notification['success']({
                message: 'Lead Capture',
                description:
                    'Your information has been sent to the advisor. He will contact you shortly',
            });
            // resetLeadCapture();

            const leadPredictionmenu = document.getElementsByClassName("anticon anticon-stock");
            if (leadPredictionmenu && leadPredictionmenu[0] && leadPredictionmenu[0].click) {
                leadPredictionmenu[0].click();
            }
            history.push("/home/prediction");
        });
    };

    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="Lead Capture"
                subTitle="Lead Capture Page"
            /><Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                onFinish={onFinish}
                initialValues={{ size: componentSize }}
                onValuesChange={onFormChange}
                size={'default'}
            >
                <Form.Item
                    name="Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your name!',
                        },
                    ]}
                    label="Name">
                    <Input
                        placeholder="Enter your Name"
                        value={leadData.Name}
                        defaultValue=""
                        prefix={<UserOutlined className="site-form-item-icon" />}
                    />
                </Form.Item>
                <Form.Item
                    name="Email"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Email!',
                        },
                    ]}
                    label="Email Id">
                    <Input
                        placeholder="Enter your Email ID"
                        value={leadData.Email}
                        defaultValue=""
                        prefix={<MailOutlined className="site-form-item-icon" />}
                    />
                </Form.Item>
                <Form.Item
                    name="Income"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your income!',
                        },
                    ]}
                    label="Income">
                    <InputNumber min={1}
                        value={leadData.Income}
                        defaultValue=""
                        className="width100"
                        placeholder="Enter Your Income"
                    />
                </Form.Item>
                <Form.Item
                    name="Age"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your age!',
                        },
                    ]}
                    label="Age">
                    <InputNumber min={1}
                        min={100}
                        value={leadData.Age}
                        defaultValue=""
                        placeholder="Enter Your Age"
                        className="width100"
                    />
                </Form.Item>
                <Form.Item
                    name="Gender"
                    rules={[
                        {
                            required: true,
                            message: 'Please select your gender!',
                        },
                    ]}
                    label="Gender">
                    <Radio.Group
                        defaultValue=""
                        value={leadData.Gender}>
                        <Radio.Button value="0">Male</Radio.Button>
                        <Radio.Button value="1">Female</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    name="NetWorth"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your networth!',
                        },
                    ]}
                    label="Net Worth">
                    <InputNumber min={1}
                        value={leadData.NetWorth}
                        defaultValue=""
                        className="width100"
                        placeholder="Enter Your Net Worth"
                    />
                </Form.Item>
                <Form.Item
                    name="GoalType"
                    rules={[
                        {
                            required: true,
                            message: 'Please select your goaltype!',
                        },
                    ]}
                    label="Goal Type">
                    <Radio.Group
                        defaultValue=""
                        value={leadData.GoalType}>
                        <Radio.Button value="0">Retirement</Radio.Button>
                        <Radio.Button value="1">Savings</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
        </div>
    );
}