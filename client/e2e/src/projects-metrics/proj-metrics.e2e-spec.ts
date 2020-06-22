import { ProjMetricsPage } from './proj-metrics.po';
import { ProjectsPage } from '../projects/projects.po';
import { browser } from 'protractor';
import * as fs from 'fs';
import * as path from 'path';

describe('Project Metrics Test', () => {
  let page: ProjMetricsPage;
  let downloadsPath: string;


  beforeEach(() => {
    page = new ProjMetricsPage();
    let pageBefore = new ProjectsPage()
    pageBefore.navigateTo();
    browser.driver.manage().window().maximize(); 
    pageBefore.getCheckABoxButton(1).click();
    pageBefore.getCheckABoxButton(5).click();
    pageBefore.getSelectMetricsButton().click();
    downloadsPath = path.resolve(__dirname, '../../downloads/projects_measures.zip');
  });


  it("should select metrics and export the project's measures in json format",() => {
    page.getCheckABoxButton(26).click();   
    page.getCheckABoxButton(306).click();
    page.getExportButton().click();
    browser.sleep(500);
    page.getTwoOptionModalButtons('No').click();
    browser.sleep(200);
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
    page.getTwoOptionModalButtons('No').click();
    browser.sleep(200);
    page.getRadioButton('json').click();
    page.getAcceptButton().click();
    expect(page.getAlertText()).toContain('Select');
  });

  it('should select projects and open the project metrics page', () => {
    page.getCheckABoxButton(26).click();   
    page.getCheckABoxButton(306).click();
    page.getExportButton().click();
    browser.sleep(500);
    page.getTwoOptionModalButtons('Yes').click();
    browser.sleep(200);
    expect(page.getTableCaptionText()).toContain("Component's Metrics");
  });

  it("should initialize the app again in Project's page", () =>  {
    browser.refresh();
    browser.sleep(100);
    expect(page.getTableCaptionText()).toContain("Projects");
  });

});