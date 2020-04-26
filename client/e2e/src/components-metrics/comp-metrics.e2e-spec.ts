import { CompMetricsPage } from './comp-metrics.po';
import { ProjectsPage } from '../projects/projects.po';
import { ProjMetricsPage } from '../projects-metrics/proj-metrics.po';
import { browser } from 'protractor';
import * as fs from 'fs';
import * as path from 'path';

describe('Component Metrics Test', () => {
  let page: CompMetricsPage;
  let downloadsPath: string;


  beforeEach(() => {
    page = new CompMetricsPage();
    let projPage = new ProjectsPage();
    let projMetPage = new ProjMetricsPage();
    projPage.navigateTo();
    browser.driver.manage().window().maximize(); 
    page.getCheckAll().click();
    projPage.getSelectMetricsButton().click();
    projMetPage.getCheckABoxButton(26).click();
    page.getExportButton().click();
    browser.sleep(400);
    page.getTwoOptionModalButtons('Yes').click();
    downloadsPath = path.resolve(__dirname, '../../downloads/projects_measures.zip');
  });


  it("should select metrics and export the component's measures in json format",async() => {   
    browser.sleep(100);
    page.getCheckABoxButton(27).click();
    page.getExportButton().click();
    browser.sleep(500);
    page.getRadioButton('json').click();
    page.getAcceptButton().click();
    let result = browser.wait<boolean>(() => fs.existsSync(downloadsPath))
    .then(()=>{      
      fs.unlinkSync(downloadsPath); 
      return true;       
    });
    expect(result).toBe(true);   
    
  });

  it("should show an alert because no metrics where selected to export",() =>{
    page.getExportButton().click();
    browser.sleep(500);
    page.getRadioButton('json').click();
    page.getAcceptButton().click();
    browser.sleep(100);
    expect(page.getAlertText()).toContain('Select');
  });

  it('should select projects and open the project metrics page', () => {
    browser.sleep(100);
    page.getCheckAll().click();
    page.getExportButton().click();
    browser.sleep(500);
    page.getRadioButton('json').click();
    page.getAcceptButton().click();
    browser.sleep(500);
    expect(page.getAlertText()).toContain('at once');   
  });

  it("should initialize the app again in Project's page", () =>  {
    browser.refresh();
    browser.sleep(100);
    expect(page.getTableCaptionText()).toContain("Sonar Cloud");
  });

});