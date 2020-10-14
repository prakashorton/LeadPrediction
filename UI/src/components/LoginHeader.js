import React from 'react';
import { Layout, Row, Col } from 'antd';
import { SyncOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;

export default function Header() {
    return (
        <Layout className="layout">
            <AntHeader>
                <Row type="flex">
                    <Col xs={24} sm={10}>
                        <div className="logo">
                            <h1 className="logo-title">
                                <span className="icons-list">
                                    <SyncOutlined spin />
                                </span>
                                <span style={{ 'marginLeft': '15px' }}>WITATHON 2020</span>
                            </h1>
                        </div>
                    </Col>
                    <Col xs={0} sm={14}>
                    </Col>
                </Row>
            </AntHeader>
        </Layout>
    );
}
