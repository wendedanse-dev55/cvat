import React, {useEffect, useState} from 'react';
import {Button, Modal} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import TableComponent from "@/components/Table";
import CreateTraining from "@/components/CreateTraining";
import {useImmer} from "use-immer";
import {axiosRequest} from "@/api/api.ts";
import {useParams} from "react-router-dom";

const Training = ({ isTest, setScalarsTitle }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useImmer({
        experiment_name: "",
        settings_file: "",
        dataset_path: ""

    })
    const {name} = useParams()
    console.log({name, isTest})

    useEffect(() => {
        if(isTest && name) {
            setForm({...form, experiment_name: name})
        }
    }, [name])
    const handleChange = (value, name) => {
        setForm(draft => {
            draft[name] = value;
        })
    }
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk =   () => {
        const newForm = {...form}

        if(isTest) {
            delete newForm['dataset_path']
        } else {
            delete newForm['test_dataset_path']
        }
        const formData = new FormData();
        for(let item in newForm) {
            formData.append(item, newForm[item])
        }
        const url = isTest ? "/run_test/" :"/run_training/"
        axiosRequest.post(url, formData).then(() => {
            console.log('succewsss')
        })
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <div>
            <div style={{textAlign: "right"}}>
                <Button style={{marginBottom: "20px"}} icon={<PlusOutlined />} type="primary" onClick={showModal}>Create</Button>
            </div>
            <TableComponent setScalarsTitle={setScalarsTitle} isTest={isTest} />
            <Modal title={isTest  ? "Create test" : "Create training runs"} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <CreateTraining form={form} isTest={isTest} handleChange={handleChange} />
            </Modal>
        </div>
    );
};

export default Training;
