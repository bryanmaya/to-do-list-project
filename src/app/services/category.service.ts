import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Category } from '../models/category.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categories: Category[] = [];
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init().then(() => {
      this.loadCategories();
    });
  }

  private async init() {
    this._storage = await this.storage.create();
    await this.initializeIndexedDB();
  }

  private async initializeIndexedDB() {
    const dbRequest = indexedDB.open('CategoryDB', 1);

    dbRequest.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('categories')) {
        db.createObjectStore('categories', { keyPath: 'id' });
      }
    };

    dbRequest.onsuccess = () => {
      console.log('IndexedDB inicializado correctamente.');
    };

    dbRequest.onerror = (event) => {
      console.error('Error al inicializar IndexedDB:', event);
    };
  }

  private async loadCategories() {
    const dbRequest = indexedDB.open('CategoryDB');

    return new Promise<void>((resolve, reject) => {
      dbRequest.onsuccess = (event: any) => {
        const db = event.target.result;
        const transaction = db.transaction('categories', 'readonly');
        const store = transaction.objectStore('categories');
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => {
          this.categories = getAllRequest.result || [];
          console.log('Categorías cargadas desde IndexedDB:', this.categories);
          resolve();
        };

        getAllRequest.onerror = () => {
          console.error('Error al cargar categorías desde IndexedDB.');
          reject();
        };
      };

      dbRequest.onerror = () => {
        console.error('Error al abrir IndexedDB.');
        reject();
      };
    });
  }

  async getCategories(): Promise<Category[]> {
    if (this.categories.length === 0) {
      await this.loadCategories();
    }
    return this.categories;
  }

  async addCategory(name: string) {
    const newCategory: Category = {
      id: uuidv4(),
      name,
    };
    this.categories.push(newCategory);
    await this.saveCategories();
    this.saveCategoryToIndexedDB(newCategory);
  }

  editCategory(id: string, name: string) {
    const category = this.categories.find((c) => c.id === id);
    if (category) {
      category.name = name;
      this.saveCategories();
      this.updateCategoryInIndexedDB(category);
    }
  }

  deleteCategory(id: string) {
    this.categories = this.categories.filter((c) => c.id !== id);
    this.saveCategories();
    this.deleteCategoryFromIndexedDB(id);
  }

  private async saveCategories() {
    if (!this._storage) {
      throw new Error('Storage not initialized. Must call init() first.');
    }
    await this._storage.set('categories', this.categories);
    console.log('Categorías guardadas:', this.categories);
  }

  private saveCategoryToIndexedDB(category: Category) {
    const dbRequest = indexedDB.open('CategoryDB');
    dbRequest.onsuccess = (event: any) => {
      const db = event.target.result;
      const transaction = db.transaction('categories', 'readwrite');
      const store = transaction.objectStore('categories');
      store.add(category);
      console.log('Categoría guardada en IndexedDB:', category);
    };
  }

  private updateCategoryInIndexedDB(category: Category) {
    const dbRequest = indexedDB.open('CategoryDB');
    dbRequest.onsuccess = (event: any) => {
      const db = event.target.result;
      const transaction = db.transaction('categories', 'readwrite');
      const store = transaction.objectStore('categories');
      store.put(category);
      console.log('Categoría actualizada en IndexedDB:', category);
    };
  }

  private deleteCategoryFromIndexedDB(id: string) {
    const dbRequest = indexedDB.open('CategoryDB');
    dbRequest.onsuccess = (event: any) => {
      const db = event.target.result;
      const transaction = db.transaction('categories', 'readwrite');
      const store = transaction.objectStore('categories');
      store.delete(id);
      console.log(`Categoría con ID ${id} eliminada de IndexedDB.`);
    };
  }

  listCategoriesFromIndexedDB() {
    const dbRequest = indexedDB.open('CategoryDB');
    dbRequest.onsuccess = (event: any) => {
      const db = event.target.result;
      const transaction = db.transaction('categories', 'readonly');
      const store = transaction.objectStore('categories');
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => {
        console.log('Categorías en IndexedDB:', getAllRequest.result);
      };
    };
  }
}
