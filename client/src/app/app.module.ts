
//Imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

//Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableComponent } from './components/table/table.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ExportModalComponent } from './components/export-modal/export-modal.component';
import { AlertComponent } from './components/alert/alert.component';
import { MetricsTableComponent } from './components/metrics-table/metrics-table.component';

//Services
import { ProjectsService } from './services/projects.service';
import { DownloadService } from './services/download.service';
import { TwoOptionModalComponent } from './components/two-option-modal/two-option-modal.component';
import { CompMetricsTableComponent } from './components/comp-metrics-table/comp-metrics-table.component';




@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    NavbarComponent,
    ExportModalComponent,
    AlertComponent,
    MetricsTableComponent,
    TwoOptionModalComponent,
    CompMetricsTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [ 
    ProjectsService,
    DownloadService
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
