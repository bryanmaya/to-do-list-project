import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-add-task-modal',
  templateUrl: './add-task-modal.component.html',
})
export class AddTaskModalComponent {
  @Input() categories: (Category & { selected: boolean })[] = [];
  title: string = '';

  constructor(private modalCtrl: ModalController) {}

  close() {
    this.modalCtrl.dismiss();
  }

  save() {
    const selectedCategories = this.categories.filter((cat) => cat.selected);
    this.modalCtrl.dismiss({
      title: this.title,
      selectedCategories,
    });
  }
}
