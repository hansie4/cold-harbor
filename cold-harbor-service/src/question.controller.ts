import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionForUI } from 'src';

@Controller("api/question")
export class QuestionController {
    constructor(private readonly questionService: QuestionService) { }

    @Get()
    async getAllQuestions(): Promise<QuestionForUI[]> {
        const questions = await this.questionService.getAllQuestions();
        return questions
    }

    @Post('insert')
    async addQuestion(@Body() questionFromUI: QuestionForUI): Promise<QuestionForUI> {
        const question = await this.questionService.addQuestion(questionFromUI)
        return question
    }

    @Get('delete')
    async deleteQuestion(@Query('id') id: number): Promise<void> {
        await this.questionService.deleteQuestion(id)
    }
}
