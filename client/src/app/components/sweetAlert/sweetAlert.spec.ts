import { SweetAlert } from './sweetAlert';

describe('Download Test', () => {

  let sweet : SweetAlert; 

  beforeEach(() => {
    sweet = new SweetAlert();   
  });

  it('should create a Sweet Alert instance', () => {
    expect(sweet).toBeTruthy();
  });

});