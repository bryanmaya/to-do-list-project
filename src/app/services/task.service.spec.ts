import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { IonicStorageModule } from '@ionic/storage-angular';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicStorageModule.forRoot()],
      providers: [TaskService],
    }).compileComponents();

    service = TestBed.inject(TaskService);

    // Mock del método init
    spyOn(service as any, 'init').and.callFake(async () => {
      service['tasks'] = [];
      service['_storage'] = {
        create: async () => {},
        set: async () => {},
      } as any; // Mock básico de Storage
    });

    await service['init'](); // Asegura que init sea llamado
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería agregar una nueva tarea', async () => {
    service.addTask('Nueva Tarea');
    const tasks = await service.getTasks();
    expect(tasks.length).toBe(1);
    expect(tasks[0].title).toBe('Nueva Tarea');
  });

  it('debería alternar el estado de una tarea', async () => {
    service.addTask('Tarea a Completar');
    let tasks = await service.getTasks();
    const task = tasks[0];
    expect(task.completed).toBe(false);

    task.completed = true;
    service.toggleTaskCompletion(task);
    tasks = await service.getTasks();
    expect(tasks[0].completed).toBe(true);
  });

  it('debería filtrar tareas por categoría', async () => {
    service.addTask('Tarea 1', 'categoria1');
    service.addTask('Tarea 2', 'categoria2');
    const categoria1Tareas = await service.getTasks('categoria1');
    expect(categoria1Tareas.length).toBe(1);
    expect(categoria1Tareas[0].title).toBe('Tarea 1');
  });
});
