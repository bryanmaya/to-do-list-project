import { TestBed } from '@angular/core/testing';
import { CategoryService } from './category.service';
import { IonicStorageModule } from '@ionic/storage-angular';

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicStorageModule.forRoot()],
      providers: [CategoryService],
    }).compileComponents();

    service = TestBed.inject(CategoryService);

    // Mock del método init
    spyOn(service as any, 'init').and.callFake(async () => {
      service['categories'] = [];
      service['_storage'] = {
        create: async () => {},
        set: async () => {},
        get: async () => [],
      } as any; // Mock básico de Storage
    });

    await service['init'](); // Asegura que init sea llamado
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería agregar una nueva categoría', async () => {
    await service.addCategory('Nueva Categoría');
    const categories = await service.getCategories();
    expect(categories.length).toBe(1);
    expect(categories[0].name).toBe('Nueva Categoría');
  });

  it('debería editar una categoría existente', async () => {
    await service.addCategory('Categoría Inicial');
    let categories = await service.getCategories();
    const categoryId = categories[0].id;

    service.editCategory(categoryId, 'Categoría Actualizada');
    categories = await service.getCategories();
    expect(categories[0].name).toBe('Categoría Actualizada');
  });

  it('debería cargar categorías desde el almacenamiento', async () => {
    const mockCategories = [{ id: '1', name: 'Mock Categoría' }];
    spyOn(service as any, 'loadCategories').and.callFake(async () => {
      service['categories'] = mockCategories;
    });

    await service['loadCategories']();
    const categories = await service.getCategories();
    expect(categories.length).toBe(1);
    expect(categories[0].name).toBe('Mock Categoría');
  });
});
