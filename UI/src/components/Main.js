import React from 'react';
import { Layout } from 'antd';
import MainHeader from './MainHeader';
import MainFooter from './MainFooter';
import ASide from './ASide';
import Desirability from './Desirability';
import Prediction from './Prediction';
import Firm from './Firm';
import Statistics from './Statistics';
import LeadCapture from './Leadcapture';
import { Route, Switch } from 'react-router-dom';

const { Content } = Layout;

export default function Main() {
    return (
        <div className="homeContainer">
            <Layout>
                <MainHeader></MainHeader>
                <Layout>
                    <ASide></ASide>
                    <Content style={{ margin: '18px 14px 18px 14px' }}>
                        <div className="content site-layout-background" style={{
                            padding: 24,
                            minHeight: 360,
                            height: '100%'
                        }}>
                            <Switch>
                                <Route path="/" component={Desirability} exact />
                                <Route path="/home/" component={Desirability} exact />
                                <Route path="/home/desirability" component={Desirability} />
                                <Route path="/home/statistics" component={Statistics} />
                                <Route path="/home/prediction" component={Prediction} />
                                <Route path="/home/firm" component={Firm} />
                                <Route path="/home/leadcapture" component={LeadCapture} />
                            </Switch>
                        </div>
                    </Content>
                    <MainFooter></MainFooter>
                </Layout>
            </Layout>
        </div>
    )
}
