import { Download } from './download';

describe('Download Test', () => {

  let download : Download; 

  beforeEach(() => {

    download = new Download();
    
  });

  it('should create a Download instance', () => {
    expect(download).toBeTruthy();
  });

});
