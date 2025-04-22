import { useContext, useEffect, useState } from "react"
import { QuizForUI } from "../../../cold-harbor-service/src"
import axios from "axios"
import { DataGrid } from "@mui/x-data-grid"
import { Box } from "@mui/material"
import { QuizContext } from "../App"

const QuizesPage = () => {
    const { setCurrentQuizId, navigateToTab } = useContext(QuizContext)
    const [quizes, setQuizes] = useState<QuizForUI[]>([])

    const loadQuizes = async () => {
        const { data } = await axios.get('/api/quiz')
        setQuizes(data)
    }

    useEffect(() => {
        loadQuizes()
    }, [])

    return (
        <Box width={"100%"} height={"100%"}>
            <DataGrid columns={columns} rows={quizes} onRowClick={({ row }) => {
                setCurrentQuizId(row.id)
                navigateToTab(2)
            }} />
        </Box>
    )
}

export default QuizesPage


const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'questionsCompleted', headerName: 'Completed Questions', width: 180, valueGetter: (_: any, row: QuizForUI) => {
            const incomplete = row.questions.reduce((prev, current) => {
                return current.passed === null ? prev + 1 : prev
            }, 0)
            return row.questions.length - incomplete
        }
    },
    {
        field: 'totalQuestions', headerName: 'Total Questions', width: 180, valueGetter: (_: any, row: QuizForUI) => row.questions.length
    },
    {
        field: 'score', headerName: 'Score', width: 90, valueGetter: (_: any, row: QuizForUI) => {
            const passed = row.questions.reduce((prev, current) => {
                return current.passed ? prev + 1 : prev
            }, 0)
            return `${Math.round((passed / row.questions.length) * 100)}%`
        }
    }
];