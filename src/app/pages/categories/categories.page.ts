
import { Component, ElementRef, Renderer2} from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage {
  categories: Category[] = [];

  constructor(private categoryService: CategoryService, private alertCtrl: AlertController,private elementRef: ElementRef,private renderer: Renderer2) {
    this.loadCategories();
  }

  async loadCategories() {
    this.categories = await this.categoryService.getCategories();
  }

  async openAddCategoryModal() {
    const alert = await this.alertCtrl.create({
      header: 'Nueva Categoría',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre de la categoría',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data.name) {
              this.categoryService.addCategory(data.name);
              this.loadCategories();
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async editCategory(category: Category) {
    const alert = await this.alertCtrl.create({
      header: 'Editar Categoría',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre de la categoría',
          value: category.name,
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data.name) {
              this.categoryService.editCategory(category.id, data.name);
              this.loadCategories();
            }
          },
        },
      ],
    });
    await alert.present();
  }

  deleteCategory(categoryId: string) {
    this.categoryService.deleteCategory(categoryId);
    this.loadCategories();
  }

  ionViewWillEnter() {
    const contentHeader = this.elementRef.nativeElement.querySelector('ion-header');
    if (contentHeader) {
      this.renderer.setStyle(contentHeader, 'display', 'block');
    } 
    const content = this.elementRef.nativeElement.querySelector('ion-content');
    if (content) {
      this.renderer.setStyle(content, 'display', 'block');
    } 
  }

  ionViewWillLeave() {
    const contentHeader = this.elementRef.nativeElement.querySelector('ion-header');
    if (contentHeader) {
      this.renderer.setStyle(contentHeader, 'display', 'none');
    } 
    const content = this.elementRef.nativeElement.querySelector('ion-content');
    if (content) {
      this.renderer.setStyle(content, 'display', 'none');
    } 
  }
}
