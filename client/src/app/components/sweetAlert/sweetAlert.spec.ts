import { SweetAlert } from './sweetAlert';

describe('SweetAlert Test', () => {

  let sweet : SweetAlert; 

  beforeEach(() => {
    sweet = new SweetAlert();   
  });

  it('should create a Sweet Alert instance', () => {
    expect(sweet).toBeTruthy();
  });

});