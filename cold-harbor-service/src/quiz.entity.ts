
import { QuizForUI } from 'src';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Quiz {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    questions: string;

    @Column()
    score: number

    static fromQuizForUI(quizFromUI: QuizForUI): Quiz {
        return {
            id: quizFromUI.id,
            questions: JSON.stringify(quizFromUI.questions),
            score: quizFromUI.score
        }
    }

    static toQuizForUI(quiz: Quiz): QuizForUI {
        return {
            id: quiz.id,
            questions: JSON.parse(quiz.questions),
            score: quiz.score
        }
    }
}
