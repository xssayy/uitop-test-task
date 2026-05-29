import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoBulkDto } from './dto/update-todo-bulk.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createTodoDto: CreateTodoDto) {
    const category = await this.prismaService.category.findUnique({
      where: { id: createTodoDto.categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const count = await this.prismaService.todo.count({
      where: { categoryId: createTodoDto.categoryId, deletedAt: null },
    });
    if (count >= 5) {
      throw new BadRequestException('Category already has 5 todos');
    }
    return this.prismaService.todo.create({
      data: createTodoDto,
      include: { category: true },
    });
  }

  findAll(categoryId?: number) {
    return this.prismaService.todo.findMany({
      where: { categoryId, deletedAt: null },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const todo = await this.prismaService.todo.findFirst({
      where: { id, deletedAt: null },
    });
    if (!todo) {
      throw new NotFoundException('todo not found');
    }
    return todo;
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prismaService.todo.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async update(id: number, dto: UpdateTodoDto) {
    const todo = await this.prismaService.todo.findUnique({ where: { id } });
    if (!todo) {
      throw new NotFoundException('todo not found');
    }

    return this.prismaService.todo.update({
      where: { id },
      data: dto,
      include: { category: true },
    });
  }

  async updateStatusBulk(dto: UpdateTodoBulkDto) {
    const uniqueIds = [...new Set(dto.ids)];

    const found = await this.prismaService.todo.findMany({
      where: { id: { in: uniqueIds }, deletedAt: null },
      select: { id: true },
    });

    if (found.length !== uniqueIds.length) {
      const foundIds = found.map((t) => t.id);
      const missingIds = uniqueIds.filter((id) => !foundIds.includes(id));
      throw new NotFoundException(
        `Todos with ids [${missingIds.join(', ')}] not found`,
      );
    }

    await this.prismaService.todo.updateMany({
      where: { id: { in: uniqueIds } },
      data: { completed: dto.completed },
    });
  }
}
