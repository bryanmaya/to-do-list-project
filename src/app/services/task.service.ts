import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Task } from '../models/task.model';
import { v4 as uuidv4 } from 'uuid'; // Para generar IDs únicos

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: Task[] = [];
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  private async init() {
    this._storage = await this.storage.create();
    const storedTasks = await this._storage.get('tasks');
    this.tasks = storedTasks || [];
  }

  getTasks(categoryId?: string): Task[] {
    if (categoryId) {
      return this.tasks.filter((task) => task.categoryId === categoryId);
    }
    return this.tasks;
  }

  addTask(title: string, categoryId?: string): void {
    const newTask: Task = {
      id: uuidv4(),
      title,
      completed: false,
      categoryId,
    };
    this.tasks.push(newTask);
    this.saveTasks();
  }

  toggleTaskCompletion(taskId: string): void {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks(); // Guarda automáticamente los cambios
    }
  }

  deleteTask(taskId: string): void {
    this.tasks = this.tasks.filter((t) => t.id !== taskId);
    this.saveTasks(); // Guarda automáticamente los cambios
  }

  async saveTasks() {
    if (!this._storage) {
      throw new Error('Database not created. Must call create() first.');
    }
    await this._storage.set('tasks', this.tasks);
  }
}
