import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddTaskModalComponent } from './components/add-task-modal/add-task-modal.component';
import { FirebaseX } from '@awesome-cordova-plugins/firebase-x/ngx';

// Importaciones necesarias
import { IonicStorageModule } from '@ionic/storage-angular'; // Para Ionic Storage
import { HttpClientModule } from '@angular/common/http';
import { TabsComponent } from './components/tabs/tabs.component'; // Para servicios HTTP

@NgModule({
  declarations: [AppComponent,AddTaskModalComponent, TabsComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(), // Inicializar el módulo de almacenamiento
    HttpClientModule,
    FormsModule,
  ],
  providers: [FirebaseX], // Añade tus servicios personalizados aquí si no usan 'providedIn: root'
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}