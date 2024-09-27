import React, {useEffect, useState} from 'react';
import {Button, Col, Divider, Input, Layout, Modal, Row, theme, Typography} from "antd";
const { Header, Sider, Content } = Layout;
import { Radio, Tabs } from 'antd';
import {useNavigate, useParams} from "react-router-dom";
import {axiosRequest} from "@/api/api.ts";
import Testings from "@/pages/home";
import {LeftOutlined} from "@ant-design/icons";
import Dropzone from "@/components/Dropzone";

const { Title } = Typography;
const Detail = () => {
    const {name} = useParams()
    const [tab, setTab] = useState ('info');
    const [data, setData] = useState({})
    const navigate = useNavigate()
    const [heightTensorFlow, setheightTensorFlow] = useState(500)
    const [isReady, setIsReady] = useState(false)
    const [scalarsTitle, setScalarsTitle]  = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [modalImages, setModalImages] = useState(false)
    const [previewImage, setPreviewImage] = useState('');
    const [responseImage, setResponseImage] = useState('')
    const [form, setForm]  = useState({
        experiment_name: '',
        inference_name: '',
        output: '',
        settings_file: '',
        input_images: ''
    })
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

    const handleChange = (e, name) => {
        setForm({...form, [name]:  e})
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



    const handleOk = () => {
        setLoading(true)
        const formData = new FormData();
        formData.append('experiment_name', form.experiment_name)
        formData.append('inference_name', form.inference_name)
        formData.append('settings_file', form.settings_file)
        formData.append('output', form.output)
        for(const file of form.input_images) {
            formData.append("input_image", file)
        }
        axiosRequest.post("/run_inference/", formData).then(result => {

            const file = form.input_images[0]
            const reader = new FileReader();
            const url = reader.readAsDataURL(file)
            reader.onloadend = function (e) {
                setPreviewImage(reader.result)
                setResponseImage(result?.data?.image)
                setModalImages(true)

            }

        }).finally(() => setLoading(false))
    }


    const handleCancel = () => setIsModalOpen(false)
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
                        <div>
                            <Button  icon={<LeftOutlined/>}  onClick={() => setScalarsTitle('')} style={{marginRight: "20px"}}>Back to test runs</Button>
                            <Button type="primary" onClick={() => setIsModalOpen(true)}>Inference</Button>
                        </div>
                    </div>
                    <iframe
                        id="inlineFrameExample"
                        title="Inline Frame Example"
                        width="100%" height={heightTensorFlow} src="https://tensorboard.mlserver.inf.2up.dev/#timeseries" />
                </div> : <Testings isTest={true} setScalarsTitle={setScalarsTitle} />}
            </div>
            <Modal  title={'Create inference'} loading={loading} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <>
                    <div>
                        <Typography.Title level={5}>Experiment name</Typography.Title>

                        <Input   onChange={e => handleChange(e.target.value, 'experiment_name')} placeholder="Filled" variant="filled" />

                    </div>
                    <div>
                        <Typography.Title level={5}>Inference name</Typography.Title>

                        <Input   onChange={e => handleChange(e.target.value, 'inference_name')} placeholder="Filled" variant="filled" />

                    </div>
                    <div>
                        <Typography.Title level={5}>Output save path</Typography.Title>

                        <Input onChange={e => handleChange(e.target.value,  'output')} placeholder="Filled" variant="filled" />

                    </div>

                    <div>
                        <Dropzone name='settings_file' title="Add JSON config" handleChange={(value, name) => setForm(prev => ({...prev, settings_file: value}))} />
                    </div>
                    <div>
                        <Dropzone multiple={true} name='input_images' title="Drag & drop Image"  handleChange={(value, name) =>  setForm(prev => ({...prev, input_images: value}))}/>
                    </div>
                </>
                <Modal width={1000} open={modalImages} onCancel={() => setModalImages(false)} onOk={() => setModalImages(false)}>
                    <Row>
                        <Col span={11} style={{marginRight: "20px"}}>
                            <Title level={2}>Before</Title>

                            <img src={previewImage} style={{width: "100%"}} alt=""/>
                        </Col>
                        <Col span={11}>
                            <Title level={2}>After</Title>
                            <img src={`data:image/png;base64,${responseImage}`} style={{width: "100%"}} alt=""/>
                        </Col>
                    </Row>
                </Modal>
            </Modal>
        </div>
    );
};

export default Detail;
