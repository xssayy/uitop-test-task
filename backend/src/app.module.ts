import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { CategoryModule } from './category/category.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, TodosModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
