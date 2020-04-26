import { browser, by, element, ElementFinder, promise } from 'protractor';

export class CompMetricsPage{

  getCheckABoxButton(p_idmetric: number): ElementFinder {
    const id = '[id=checkbox' + p_idmetric + ']';
    return element(by.css(id));
  }

  getTableCaptionText(): promise.Promise<string>{
    return element(by.css('caption')).getText();
  }

  getExportButton(): ElementFinder {
    return element(by.css('[id="exportButton"]'));
  }

  getTwoOptionModalButtons(p_option: string): ElementFinder{
    const id = '[id=twoOptMod' + p_option + 'Butt]';
    return element(by.css(id));
  }

  getRadioButton(p_dataFormat: string): ElementFinder {
    const id = '[for=gridRadios' + p_dataFormat + ']';
    return element(by.css(id));
  }

  getAcceptButton(): ElementFinder{
    return element(by.css('[id=acceptExpModalButton]'));

  }

  getAlertText(): promise.Promise<string>{
    return element(by.css('[id="closeAlert"]')).getText();
  }

  getCheckAll(): ElementFinder{
    return element(by.css('[id="checkAll"]'));
  }

}