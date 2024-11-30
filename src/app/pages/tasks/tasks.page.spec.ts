import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { TasksPage } from './tasks.page';
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../services/category.service';

describe('TasksPage', () => {
  let component: TasksPage;
  let fixture: ComponentFixture<TasksPage>;
  let taskServiceMock: any;
  let categoryServiceMock: any;
  let modalControllerMock: any;

  beforeEach(async () => {
    // Mock del TaskService
    taskServiceMock = {
      getTasks: jasmine.createSpy('getTasks').and.returnValue(Promise.resolve([{ id: '1', title: 'Task 1', completed: false, categoryId: '1' }])),
      addTask: jasmine.createSpy('addTask'),
      toggleTaskCompletion: jasmine.createSpy('toggleTaskCompletion'),
      deleteTask: jasmine.createSpy('deleteTask'),
    };

    // Mock del CategoryService
    categoryServiceMock = {
      getCategories: jasmine.createSpy('getCategories').and.returnValue(Promise.resolve([{ id: '1', name: 'Category 1' }])),
    };

    // Mock del ModalController
    modalControllerMock = {
      create: jasmine.createSpy('create').and.returnValue({
        present: jasmine.createSpy('present'),
        onDidDismiss: jasmine.createSpy('onDidDismiss').and.returnValue(Promise.resolve({ data: { title: 'New Task', selectedCategories: [{ id: '1', name: 'Category 1' }] } })),
      }),
    };

    await TestBed.configureTestingModule({
      declarations: [TasksPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: CategoryService, useValue: categoryServiceMock },
        { provide: ModalController, useValue: modalControllerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TasksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar categorías al iniciar', async () => {
    await component.loadCategories();
    expect(categoryServiceMock.getCategories).toHaveBeenCalled();
    expect(component.categories.length).toBe(1);
    expect(component.categories[0].name).toBe('Category 1');
  });

  it('debería cargar tareas al iniciar', async () => {
    await component.loadTasks();
    expect(taskServiceMock.getTasks).toHaveBeenCalled();
    expect(component.tasks.length).toBe(1);
    expect(component.tasks[0].title).toBe('Task 1');
  });

  it('debería filtrar tareas por categoría', async () => {
    await component.loadTasks();
    component.selectedCategoryId = '1';
    component.filterTasks();
    expect(component.filteredTasks.length).toBe(1);
    expect(component.filteredTasks[0].title).toBe('Task 1');
  });

  it('debería agregar una nueva tarea desde el modal', async () => {
    await component.openAddTaskModal();
    expect(modalControllerMock.create).toHaveBeenCalled();
    expect(taskServiceMock.addTask).toHaveBeenCalledWith('New Task', '1');
  });

  it('debería alternar el estado de completado de una tarea', async () => {
    await component.loadTasks();
    const task = component.tasks[0];
    component.toggleTaskCompletion(task.id);
    expect(taskServiceMock.toggleTaskCompletion).toHaveBeenCalledWith(task);
  });

  it('debería eliminar una tarea', async () => {
    await component.loadTasks();
    component.deleteTask('1');
    expect(taskServiceMock.deleteTask).toHaveBeenCalledWith('1');
    expect(component.tasks.length).toBe(0);
  });
});
