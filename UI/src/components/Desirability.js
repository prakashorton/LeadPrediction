import React, { useState, useContext, useEffect } from 'react';
import {
    PageHeader,
    Form,
    Button,
    Radio,
    notification,
    Select,
    InputNumber,
    Empty
} from 'antd';
import { AuthContext } from '../services/auth';
import { updateDesirablity, getDesirablity } from '../services/webApi';

const tailLayout = {
    wrapperCol: {
        offset: 4,
        span: 8,
    },
};

export default function Desirablity() {
    const authData = useContext(AuthContext);
    const [desirablityModel, setDesirablityModel] = useState(null);
    useEffect(() => {
        getDesirablity(authData.Id).then(({ data }) => {
            if (data && data.length) {
                setNetworthCriteria(data[0].IsNetworthAbove == false ? '0' : '1')
                setIncomeCriteria(data[0].IsIncomeAbove == false ? '0' : '1')
                setAgeCriteria(data[0].IsAgeAbove == false ? '0' : '1')
                setDesirablityModel(data[0]);
            }
        });
    }, []);
    const [ageCriteria, setAgeCriteria] = useState("1");
    const [incomeCriteria, setIncomeCriteria] = useState("1");
    const [networthCriteria, setNetworthCriteria] = useState("1");
    const onAddDesirablity = () => {
        setDesirablityModel({});
    };

    const onFinish = (desirabilityData) => {
        const model = {
            AdvisorId: authData.Id,
            Age: {
                'Criteria': ageCriteria,
                'Value': desirabilityData.age ? Number(desirabilityData.age) :
                    desirablityModel.Age,
            },
            Income: {
                'Criteria': incomeCriteria,
                'Value': desirabilityData.income ? Number(desirabilityData.income) :
                    desirablityModel.Income,
            },
            Networth: {
                'Criteria': networthCriteria,
                'Value': desirabilityData.networth ? Number(desirabilityData.networth) :
                    desirablityModel.Networth,
            },
            GoalType: desirabilityData.goalType == null ? desirablityModel.GoalType :
                desirabilityData.goalType
        }
        updateDesirablity(model).then(data => {
            notification['success']({
                message: 'Desirability',
                description:
                    'Updated succesfully',
            });
        }).error(() => {
            notification['Error']({
                message: 'Desirability',
                description:
                    'Error in updating desirability',
            });
        });
    };

    const desirablityForm = (<Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        onFinish={onFinish}
        initialValues={{ size: 'large' }}
        size={'large'}
    >
        <Form.Item name="age"
            label="Age">
            <div className="holder">
                <div>
                    <Select name="ageCriteria"
                        onChange={(data) => setAgeCriteria(data)}
                        defaultValue={desirablityModel &&
                            desirablityModel.IsAgeAbove == false ? '0' : '1'}>
                        <Select.Option value="1">Above</Select.Option>
                        <Select.Option value="0">Below</Select.Option>
                    </Select>
                </div>
                <div>
                    <InputNumber min={1}
                        defaultValue={desirablityModel && desirablityModel.Age}
                        placeholder="Enter Your Age"
                        className="width100"
                    />
                </div>
            </div>
        </Form.Item>
        <Form.Item name="income"
            label="Income">
            <div className="holder">
                <div>
                    <Select
                        name="incomeCriteria"
                        onChange={(data) => setIncomeCriteria(data)}
                        defaultValue={desirablityModel &&
                            desirablityModel.IsIncomeAbove == false ? '0' : '1'}>
                        <Select.Option value="1">Above</Select.Option>
                        <Select.Option value="0">Below</Select.Option>
                    </Select>
                </div>
                <div>
                    <InputNumber min={1}
                        defaultValue={desirablityModel && desirablityModel.Income}
                        className="width100"
                        placeholder="Enter Your Income"
                    />
                </div>
            </div>
        </Form.Item>
        <Form.Item name="networth"
            label="Networth">
            <div className="holder">
                <div>
                    <Select
                        onChange={(data) => {
                            setNetworthCriteria(data);
                        }}
                        name="networthCriteria"
                        defaultValue={desirablityModel &&
                            desirablityModel.IsNetworthAbove == false ? '0' : '1'}>
                        <Select.Option value="1">Above</Select.Option>
                        <Select.Option value="0">Below</Select.Option>
                    </Select>
                </div>
                <div>
                    <InputNumber min={1}
                        defaultValue={desirablityModel && desirablityModel.Networth}
                        className="width100"
                        placeholder="Enter Your Networth"
                    />
                </div>
            </div>
        </Form.Item>
        <Form.Item name="goalType" label="Goal Type">
            <Radio.Group
                defaultValue={desirablityModel && `${desirablityModel.GoalType}`}>
                <Radio.Button value="0">Retirement</Radio.Button>
                <Radio.Button value="1">Savings</Radio.Button>
                <Radio.Button value="2">Both</Radio.Button>
            </Radio.Group>
        </Form.Item>
        <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">Submit</Button>
        </Form.Item>
    </Form>
    );
    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="Desirability"
                subTitle="Set Your Desirability"
            />
            <>
                {
                    desirablityModel ? (desirablityForm) : (
                        <Empty
                            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                            imageStyle={{
                                height: 60,
                            }}
                        >
                            <Button type="primary"
                                onClick={() => onAddDesirablity()}>
                                Set Desirability
                            </Button>
                        </Empty>
                    )
                }
            </>
        </div >
    );
}