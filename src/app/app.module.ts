import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Importaciones necesarias
import { IonicStorageModule } from '@ionic/storage-angular'; // Para Ionic Storage
import { HttpClientModule } from '@angular/common/http'; // Para servicios HTTP

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(), // Inicializar el módulo de almacenamiento
    HttpClientModule, // Para servicios HTTP
  ],
  providers: [], // Añade tus servicios personalizados aquí si no usan 'providedIn: root'
  bootstrap: [AppComponent],
})
export class AppModule {}