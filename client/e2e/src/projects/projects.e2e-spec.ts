import { ProjectsPage } from './projects.po';
import { browser } from 'protractor';

describe('Projects Page Test', () => {
  let page: ProjectsPage;

  beforeEach(() => {
    page = new ProjectsPage();
    browser.driver.manage().window().maximize(); 
    page.navigateTo();
  });

  it('should stay in the same page', () => {
    page.getSelectMetricsButton().click();
    expect(page.getTableCaptionText()).toContain("Projects");
  })

  it('should select projects and open the project metrics page', () => {
    page.getCheckABoxButton(1).click();
    page.getCheckABoxButton(5).click();
    page.getSelectMetricsButton().click();
    expect(page.getTableCaptionText()).toContain("Project's Metrics");
  });

});
