import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Task } from '../models/task.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: Task[] = []; // Lista de tareas en memoria
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init().then(() => {
      this.loadTasks();
    });
  }

  // Inicialización de IndexedDB e Ionic Storage
  private async init() {
    this._storage = await this.storage.create();
    await this.initializeIndexedDB();
  }

  // Configuración de IndexedDB
  private async initializeIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const dbRequest = indexedDB.open('TaskDB', 1);

      dbRequest.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('tasks')) {
          db.createObjectStore('tasks', { keyPath: 'id' });
        }
      };

      dbRequest.onsuccess = () => {
        console.log('IndexedDB para tareas inicializado correctamente.');
      };

      dbRequest.onerror = (event) => {
        console.error('Error al inicializar IndexedDB:', event);
      };
    });
  }

  // Cargar tareas desde IndexedDB
  private async loadTasks() {

    const dbRequest = indexedDB.open('TaskDB');

    return new Promise<void>((resolve, reject) => {
      dbRequest.onsuccess = (event: any) => {
          const db = event.target.result;
          const transaction = db.transaction('tasks', 'readonly');
          const store = transaction.objectStore('tasks');
          const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => {
          this.tasks = getAllRequest.result || [];
          console.log('Tareas cargadas desde IndexedDB:', this.tasks);
          resolve();
        };

        getAllRequest.onerror = () => {
          console.error('Error al cargar tareas desde IndexedDB.');
          reject();
        };
      }

      dbRequest.onerror = () => {
        console.error('Error al abrir IndexedDB.');
        reject();
      };
    });
  }

  // Obtener tareas, opcionalmente filtradas por categoría
  async getTasks(categoryId?: string): Promise<Task[]> {
    if(this.tasks.length === 0){
      await this.loadTasks();
    }
    if (categoryId) {
      return this.tasks.filter((task) => task.categoryId === categoryId);
    }
    return this.tasks;
  }

  // Agregar una nueva tarea
  addTask(title: string, categoryId?: string): void {
    const newTask: Task = {
      id: uuidv4(),
      title,
      completed: false,
      categoryId,
    };
    this.tasks.push(newTask);
    this.saveTasks();
    this.saveTaskToIndexedDB(newTask); // Guarda también en IndexedDB
  }

  // Alternar el estado de finalización de una tarea
  toggleTaskCompletion(task: Task): void {
    if (task) {
      this.saveTasks();
      this.updateTaskInIndexedDB(task); // Actualiza también en IndexedDB
    }
  }

  // Eliminar una tarea
  deleteTask(taskId: string): void {
    this.tasks = this.tasks.filter((t) => t.id !== taskId);
    this.saveTasks();
    this.deleteTaskFromIndexedDB(taskId); // Elimina también de IndexedDB
  }

  // Guardar tareas en Ionic Storage
  async saveTasks() {
    if (!this._storage) {
      throw new Error('Database not created. Must call create() first.');
    }
    await this._storage.set('tasks', this.tasks);
    console.log('Tareas guardadas en Ionic Storage:', this.tasks);
  }

  // Métodos para operaciones en IndexedDB

  private saveTaskToIndexedDB(task: Task): void {
    const dbRequest = indexedDB.open('TaskDB');
    dbRequest.onsuccess = (event: any) => {
      const db = event.target.result;
      const transaction = db.transaction('tasks', 'readwrite');
      const store = transaction.objectStore('tasks');
      store.add(task);
      console.log('Tarea guardada en IndexedDB:', task);
    }; 
  }

  private updateTaskInIndexedDB(task: Task): void {
    const dbRequest = indexedDB.open('TaskDB');
    dbRequest.onsuccess = (event: any) => {
      const db = event.target.result;
      const transaction = db.transaction('tasks', 'readwrite');
      const store = transaction.objectStore('tasks');
      store.put(task);
      console.log('Tarea actualizada en IndexedDB:', task);
    };  
  }

  private deleteTaskFromIndexedDB(taskId: string): void {
    const dbRequest = indexedDB.open('TaskDB');
    dbRequest.onsuccess = (event: any) => {
      const db = event.target.result;
      const transaction = db.transaction('tasks', 'readwrite');
      const store = transaction.objectStore('tasks');
      store.delete(taskId);
      console.log(`Tarea con ID ${taskId} eliminada de IndexedDB.`);
    }
  }

  // Listar tareas en IndexedDB (para depuración)
  listTasksFromIndexedDB(): void {
    const dbRequest = indexedDB.open('TaskDB');
    dbRequest.onsuccess = (event: any) => {
      const db = event.target.result;
      const transaction = db.transaction('tasks', 'readonly');
      const store = transaction.objectStore('tasks');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => {
        console.log('Tareas en IndexedDB:', getAllRequest.result);
      };
    }
  }
}
