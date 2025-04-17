import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './question.entity';
import { Quiz } from './quiz.entity';
import { QuizModule } from './quiz.module';
import { QuestionModule } from './question.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'cold_harbor.db',
      entities: [Question, Quiz],
      synchronize: true,
    }),
    QuizModule,
    QuestionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
