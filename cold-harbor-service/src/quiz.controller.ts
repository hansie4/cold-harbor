import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizForUI } from 'src';

@Controller('api/quiz')
export class QuizController {
    constructor(private readonly quizService: QuizService) { }

    @Get()
    async getQuizes(): Promise<QuizForUI[]> {
        const quizes = await this.quizService.getAllQuizes()
        return quizes
    }

    @Post('upsert')
    async addQuizes(@Body() quizFromUI: QuizForUI): Promise<QuizForUI> {
        const quiz = await this.quizService.updateQuiz(quizFromUI)
        return quiz
    }

    @Get('delete')
    async deleteQuiz(@Query('id') id): Promise<void> {
        await this.quizService.deleteQuiz(id)
    }
}
