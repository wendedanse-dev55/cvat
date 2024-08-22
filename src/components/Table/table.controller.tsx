import {useImmer} from "use-immer";
import {useEffect} from "react";
import {axiosRequest} from "@/api/api.ts";
import {Button, Progress} from "antd";
import {PauseOutlined, PlayCircleOutlined} from "@ant-design/icons";



interface IData  {
    data: any;
    isLoading: boolean
}
export const tableController = ({ isTest }) => {
    const [data, setData] = useImmer<IData>({data: [], isLoading: false})
    useEffect(() => {
        fetchData()
    }, []);
    const handleChangeStateAction = ({isRun,name, index}) => {
        setData(draft => {
            draft.data[index - 1].isLoading = true
        })
        const url =  isRun ?  isTest ? "/stop_test_container/" : "/stop_training/": isTest ? "/rerun_test_container/": "/rerun_training/"
        axiosRequest.post(`${url}?experiment_name=${name}`).then(res => {
            setData(draft => {
                draft.data[index - 1].isRun = !draft.data[index - 1].isRun
            })
        }).finally(() => {
            setData(draft => {
                draft.data[index - 1].isLoading = false
            })
        })
    }
    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            width: "25%",
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: "25%",
        },
        {
            width: "25%",
            title: 'Progress',
            dataIndex: 'progress',
            key: 'progress',
            render: (_, { percent }) => {
                return (
                    <Progress percent={percent} />
            )
            }
        },
        {
            width: "25%",
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            align: "right",
            render: (_, {isRun, name, index, isLoading}) => {
                return (
                    <Button disabled={isLoading} loading={isLoading} onClick={(e) =>  {
                        e.stopPropagation()
                        handleChangeStateAction({isRun, name, index})
                    }}  danger={isRun} type={isRun ? "default": "primary"} icon={!isRun ? <PlayCircleOutlined /> : <PauseOutlined />}>
                {isRun ? "Stop": "Run"}
                </Button>
            )
            }
        },
    ];


    const fetchData = async () => {
        setData(draft =>  {
            draft.isLoading = true
        })
        const url = isTest ? "/test_runs/": "/training_runs/"
        try {
            const {data} = await axiosRequest.get(url)
            setData(draft => {
                draft.data = (data || []).map((item, idx) => {
                    return {
                        key: '1',
                        name: item.experiment_name,
                        index: idx + 1,
                        percent: 30,
                        isRun: item.status === "running",
                    }
                })
            })
        } catch (e) {

        } finally {
            setData(draft => {
                draft.isLoading = false;
            })
        }
    }


    return {
        columns,
        data: data.data
    }
}
