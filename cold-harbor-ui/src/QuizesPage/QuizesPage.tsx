import { useContext, useEffect, useState } from "react"
import { QuizForUI } from "../../../cold-harbor-service/src"
import axios from "axios"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { Box, IconButton } from "@mui/material"
import { QuizContext } from "../App"
import { PlayCircleFilled, StarSharp } from '@mui/icons-material'

const QuizesPage = () => {
    const { setCurrentQuizId, navigateToTab } = useContext(QuizContext)
    const [favoriteQuizes, setFavoriteQuizes] = useState<number[]>([])
    const [quizes, setQuizes] = useState<QuizForUI[]>([])

    const loadQuizes = async () => {
        const { data } = await axios.get('/api/quiz')
        setQuizes(data)
    }

    useEffect(() => {
        const faves = localStorage.getItem('favoriteQuizes')
        if (faves) {
            setFavoriteQuizes(JSON.parse(faves))
        }
    }, [])

    const toggleFavoriteQuiz = (id: number) => {
        const newFaves = [...favoriteQuizes]

        if (newFaves) {
            const index = newFaves.indexOf(id)
            if (index > -1) {
                newFaves.splice(index, 1)
            } else {
                newFaves.push(id)
            }
            setFavoriteQuizes(newFaves)
            localStorage.setItem('favoriteQuizes', JSON.stringify(newFaves))
        } else {
            setFavoriteQuizes([id])
            localStorage.setItem('favoriteQuizes', JSON.stringify([id]))
        }
    }

    useEffect(() => {
        loadQuizes()
    }, [])

    const columns: GridColDef[] = [
        {
            field: 'favorite', headerName: 'Favorite', width: 140, valueGetter: (_, row) => favoriteQuizes.includes(row.id), renderCell: (params: any) => {
                return (
                    <IconButton onClick={() => toggleFavoriteQuiz(params.row.id)}>
                        <StarSharp color={favoriteQuizes.includes(params.row.id) ? "warning" : "disabled"} />
                    </IconButton>
                )
            },
        },
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
            field: 'score', headerName: 'Score', flex: 1, valueGetter: (_: any, row: QuizForUI) => {
                const passed = row.questions.reduce((prev, current) => {
                    return current.passed ? prev + 1 : prev
                }, 0)
                return `${Math.round((passed / row.questions.length) * 100)}%`
            }
        },
        {
            field: 'action', headerName: 'Action', width: 90, renderCell: (params: any) => {
                return (
                    <IconButton onClick={() => {
                        setCurrentQuizId(params.row.id)
                        navigateToTab(2)
                    }}>
                        <PlayCircleFilled color="success" />
                    </IconButton>
                )
            }
        }
    ];

    return (
        <Box width={"100%"} height={"100%"}>
            <DataGrid columns={columns} rows={quizes} disableRowSelectionOnClick initialState={{
                sorting: {
                    sortModel: [{ field: 'favorite', sort: 'desc' }],
                }
            }} />
        </Box>
    )
}

export default QuizesPage