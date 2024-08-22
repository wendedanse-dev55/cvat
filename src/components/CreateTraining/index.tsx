import React from 'react';
import {Input, Typography} from "antd";
import Dropzone from "@/components/Dropzone";
import {useImmer} from "use-immer";

const CreateTraining = ({form, handleChange , isTest}) => {
    return (
        <>
            <div>
                <Typography.Title level={5}>Experiment name</Typography.Title>

                <Input value={form.experiment_name} onChange={e => handleChange(e.target.value, 'experiment_name')} placeholder="Filled" variant="filled" />

            </div>
            <div>
                <Typography.Title level={5}>Path to dataset</Typography.Title>

                <Input onChange={e => handleChange(e.target.value, isTest ? "test_dataset_path" : 'dataset_path')} placeholder="Filled" variant="filled" />

            </div>
            {isTest && <div>
                <Typography.Title level={5}>Checkpoint Path</Typography.Title>

                <Input onChange={e => handleChange(e.target.value, 'checkpoint_path')} placeholder="Filled"
                       variant="filled"/>

            </div>}
            <div>
                <Dropzone handleChange={handleChange} />
            </div>
        </>
    );
};

export default CreateTraining;
