import React, {
    useState,
    useContext,
    useEffect
} from 'react';
import {
    PageHeader,
    Tabs,
    Table,
    Statistic,
    Progress,
    Row, Col,
    Tag,
    Card,
    Alert
} from 'antd';
import {
    UsergroupAddOutlined,
    LineChartOutlined,
    RadarChartOutlined,
    ArrowDownOutlined,
    ArrowUpOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import 'ant-design-pro/dist/ant-design-pro.css';
import {
    getClients,
    getLeadClientData,
    getConversionData
} from '../services/webApi';
import { AuthContext } from '../services/auth';
const { TabPane } = Tabs;

export default function Statistics() {
    const authData = useContext(AuthContext);
    const [predictionData, setPredictionData] = useState([]);
    const [convertedData, setConvertedData] = useState([]);
    const [convertedPercentage, setConvertedPercentage] = useState([]);

    useEffect(() => {
        getClients(authData.Id).then(({ data }) => {
            getLeadClientData(authData.Id).then(({ data: leadData }) => {
                getConversionData(authData.Id).then(({ data: convertData }) => {
                    setPredictionData(data);
                    setConvertedPercentage(leadData);
                    setConvertedData(convertData);
                });
            })
        });
    }, []);

    const salesPieData = [
        {
            x: 'Age',
            y: 4544,
        },
        {
            x: 'NetWorth',
            y: 3321,
        },
        {
            x: 'Gender',
            y: 3113,
        },
        {
            x: 'Product',
            y: 2341,
        },
        {
            x: 'Time Spend',
            y: 1231,
        },
        {
            x: 'Location',
            y: 1231,
        },
    ];

    const columns = [
        {
            title: 'Name',
            dataIndex: 'Name',
            key: 'Name',
            sorter: (a, b) => a.Name.charCodeAt() - b.Name.charCodeAt(),
            sortDirections: ['descend', 'ascend']
        },
        {
            title: 'Age',
            dataIndex: 'Age',
            key: 'Age',
            sorter: (a, b) => a.Age - b.Age,
            sortDirections: ['descend', 'ascend']
        },
        {
            title: 'Income',
            dataIndex: 'Income',
            key: 'Income',
            sorter: (a, b) => a.Income - b.Income,
            sortDirections: ['descend', 'ascend']
        },
        {
            title: 'Networth',
            dataIndex: 'Networth',
            key: 'Networth',
            sorter: (a, b) => a.Networth - b.Networth,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Converted Status',
            dataIndex: 'ConvertedType',
            key: 'ConvertedType',
            sorter: (a, b) => a.ConvertedType - b.ConvertedType,
            sortDirections: ['descend', 'ascend'],
            render: data => {
                return (
                    data == 1 ? (
                        <Tag color="success">
                            Converted
                        </Tag>
                    ) :
                        (<Tag icon={<ExclamationCircleOutlined />} color="warning">
                            Not Converted
                        </Tag>)
                );
            }
        },
        {
            title: 'GoalType',
            dataIndex: 'GoalType',
            key: 'GoalType',
            sorter: (a, b) => a.GoalType - b.GoalType,
            sortDirections: ['descend', 'ascend'],
            render: data => {
                return (
                    data == 0 ? (<Tag color="success">Retirement</Tag>) :
                        (<Tag color="processing">Savings</Tag>)
                );
            }
        }
    ];

    const probalityColumn = [
        {
            title: 'Probability of conversion range',
            dataIndex: 'Threshold',
            key: 'Threshold',
        },
        {
            title: 'Percentage of leads converted',
            dataIndex: 'Conversion',
            key: 'Conversion',
            render: data => {
                return (
                    <Progress percent={data} steps={20} />
                );
            }
        }
    ];

    const probalityRow = [
        {
            key: '0',
            Threshold: '60% and below',
            Conversion: convertedPercentage && convertedPercentage.length && convertedPercentage[0]
        },
        {
            key: '2',
            Threshold: '60% - 70%',
            Conversion: convertedPercentage && convertedPercentage.length && convertedPercentage[1]
        },
        {
            key: '3',
            Threshold: '70% - 90%',
            Conversion: convertedPercentage && convertedPercentage.length && convertedPercentage[2]
        },
        {
            key: '4',
            Threshold: '90% and above',
            Conversion: convertedPercentage && convertedPercentage.length && convertedPercentage[3]
        },
    ];

    const tableData = predictionData.map(({
        LeadId,
        Name,
        Age,
        Income,
        Networth,
        ConvertedType,
        GoalType
    }) => ({
        'key': LeadId,
        'Name': Name,
        'Age': Age,
        'Income': Income,
        'Networth': Networth,
        'ConvertedType': ConvertedType,
        'GoalType': GoalType
    }));

    const chart2 = (
        <div className="site-statistic-demo-card">
            <Row gutter={16}>
                <Col span={12}>
                    <Card>
                        <Statistic
                            title="Converted Leads"
                            value={convertedData &&
                                convertedData.length &&
                                convertedData[0]}
                            precision={2}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<ArrowUpOutlined />}
                            suffix="%"
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card>
                        <Statistic
                            title="Not Converted Leads"
                            value={convertedData &&
                                convertedData.length &&
                                convertedData[1]}
                            precision={2}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<ArrowDownOutlined />}
                            suffix="%"
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );

    const leadProability = {
        defaultPageSize: 4,
        pageSize: 4
    };

    const chart = (
        <Table columns={probalityColumn}
            pagination={leadProability}
            bordered
            dataSource={probalityRow} />
    );
    const pagination = {
        defaultPageSize: 5,
        pageSize: 5
    };

    const statistic = (
        <Table columns={columns}
            pagination={pagination}
            bordered
            dataSource={tableData} />
    );
    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="Statistics"
                subTitle="Lead & Client Statistics"
            />
            <Tabs defaultActiveKey="1">
                <TabPane
                    tab={
                        <span><UsergroupAddOutlined />Processed Leads</span>
                    }
                    key="1"
                >{statistic}</TabPane>
                <TabPane
                    tab={
                        <span>
                            <LineChartOutlined />Lead Statistics</span>
                    }
                    key="2"
                >
                    <Alert message="Gives the information of percentage of leads converted against probability of conversion ranges" type="info" showIcon />
                    {chart}

                </TabPane>
                <TabPane
                    tab={
                        <span>
                            <RadarChartOutlined />Conversion Overview</span>
                    }
                    key="3"
                >
                    {chart2}
                </TabPane>
            </Tabs>
        </div>
    );
}