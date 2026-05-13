import { Injectable } from '@nestjs/common';
import { ITask } from './task.model';

@Injectable()
export class TasksService {
  private tasks: ITask[] = [];

  findAll(): ITask[] {
    return this.tasks;
  }

  findOne(id: string): ITask | undefined {
    return this.tasks.find((task) => task.id === id);
  }
}
