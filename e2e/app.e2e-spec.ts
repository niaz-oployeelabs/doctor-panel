import { DoctorolaDoctorPanelPage } from './app.po';

describe('doctorola-doctor-panel App', () => {
  let page: DoctorolaDoctorPanelPage;

  beforeEach(() => {
    page = new DoctorolaDoctorPanelPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
