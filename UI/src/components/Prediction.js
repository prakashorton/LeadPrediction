import React, {
    useState,
    useContext,
    useEffect
} from 'react';
import {
    PageHeader,
    Table,
    Dropdown,
    Menu,
    notification,
    Tag,
    Button,
    Modal,
    Alert,
    Empty,
    Progress
} from 'antd';
import {
    DownOutlined,
    ExclamationCircleOutlined,
    LikeOutlined,
    DislikeOutlined
} from '@ant-design/icons';
import { updateLeadInformation, getPredictionData } from '../services/webApi';
import { AuthContext } from '../services/auth';

export default function Prediction() {
    const authData = useContext(AuthContext);
    const [predictionData, setPredictionData] = useState([]);
    useEffect(() => {
        getPredictionData(authData.Id).then(({ data }) => {
            setPredictionData(data);
        });
    }, []);

    const confirm = (data) => {
        console.log(data.key);
        const currentLeadInfo = tableData.find(td => td.key === data.key.split('||')[1]);
        const updateStatus = data.key.split('||')[0] == '1' ? `Are you sure you want to convert ${currentLeadInfo.Name} as a client?` :
            `Are you sure you want to mark ${currentLeadInfo.Name} as not converted?`;
        Modal.confirm({
            title: 'Confirm Lead Conversion',
            icon: <ExclamationCircleOutlined />,
            content: updateStatus,
            okText: 'Yes',
            cancelText: 'No',
            onOk() {
                console.log(currentLeadInfo);
                const leadModel = {
                    AdvisorId: authData.Id,
                    LeadId: currentLeadInfo.key,
                    IsConverted: data.key.split('||')[0]
                };
                updateLeadInformation(leadModel).then((rs) => {
                    setPredictionData(predictionData.filter(pd => pd.LeadId != currentLeadInfo.key));
                    notification['success']({
                        message: `Lead`,
                        description:
                            `Updated Lead information for ${currentLeadInfo.Name}`,
                    });
                });
            },
            onCancel() {
                console.log('Cancel');
            }
        });
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'Name',
            width: 200,
            sorter: (a, b) => a.Name.charCodeAt() - b.Name.charCodeAt(),
            sortDirections: ['descend', 'ascend'],
            key: 'Name',
        },
        {
            title: 'Probability Of Conversion',
            dataIndex: 'Probability',
            key: 'Probability',
            sorter: (a, b) => a.Probability - b.Probability,
            sortDirections: ['descend', 'ascend'],
            render: data => (
                <Progress percent={data} steps={10} />
                // <Progress
                //     strokeColor={{
                //         '0%': '#108ee9',
                //         '100%': '#87d068',
                //     }}
                //     percent={data}
                //     status="active"
                // />
            )
        },
        {
            title: 'Desirability Percentage',
            dataIndex: 'Desirability',
            key: 'Desirability',
            sorter: (a, b) => a.Desirability - b.Desirability,
            sortDirections: ['descend'],
            render: data => {
                return (
                    !data && data !== 0 ? (
                        <Tag icon={<ExclamationCircleOutlined />} color="warning">
                            Desirability is not set
                        </Tag>
                    ) :
                        (<Progress
                            strokeColor={{
                                '0%': '#108ee9',
                                '100%': '#87d068',
                            }}
                            percent={data}
                            status="active"
                        />)
                );
            }
        },
        {
            title: 'Action',
            key: 'action',
            dataIndex: 'action',
            render: id => (
                <>
                    <Dropdown overlay={() => {
                        return menu(id)
                    }}>
                        <Button
                            type="primary"
                            onClick={() => { }}>
                            Update <DownOutlined />
                        </Button>
                    </Dropdown>
                </>
            ),
        }
    ];

    const menu = (data) => (
        <Menu onClick={confirm}>
            <Menu.Item key={`1||${data}`} icon={<LikeOutlined />}>
                Converted
          </Menu.Item>
            <Menu.Item key={`2||${data}`} icon={<DislikeOutlined />}>
                Not Converted
          </Menu.Item>
        </Menu>
    );

    const pagination = {
        defaultPageSize: 4,
        pageSize: 4
    };

    const tableData = predictionData.map(({
        LeadId,
        Name,
        Probability,
        Desirability
    }) => ({
        'key': LeadId,
        'Name': Name,
        'Probability': Probability,
        'Desirability': Desirability,
        'action': LeadId
    }));

    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="Prediction"
                subTitle="Lead Conversion Prediction"
            />
            <Alert message="Probability of Conversion denotes the likelihood of a lead getting converted to a client & depends on the prediction made by our algorithm based on historical data"
                type="info" showIcon />
            {
                tableData && tableData.length ? (<Table columns={columns}
                    bordered
                    pagination={pagination}
                    dataSource={tableData} />) : (
                        <Empty />
                    )
            }
        </div>
    );
}