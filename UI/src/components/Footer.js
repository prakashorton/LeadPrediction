import React from 'react';
import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

export default function Footer() {
    return (<AntFooter style={{ textAlign: 'center' }}>
        Ethical Pirates ©2020
    </AntFooter>);
}