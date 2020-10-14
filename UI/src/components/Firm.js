import React, { useEffect, useState } from 'react';
import { Button, Result, PageHeader } from 'antd';


export default function Firm() {
   
    return (
        <div className="firmPage">
            <PageHeader
                className="site-page-header"
                title="Firm Level Prediction"
                subTitle="Firm level prediction"
            />
            <Result
                status="404"
                title="Under construction"
                subTitle="This page is under construction."
                extra={<Button type="primary">Back Home</Button>}
            />
        </div>
    );
}