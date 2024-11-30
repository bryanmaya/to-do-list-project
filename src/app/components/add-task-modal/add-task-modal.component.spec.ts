import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AddTaskModalComponent } from './add-task-modal.component';
import { Category } from '../../models/category.model';

describe('AddTaskModalComponent', () => {
  let component: AddTaskModalComponent;
  let fixture: ComponentFixture<AddTaskModalComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['dismiss']);

    await TestBed.configureTestingModule({
      declarations: [AddTaskModalComponent],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddTaskModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cerrar el modal al llamar a close()', () => {
    component.close();
    expect(modalControllerSpy.dismiss).toHaveBeenCalled();
  });

  it('debería guardar la tarea con las categorías seleccionadas al llamar a save()', () => {
    const categories: (Category & { selected: boolean })[] = [
      { id: '1', name: 'Category 1', selected: true },
      { id: '2', name: 'Category 2', selected: false },
    ];
    component.categories = categories;
    component.title = 'Nueva Tarea';

    component.save();

    expect(modalControllerSpy.dismiss).toHaveBeenCalledWith({
      title: 'Nueva Tarea',
      selectedCategories: [{ id: '1', name: 'Category 1', selected: true }],
    });
  });

  it('debería enviar categorías seleccionadas vacías si ninguna está marcada', () => {
    const categories: (Category & { selected: boolean })[] = [
      { id: '1', name: 'Category 1', selected: false },
      { id: '2', name: 'Category 2', selected: false },
    ];
    component.categories = categories;
    component.title = 'Nueva Tarea';

    component.save();

    expect(modalControllerSpy.dismiss).toHaveBeenCalledWith({
      title: 'Nueva Tarea',
      selectedCategories: [],
    });
  });
});
