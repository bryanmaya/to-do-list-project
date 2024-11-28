import { Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../services/category.service';
import { Task } from '../../models/task.model';
import { Category } from '../../models/category.model';
import { AddTaskModalComponent } from '../../components/add-task-modal/add-task-modal.component';

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
    private modalCtrl: ModalController,
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

  async loadTasks() {
    this.tasks = await this.taskService.getTasks();
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
    const modal = await this.modalCtrl.create({
      component: AddTaskModalComponent,
      componentProps: {
        // Agregar la propiedad 'selected' dinámicamente al pasar las categorías
        categories: this.categories.map((cat) => ({ ...cat, selected: false })),
      },
    });
  
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        const { title, selectedCategories } = result.data;
        console.log(selectedCategories)
        selectedCategories.forEach(element => {
          if (element) {
            this.taskService.addTask(title, element.id|| undefined);
            this.loadTasks();
          }
        });
      }
    });
  
    await modal.present();
  }
  
  toggleTaskCompletion(taskId: string) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      console.log(task.completed)
      this.taskService.toggleTaskCompletion(task); // Guarda los cambios en el almacenamiento
      // Actualiza solo la lista filtrada
      this.filteredTasks = this.filteredTasks.map((t) =>
        t.id === taskId ? { ...t, completed: task.completed } : t
      );
    }
  }

  deleteTask(taskId: string) {
    this.tasks = this.tasks.filter((t) => t.id !== taskId);
    this.filteredTasks = this.filteredTasks.filter((t) => t.id !== taskId); // Actualiza la lista filtrada
    this.taskService.deleteTask(taskId);
  }

  getCategoryName(categoryId?: string): string {
    const category = this.categories.find((c) => c.id === categoryId);
    return category ? category.name : 'Sin Categoría';
  }
}
