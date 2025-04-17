
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './quiz.entity';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { AppService } from './app.service';

@Module({
    imports: [TypeOrmModule.forFeature([Quiz])],
    providers: [QuizService],
    controllers: [QuizController],
})
export class QuizModule { }
