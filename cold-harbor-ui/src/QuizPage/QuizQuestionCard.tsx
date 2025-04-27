import { Box, Divider, Typography } from "@mui/material"
import { QuestionForUI } from "../../../cold-harbor-service/src/index"
import Checkbox from '@mui/material/Checkbox';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const QuizQuestionCard = ({ question, answers, setAnswers, isReadOnly, correct }: {
    question: QuestionForUI; answers: { [key: number]: number[] }; setAnswers: (e: any) => void; isReadOnly: boolean; correct?: boolean
}) => {

    return (
        <Box key={question.id} border="1px solid rgba(0, 0, 0, 0.87)" borderRadius={4} padding={1} sx={{ backgroundColor: "#C7CEDB" }} >
            <Box display={'flex'} width={'100%'}>
                <Box width={'100%'}>
                    <Box display={'flex'} width={'100%'} justifyContent={'space-between'}>
                        <Typography variant="h5">{correct === undefined ? null : correct ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />} #{question.id}. {question.questionString}</Typography>
                    </Box>

                    <Divider />
                    <Typography>Answer Choices({question.correctAnswers.length}): </Typography>
                    {
                        question.answerChoices.map((AC, I) => {
                            const checked = Boolean(answers[question.id]?.includes(I))
                            return (
                                <Box key={I} display={'flex'}>
                                    {
                                        isReadOnly ? <>
                                            {question.correctAnswers.includes(I) ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
                                        </> : <Checkbox size="small" checked={checked} onChange={(e) => setAnswers((prev: { [key: number]: number[] }) => {
                                            let arr = prev[question.id]
                                            if (e.target.checked) {
                                                arr.push(I)
                                            } else {
                                                arr = arr.filter((Z: number) => Z !== I)
                                            }
                                            return { ...prev, [question.id]: arr }
                                        })} />
                                    }
                                    <Typography sx={{ ml: 1 }} >{AC}</Typography>{isReadOnly && checked ? <Typography sx={{ ml: 4 }} fontFamily={'monospace'}>{`← You answered`}</Typography> : null}
                                </Box>
                            )
                        })
                    }
                </Box>
            </Box>
        </Box>
    )
}

export default QuizQuestionCard

export const toLetter = (n: number) => {
    if (n === 0) return 'A'
    if (n === 1) return 'B'
    if (n === 2) return 'C'
    if (n === 3) return 'D'
    return 'E'
}