
import { QuizForUI } from 'src';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Quiz {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    questions: string;

    @Column()
    answers: string;

    static fromQuizForUI(quizFromUI: QuizForUI): Quiz {
        return {
            id: quizFromUI.id,
            questions: JSON.stringify(quizFromUI.questions),
            answers: JSON.stringify(quizFromUI.answers)
        }
    }

    static toQuizForUI(quiz: Quiz): QuizForUI {
        return {
            id: quiz.id,
            questions: JSON.parse(quiz.questions),
            answers: JSON.parse(quiz.answers)
        }
    }
}
