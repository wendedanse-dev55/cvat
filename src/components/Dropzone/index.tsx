import {useCallback, useState} from 'react';
import {useDropzone} from "react-dropzone";
import { UploadOutlined } from "@ant-design/icons"
const Dropzone = ({ handleChange, title, name, multiple = false }) => {
    const [file, setFile] = useState(null)
    const onDrop = useCallback(acceptedFiles => {
        handleChange(multiple ? acceptedFiles : acceptedFiles[0], name || 'settings_file')
        setFile(multiple ? acceptedFiles : acceptedFiles[0])
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, multiple})
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
                        <div>{Array.isArray(file) ? file.map(i => i.name).join(", "): file ? `${file.name}` : title || 'Add JSON config'}</div>
                    </div>
            }
        </div>
    );
};

export default Dropzone;
