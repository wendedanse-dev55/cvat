import {useCallback, useState} from 'react';
import {useDropzone} from "react-dropzone";
import { UploadOutlined } from "@ant-design/icons"
const Dropzone = ({ handleChange }) => {
    const [file, setFile] = useState(null)
    const onDrop = useCallback(acceptedFiles => {
        handleChange(acceptedFiles[0], 'settings_file')
        setFile(acceptedFiles[0])
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            {
                isDragActive ?
                    <div className="dropzone-file">
                        <UploadOutlined  />
                        <div>Drop here file...</div>
                    </div> :
                    <div className="dropzone-file">
                        <UploadOutlined  />
                        <div>{file ? `${file.name}` : 'Add JSON config'}</div>
                    </div>
            }
        </div>
    );
};

export default Dropzone;