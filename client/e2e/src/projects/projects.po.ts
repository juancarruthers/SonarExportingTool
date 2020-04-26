import { browser, by, element, ElementFinder, promise } from 'protractor';

export class ProjectsPage{

  navigateTo(): promise.Promise<any>{
    return browser.get('/');
  }

  navigateToProjMetrics(): promise.Promise<any>{
    return browser.get('/projects/metrics');
  }

  getSelectMetricsButton(): ElementFinder {
    return element(by.css('[ng-reflect-router-link="/projects/metrics"]'));
  }

  getCheckABoxButton(p_idproject: number): ElementFinder {
    const id = '[id=checkbox' + p_idproject + ']';
    return element(by.css(id));
  }

  getTableCaptionText(): promise.Promise<string> {
    return element(by.css('caption')).getText();
  }
}
