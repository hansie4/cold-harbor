import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizForUI } from 'src';
import { Repository } from 'typeorm';
import { Quiz } from './quiz.entity';

@Injectable()
export class QuizService {
    private readonly logger = new Logger(QuizService.name);

    constructor(
        @InjectRepository(Quiz)
        private quizRepository: Repository<Quiz>,
    ) { }

    async getAllQuizes(): Promise<QuizForUI[]> {
        const quizes = await this.quizRepository.find()
        this.logger.log(`Retrieved ${quizes.length} quizes.`)
        return quizes.map((Q) => Quiz.toQuizForUI(Q))
    }

    async updateQuiz(quizFromUI: QuizForUI): Promise<QuizForUI> {
        const quizForDB = Quiz.fromQuizForUI(quizFromUI)
        const quiz = await this.quizRepository.upsert(quizForDB, ["id"])
        this.logger.log(`Added quiz ${quiz.raw.id}.`)
        return quiz.raw
    }

    async deleteQuiz(id: number): Promise<void> {
        this.logger.log(`Deleted quiz ${id}.`)
        await this.quizRepository.delete({ id: id })
    }
}
