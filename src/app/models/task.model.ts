
export interface Task {
  id: string; // UUID para identificar tareas
  title: string;
  completed: boolean;
  categoryId?: string; // ID de la categoría asociada
}
