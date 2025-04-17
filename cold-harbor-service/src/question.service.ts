import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Question } from './question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionForUI } from 'src';

@Injectable()
export class QuestionService {
    private readonly logger = new Logger(QuestionService.name);

    constructor(
        @InjectRepository(Question)
        private questionRepository: Repository<Question>,
    ) { }

    async getAllQuestions(): Promise<QuestionForUI[]> {
        const questions = await this.questionRepository.find()
        this.logger.log(`Retrieved ${questions.length} questions.`)
        return questions.map((Q) => Question.toQuestionForUI(Q))
    }

    async addQuestion(questionFromUI: QuestionForUI): Promise<QuestionForUI> {
        const res = await this.questionRepository.insert(Question.fromQuestionFromUI(questionFromUI))
        this.logger.log(`Added question ${res.raw.id}.`)
        return res.raw
    }

    async deleteQuestion(id: number): Promise<void> {
        this.logger.log(`Deleted question ${id}.`)
        await this.questionRepository.delete({ id: id })
    }
}
