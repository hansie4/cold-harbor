import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Switch, TextField } from "@mui/material"
import { useState } from "react";

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import { QuestionForUI } from "../../../cold-harbor-service/src";

const QuestionAdditionModel = ({ open, close, refresh }: { open: boolean; close: () => void; refresh: () => Promise<void> }) => {
    const [questionText, setQuestionText] = useState("")
    const [answerChoices, setAnswerChoices] = useState<{ choice: string, id: number, isAnswer: boolean }[]>([{ id: 0, choice: "", isAnswer: false }, { id: 1, choice: "", isAnswer: false }, { id: 2, choice: "", isAnswer: false }, { id: 3, choice: "", isAnswer: false }])
    const [loading, setLoading] = useState(false)

    const updateAnswerChoice = (id: number, choice: string, isAnswer: boolean) => {
        setAnswerChoices((oldAC) => {
            const newAC = [...oldAC]

            const AC = newAC.find((AC) => AC.id === id)

            if (AC !== undefined) {
                AC.choice = choice
                AC.isAnswer = isAnswer
            }

            return newAC
        })
    }

    const removeAnswerChoice = (id: number) => {
        setAnswerChoices((oldAC) => {
            const newAC = oldAC.filter(AC => AC?.id !== id)

            return newAC.map((AC, I) => {
                return { id: I, choice: AC.choice, isAnswer: AC.isAnswer }
            })
        })
    }

    const addQuestion = async () => {
        const data: Partial<QuestionForUI> = {
            questionString: questionText,
            answerChoices: answerChoices.map(AC => AC.choice),
            correctAnswers: answerChoices.map((AC, I) => AC.isAnswer ? I : null).filter(AC => AC !== null)
        }

        setLoading(true)

        await axios.post('/api/question/insert', data)
        await refresh()

        setLoading(false)

        close()

        setQuestionText('')
        setAnswerChoices([{ id: 0, choice: "", isAnswer: false }, { id: 1, choice: "", isAnswer: false }, { id: 2, choice: "", isAnswer: false }, { id: 3, choice: "", isAnswer: false }])
    }

    const canSubmit = Boolean(questionText) && !Boolean(answerChoices.find(AC => AC.choice.length === 0)) && Boolean(answerChoices.find(AC => AC.isAnswer === true))


    return (
        <Dialog open={open} onClose={close} maxWidth="md" fullWidth>
            <DialogTitle>Add new question</DialogTitle>
            <DialogContent>
                <TextField
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    autoFocus
                    required
                    margin="dense"
                    id="questionText"
                    name="questionText"
                    label="Question"
                    fullWidth
                    variant="standard"
                    sx={{ mb: 2 }}
                />
                <DialogContentText>Answer choices:</DialogContentText>

                {
                    answerChoices.map((_, I) => {
                        const AC = answerChoices[I]
                        return (
                            <Box key={I} width={"100%"} display={"flex"} marginBottom={1}>
                                <Switch checked={AC.isAnswer} onChange={(e) => updateAnswerChoice(I, AC.choice, e.target.checked)} disabled={loading} />
                                <TextField size="small" fullWidth value={AC.choice} onChange={(e) => updateAnswerChoice(I, e.target.value, AC.isAnswer)} disabled={loading} />
                                <IconButton onClick={() => removeAnswerChoice(I)} disabled={loading}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        )
                    })
                }

                <Box display={"flex"} justifyContent={"end"}>
                    <IconButton color="primary" onClick={() => setAnswerChoices((oldAC) => [...oldAC, { id: oldAC.length, choice: "", isAnswer: false }])} disabled={loading}>
                        <AddIcon />
                    </IconButton>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button disabled={!canSubmit || loading} onClick={addQuestion}>Submit</Button>
            </DialogActions>
        </Dialog>
    )
}

export default QuestionAdditionModel