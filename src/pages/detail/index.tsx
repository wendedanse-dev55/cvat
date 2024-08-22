import React, {useEffect, useState} from 'react';
import {Button, Layout, theme} from "antd";
const { Header, Sider, Content } = Layout;
import { Radio, Tabs } from 'antd';
import {useNavigate, useParams} from "react-router-dom";
import {axiosRequest} from "@/api/api.ts";
import Testings from "@/pages/home";
import {LeftOutlined} from "@ant-design/icons";

const Detail = () => {
    const {name} = useParams()
    const [tab, setTab] = useState ('info');
    const [data, setData] = useState({})
    const navigate = useNavigate()
    const [heightTensorFlow, setheightTensorFlow] = useState(500)
    const [isReady, setIsReady] = useState(false)
    const [scalarsTitle, setScalarsTitle]  = useState('')
    useEffect(() => {
        fetchData()
    }, []);

    const fetchData = () => {
        axiosRequest.post(`/run_tensorboard/?experiment_name=${name}&experiment_type=train`, {
            experiment_name: name,
            experiment_type: "train"
        }, {headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }}).then(() => setIsReady(true))
        axiosRequest.get(`/training_status/${name}`).then(({data}) => {
           setData(data)
        })
    }

    const onChange = (e) => {
        setTab(e.target.value);
    };
    useEffect(() => {
        const headerHeight = document.getElementById('header-training')?.offsetHeight;
        const footerHeight = document.getElementById('training-tabs')?.offsetHeight;
        console.log({
            headerHeight,
            footerHeight})
        const windowHeight = window.innerHeight;
        const remainingHeight = windowHeight - headerHeight - footerHeight;
        setheightTensorFlow(remainingHeight - 30)
    }, []);
    return (
        <div style={{background: "#F2F6F9", height: "100vh"}}>
            <Header style={{ padding: 0, background: "#fff" }} id="header-training">
                {/*<div style={{*/}
                {/*    color: '#161616',*/}
                {/*    fontWeight: 500,*/}
                {/*    fontSize: '18px',*/}
                {/*    marginBottom: "30px"*/}
                {/*}}>*/}
                {/*    MasKey DINO*/}
                {/*</div>*/}
            </Header>

            <div className="training-section">

                <div className="training-tabs" id="training-tabs">
                    <div className="training-back">
                        <svg onClick={() => navigate(-1)} width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 7.5L11 16.4999L20 25.4999" stroke="#161616" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>

                        <div className="training-title">Training - {name}</div>
                    </div>
                    <Radio.Group value={tab} onChange={onChange} style={{ margin: 20 }}>
                        <Radio.Button value="info">Info</Radio.Button>
                        <Radio.Button value="scalars">Scalars</Radio.Button>
                        <Radio.Button value="testings">Testings</Radio.Button>
                    </Radio.Group>
                </div>
                {tab === "info" && <div className="json-config">
                    <div className="json-config__title">
                        Json Config
                    </div>
                    <div className="json-config__content">
                        <pre>         {JSON.stringify(data || {}, null, 2).replace("}", '').replace("{", '')}</pre>
                    </div>
                </div>}
                {tab === "scalars" && isReady && <div>
                    <iframe
                        id="inlineFrameExample"
                        title="Inline Frame Example"
                        width="100%" height={heightTensorFlow} src="https://tensorboard.mlserver.inf.2up.dev/#timeseries" />
                </div>}


                {tab === "testings" &&  scalarsTitle ? <div className="testing-scalars">
                    <div className="testing-scalars__wrapper">
                        <h2>{scalarsTitle}</h2>
                        <Button  icon={<LeftOutlined/>} type="primary" onClick={() => setScalarsTitle('')}>Back to test runs</Button>
                    </div>
                    <iframe
                        id="inlineFrameExample"
                        title="Inline Frame Example"
                        width="100%" height={heightTensorFlow} src="https://tensorboard.mlserver.inf.2up.dev/#timeseries" />
                </div> : <Testings isTest={true} setScalarsTitle={setScalarsTitle} />}
            </div>

        </div>
    );
};

export default Detail;
