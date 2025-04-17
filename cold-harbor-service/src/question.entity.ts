
import { QuestionForUI } from 'src';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    questionString: string;

    @Column()
    answerChoices: string;

    @Column()
    correctAnswers: string;

    static toQuestionForUI(question: Question): QuestionForUI {
        return {
            id: question.id,
            questionString: question.questionString,
            answerChoices: JSON.parse(question.answerChoices),
            correctAnswers: JSON.parse(question.correctAnswers)
        }
    }

    static fromQuestionFromUI(questionFromUI: QuestionForUI): Question {
        return {
            id: questionFromUI.id,
            questionString: questionFromUI.questionString,
            answerChoices: JSON.stringify(questionFromUI.answerChoices),
            correctAnswers: JSON.stringify(questionFromUI.correctAnswers)
        }
    }
}
