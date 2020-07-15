import { RandomProjectPage } from './app.po';

describe('random-project App', function() {
  let page: RandomProjectPage;

  beforeEach(() => {
    page = new RandomProjectPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
