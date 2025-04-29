import { Box, Divider, IconButton, Typography } from "@mui/material"
import { QuestionForUI } from "../../../cold-harbor-service/src/index"
import Checkbox from '@mui/material/Checkbox';
import axios from "axios";
import { useState } from "react";

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';

const QuestionCard = ({ question, toggleQuestionSelection, selected, refresh }: { question: QuestionForUI; toggleQuestionSelection: (question: QuestionForUI) => void; selected: boolean; refresh: () => void }) => {
    const [loading, setLoading] = useState(false)

    const toggle = () => {
        if (!loading) {
            toggleQuestionSelection(question)
        }
    }

    const deleteQuestion = async () => {
        setLoading(true)
        await axios.get('/api/question/delete', { params: { id: question.id } })
        setLoading(false)
        refresh()
    }


    return (
        <Box key={question.id} border="1px solid rgba(0, 0, 0, 0.87)" borderRadius={4} padding={1} sx={{ backgroundColor: "#C7CEDB", cursor: 'pointer' }} >
            <Box display={'flex'} width={'100%'}>
                <Box>
                    <Checkbox size="small" checked={selected} onChange={toggle} disabled={loading} />
                </Box>
                <Box width={'100%'}>
                    <Box display={'flex'} width={'100%'} justifyContent={'space-between'}>
                        <Typography variant="h5">#{question.id}. {question.questionString}</Typography>
                        <IconButton onClick={deleteQuestion} disabled={loading}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>

                    <Divider />
                    {/* <Typography>Answer Choices: </Typography> */}
                    {
                        question.answerChoices.map((AC, I) => {
                            return (
                                <Box key={I} display={'flex'}>
                                    {question.correctAnswers.includes(I) ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
                                    <Typography sx={{ ml: 1 }} >{AC}</Typography>
                                </Box>
                            )
                        })
                    }
                </Box>
            </Box>
        </Box>
    )
}

export default QuestionCard