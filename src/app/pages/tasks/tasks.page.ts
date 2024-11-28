import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../services/category.service';
import { Task } from '../../models/task.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage {
  tasks: Task[] = [];
  categories: Category[] = [];
  filteredTasks: Task[] = [];
  selectedCategoryId: string = '';

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private alertCtrl: AlertController
  ) {
    this.loadCategories();
    this.loadTasks();
  }

  async loadCategories() {
    this.categories = await this.categoryService.getCategories();
  }

  loadTasks() {
    this.tasks = this.taskService.getTasks();
    this.filterTasks();
  }

  filterTasks() {
    if (this.selectedCategoryId) {
      this.filteredTasks = this.tasks.filter(
        (task) => task.categoryId === this.selectedCategoryId
      );
    } else {
      this.filteredTasks = [...this.tasks];
    }
  }

  async openAddTaskModal() {
    const categoryInputs = this.categories.map((category) => ({
      name: 'category',
      type: 'radio' as const,
      label: category.name,
      value: category.id,
    }));

    const alert = await this.alertCtrl.create({
      header: 'Nueva Tarea',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Título de la tarea',
        },
        ...categoryInputs,
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data.title) {
              this.taskService.addTask(data.title, data.category || undefined);
              this.loadTasks();
            }
          },
        },
      ],
    });

    await alert.present();
  }

  toggleTaskCompletion(taskId: string) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      this.taskService.saveTasks(); // Guarda los cambios en el almacenamiento
      // Actualiza solo la lista filtrada
      this.filteredTasks = this.filteredTasks.map((t) =>
        t.id === taskId ? { ...t, completed: task.completed } : t
      );
    }
  }

  deleteTask(taskId: string) {
    this.tasks = this.tasks.filter((t) => t.id !== taskId);
    this.filteredTasks = this.filteredTasks.filter((t) => t.id !== taskId); // Actualiza la lista filtrada
    this.taskService.saveTasks();
  }

  getCategoryName(categoryId?: string): string {
    const category = this.categories.find((c) => c.id === categoryId);
    return category ? category.name : 'Sin Categoría';
  }
}
