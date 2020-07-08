//Imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FormsModule } from '@angular/forms';

//Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableComponent } from './components/table/table.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ExportModalComponent } from './components/export-modal/export-modal.component';
import { AlertComponent } from './components/alert/alert.component';
import { MetricsTableComponent } from './components/metrics-table/metrics-table.component';
import { TwoOptionModalComponent } from './components/two-option-modal/two-option-modal.component';
import { CompMetricsTableComponent } from './components/comp-metrics-table/comp-metrics-table.component';
import { ProjTableEditionComponent } from './components/administrator/proj-table-edition/proj-table-edition.component';
import { UpdateProjectsTabComponent } from './components/administrator/update-projects-tab/update-projects-tab.component';

//Services
import { ProjectsService } from './services/projects/projects.service';
import { AuthService } from './services/auth/auth.service';
import { ConfirmationModalComponent } from './components/administrator/update-projects-tab/confirmation-modal/confirmation-modal.component';
import { SearchBoxComponent } from './components/search-bar/search-box.component';



@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    NavbarComponent,
    ExportModalComponent,
    AlertComponent,
    MetricsTableComponent,
    TwoOptionModalComponent,
    CompMetricsTableComponent,
    ProjTableEditionComponent,
    UpdateProjectsTabComponent,
    ConfirmationModalComponent,
    SearchBoxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SweetAlert2Module.forRoot(),
    FormsModule
  ],
  providers: [ 
    ProjectsService,
    AuthService
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
