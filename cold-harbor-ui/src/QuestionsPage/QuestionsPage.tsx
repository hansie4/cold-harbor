import { Box, Button, ButtonGroup, Divider, Stack, TextField, Typography } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { QuestionForUI, QuizForUI } from "../../../cold-harbor-service/src"
import axios from "axios"
import QuestionAdditionModel from "./QuestionAdditionModel"
import QuestionCard from "./QuestionCard"
import { QuizContext } from "../App"

const QuestionsPage = () => {
    const [searchText, setSearchText] = useState("")
    const [questions, setQuestions] = useState<QuestionForUI[]>([])
    const [loading, setLoading] = useState(true)
    const [addDialogOpen, setAddDialogOpen] = useState(false)

    const { setCurrentQuizId, navigateToTab, selectedQuestions, setSelectedQuestions } = useContext(QuizContext)

    const loadQuestions = async () => {
        setLoading(true)
        const { data } = await axios.get('/api/question')
        setLoading(false)
        setQuestions(data)
    }

    const toggleQuestionSelection = (question: QuestionForUI) => {
        setSelectedQuestions((oldSelection: QuestionForUI[]) => {
            const index = oldSelection.find(Q => Q.id === question.id)

            if (index !== undefined) {
                return oldSelection.filter(Q => Q.id !== question.id)
            } else {
                return [...oldSelection, question]
            }
        })
    }

    useEffect(() => {
        loadQuestions()
    }, [])

    const createNewQuiz = async () => {
        if (selectedQuestions.length === 0) return

        const questionsInQuiz = [...selectedQuestions]
        const shuffled = questionsInQuiz
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)

        const newQuiz: Partial<QuizForUI> = {
            questions: shuffled.map((SQ) => {
                return {
                    question: SQ,
                    passed: null,
                }
            }),
        }

        const newAnswers: { [key: number]: number[] } = {}

        newQuiz.questions?.forEach(Q => {
            newAnswers[Q.question.id] = []
        })

        newQuiz.answers = newAnswers

        const { data } = await axios.post('/api/quiz/upsert', newQuiz)

        setCurrentQuizId(data)
        navigateToTab(2)
    }

    const questionsToShow = questions.filter(Q => {
        const stringToFilter = Q.id + " " + Q.questionString
        return stringToFilter.includes(searchText)
    })

    return (
        <Box width={"100%"} height={"100%"}>
            <QuestionAdditionModel open={addDialogOpen} close={() => setAddDialogOpen(false)} refresh={loadQuestions} />
            <Stack spacing={2}>
                <Box width={"100%"} display={"flex"} justifyContent={"space-between"}>
                    <Box display={"flex"}>
                        <Typography variant="h5">Question Bank ({loading ? "..." : `${questions.length}`})</Typography>
                        <Divider orientation="vertical" sx={{ ml: 2, mr: 2 }} />
                        <TextField size="small" placeholder="Search..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                        <Button onClick={() => selectedQuestions.length === questions.length ? setSelectedQuestions([]) : setSelectedQuestions(questions)}>{selectedQuestions.length === questions.length ? 'Unselect all' : 'Select all'}</Button>
                    </Box>

                    <ButtonGroup variant="contained">
                        <Button onClick={() => setAddDialogOpen(true)} disabled={addDialogOpen}>Add Question</Button>
                        <Button disabled={selectedQuestions.length === 0} onClick={createNewQuiz}>Start Quiz</Button>
                    </ButtonGroup>
                </Box>

                <Box width={"100%"} overflow={'scroll'} height={'80vh'} padding={1} >
                    <Stack spacing={2}>
                        {
                            questionsToShow.map(Q => {
                                return <QuestionCard key={Q.id} question={Q} toggleQuestionSelection={toggleQuestionSelection} selected={Boolean(selectedQuestions.find(SQ => Q.id === SQ.id))} refresh={loadQuestions} />
                            })
                        }
                    </Stack>
                </Box>
            </Stack>
        </Box>
    )
}

export default QuestionsPage