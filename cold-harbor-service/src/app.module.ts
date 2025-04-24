import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './question.entity';
import { Quiz } from './quiz.entity';
import { QuizModule } from './quiz.module';
import { QuestionModule } from './question.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'cold-harbor-ui', 'dist'),
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'cold_harbor_data/cold_harbor.db',
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
