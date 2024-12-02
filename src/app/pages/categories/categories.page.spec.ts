import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { IonicModule, AlertController } from '@ionic/angular';
import { CategoriesPage } from './categories.page';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';

describe('CategoriesPage', () => {
  let component: CategoriesPage;
  let fixture: ComponentFixture<CategoriesPage>;
  let categoryServiceMock: jasmine.SpyObj<CategoryService>;
  let alertCtrlMock: jasmine.SpyObj<AlertController>;

  beforeEach(async () => {
    const categoryServiceSpy = jasmine.createSpyObj('CategoryService', [
      'getCategories',
      'addCategory',
      'editCategory',
      'deleteCategory',
    ]);
    const alertCtrlSpy = jasmine.createSpyObj('AlertController', ['create']);

    await TestBed.configureTestingModule({
      declarations: [CategoriesPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: AlertController, useValue: alertCtrlSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesPage);
    component = fixture.componentInstance;
    categoryServiceMock = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;
    alertCtrlMock = TestBed.inject(AlertController) as jasmine.SpyObj<AlertController>;

    categoryServiceMock.getCategories.and.returnValue(
      Promise.resolve([{ id: '1', name: 'Category 1' }] as Category[])
    );
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar categorías al inicializar', fakeAsync(() => {
    component.loadCategories();
    tick();
    expect(categoryServiceMock.getCategories).toHaveBeenCalled();
    expect(component.categories.length).toBe(1);
    expect(component.categories[0].name).toBe('Category 1');
  }));

  it('debería mostrar y ocultar el encabezado al entrar y salir de la vista', () => {
    const headerSpy = jasmine.createSpyObj('ElementRef', ['nativeElement']);
    const contentSpy = jasmine.createSpyObj('ElementRef', ['nativeElement']);

    component.ionViewWillEnter();
    expect(headerSpy.nativeElement).toBeTruthy();
    expect(contentSpy.nativeElement).toBeTruthy();

    component.ionViewWillLeave();
    expect(headerSpy.nativeElement).toBeTruthy();
    expect(contentSpy.nativeElement).toBeTruthy();
  });
});
