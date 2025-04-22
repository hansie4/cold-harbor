export interface QuestionForUI {
    id: number
    questionString: string
    answerChoices: string[]
    correctAnswers: number[]
}

export interface QuizForUI {
    id: number
    questions: {
        question: QuestionForUI
        passed: boolean | null
    }[]
    answers: { [key: number]: number[] }
}