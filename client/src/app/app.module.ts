
//Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';

//Components
import { AppComponent } from './app.component';
import { TableComponent } from './components/content/export/table/table.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ExportModalComponent } from './components/content/export/export-modal/export-modal.component';
import { AlertComponent } from './components/content/alert/alert.component';
import { MetricsTableComponent } from './components/content/export/metrics-table/metrics-table.component';
import { TwoOptionModalComponent } from './components/content/export/two-option-modal/two-option-modal.component';
import { CompMetricsTableComponent } from './components/content/export/comp-metrics-table/comp-metrics-table.component';
import { ProjTableEditionComponent } from './components/content/administrator/proj-table-edition/proj-table-edition.component';
import { UpdateProjectsTabComponent } from './components/content/administrator/update-projects-tab/update-projects-tab.component';
import { ConfirmationModalComponent } from './components/content/administrator/update-projects-tab/confirmation-modal/confirmation-modal.component';
import { SearchBoxComponent } from './components/content/search-bar/search-box.component';
import { PaginatorComponent } from './components/content/paginator/paginator.component';
import { AnalyzeProjectsComponent } from './components/content/administrator/analyze-projects/analyze-projects.component';
import { StartPageComponent } from './components/content/start-page/start-page.component';
import { FooterComponent } from './components/footer/footer.component';
import { CarouselComponent } from './components/content/start-page/carousel/carousel.component';
import { CardComponent } from './components/content/start-page/carousel/card/card.component';
import { CardCounterComponent } from './components/content/start-page/card-counter/card-counter.component';
//import { AboutPageComponent } from './components/content/about-page/about-page.component';

//Services
import { ProjectsService } from './services/projects/projects.service';
import { AuthService } from './services/auth/auth.service';


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
    SearchBoxComponent,
    PaginatorComponent,
    AnalyzeProjectsComponent,
    StartPageComponent,
    FooterComponent,
    CarouselComponent,
    CardComponent,
    CardCounterComponent/*,
    AboutPageComponent*/
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SweetAlert2Module.forRoot(),
    FormsModule,
    LazyLoadImageModule
  ],
  providers: [ 
    ProjectsService,
    AuthService
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
