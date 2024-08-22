import {Button, Progress, Table} from "antd";
import { PauseOutlined, PlayCircleOutlined } from "@ant-design/icons"
import {tableController} from "@/components/Table/table.controller.tsx";
import {useNavigate} from "react-router-dom";




const TableComponent = ({ isTest, setScalarsTitle }) => {
    const { data, columns } = tableController({isTest})
    const navigate = useNavigate();

    return (
        <Table onRow={(record, index) => {
            return {
                onClick: e => {
                    if(isTest) {
                        setScalarsTitle(record.name)
                    } else {
                        navigate(`/detail/${record.name}`)
                    }

                }
            }
        }} dataSource={data} columns={columns} />
    );
};

export default TableComponent;
