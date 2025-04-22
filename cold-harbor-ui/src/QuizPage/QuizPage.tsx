import { useContext, useEffect, useState } from "react"
import { QuestionForUI, QuizForUI } from "../../../cold-harbor-service/src"
import { QuizContext } from "../App"
import axios from "axios"
import { Box, Button, ButtonGroup, Divider, Stack, Typography } from "@mui/material"
import QuizQuestionCard from "./QuizQuestionCard"

const QuizPage = () => {
    const { currentQuizId, navigateToTab, setSelectedQuestions } = useContext(QuizContext)
    const [quiz, setQuiz] = useState<QuizForUI>()
    const [loading, setLoading] = useState(false)

    const [answers, setAnswers] = useState<{ [key: number]: number[] }>({})

    const loadQuiz = async (id: number) => {
        setLoading(true)
        const { data } = await axios.get('/api/quiz')
        const q: QuizForUI = data.find((Q: QuizForUI) => Q.id === id)
        setQuiz(q)
        setAnswers(q.answers)
        setLoading(false)
    }

    useEffect(() => {
        if (currentQuizId) {
            loadQuiz(currentQuizId)
        }
    }, [currentQuizId])

    const isSubmitAllowed = Object.keys(answers).findIndex((A: string) => answers[parseInt(A)].length === 0) === -1

    const submit = async () => {
        if (quiz) {
            setLoading(true)

            const data: QuizForUI = {
                id: quiz.id,
                questions: quiz.questions.map(Q => {
                    const set1 = new Set(answers[Q.question.id])
                    const set2 = new Set(Q.question.correctAnswers)

                    const passed: boolean = areSetsEqual(set1, set2)

                    return {
                        question: Q.question,
                        passed: passed
                    }
                }),
                answers: answers
            }

            await axios.post('/api/quiz/upsert', data)

            if (currentQuizId) {
                loadQuiz(currentQuizId)
            }
        }
    }

    const isQuizComplete = quiz?.questions.filter(Q => Q.passed === null).length === 0

    const questionsToShow = isQuizComplete ? [quiz.questions.filter(Q => !Q.passed), quiz.questions.filter(Q => Q.passed)] : quiz?.questions

    return (
        <Box width={"100%"} height={"100%"}>
            <Stack spacing={2}>
                <Box width={"100%"} display={"flex"} justifyContent={"space-between"}>
                    <Box display={"flex"}>
                        <Typography variant="h5">Quiz #{currentQuizId} {isQuizComplete ? `(${getScore(quiz)})` : null}</Typography>
                    </Box>

                    <ButtonGroup variant="contained" disabled={loading}>
                        {
                            isQuizComplete ? <Button onClick={() => {
                                navigateToTab(0)
                                setSelectedQuestions(quiz.questions.map(Q => Q.question))
                            }}>Retake</Button> : <Button disabled={!isSubmitAllowed} color="success" onClick={submit}>Submit</Button>
                        }
                    </ButtonGroup>
                </Box>

                <Box width={"100%"} overflow={'scroll'} height={'80vh'} padding={1} >
                    {
                        isQuizComplete ? (<Stack spacing={2}>
                            <h4>Incorrect ({questionsToShow[0].length}):</h4>
                            {
                                questionsToShow[0].map(Q => (Q as unknown as { question: QuestionForUI }).question).map(Q => <QuizQuestionCard key={Q.id} question={Q} answers={answers} setAnswers={setAnswers} isReadOnly={isQuizComplete} correct={false} />)
                            }
                            <Divider sx={{ mt: 2, mb: 2 }} />
                            <h4>Correct ({questionsToShow[1].length}):</h4>
                            {
                                questionsToShow[1].map(Q => (Q as unknown as { question: QuestionForUI }).question).map(Q => <QuizQuestionCard key={Q.id} question={Q} answers={answers} setAnswers={setAnswers} isReadOnly={isQuizComplete} correct={true} />)
                            }
                        </Stack>)
                            : <Stack spacing={2}>
                                {
                                    questionsToShow?.map(Q => (Q as { question: QuestionForUI }).question).map(Q => <QuizQuestionCard key={Q.id} question={Q} answers={answers} setAnswers={setAnswers} isReadOnly={isQuizComplete} />)
                                }
                            </Stack>
                    }
                </Box>
            </Stack>
        </Box>
    )
}

export default QuizPage

const getScore = (quiz: QuizForUI) => {
    const passed = quiz.questions.reduce((prev, current) => {
        return current.passed ? prev + 1 : prev
    }, 0)
    return `${Math.round((passed / quiz.questions.length) * 100)}%`
}

export const areSetsEqual = (set1: Set<number>, set2: Set<number>) => {
    if (set1.size !== set2.size) {
        return false;
    }
    for (let element of set1) {
        if (!set2.has(element)) {
            return false;
        }
    }
    return true;
}