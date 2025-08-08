import Phaser from 'phaser';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload(): void {
    // load example assets
    this.load.image('icon', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABhUlEQVR4nK2TTUsCURTH/7M7M8s3zWyTBTcFClG0iAKMIsI0ogkU0UUTKYh4CEpVkUSsWkCLiCUKUiTLBdkQniIoqJhISCBCZ23PN583O6p3d55zvncN8AuQae11r9C4v3kHz2uhP0G9tVUvYt8pao25BjB+v4wWxkgE46TEy3MN8jrnqnNv7R5G+3XhtL32oJVUMdoHAkOEsbSiNVVtWuA6G8Y1kH5Nnr39r0OkC9V0bYvcAS9Sv1AGoFaTMDZaAFwlTZoWpzGRTnY6ogVd3vhC0DzJQn3beouF0v9ixGQwTSeIQHgdbrTxgZayDw33uW44n8F1h1cuZ98AzQicPb73un0L4xTgPfxFpkPkZmNwO+889AKMsUi4Rd2vPaDjR3Pz08cHWeJf+dUxI7DJjuNzEiyWJZlOizoS5Evo0msy5vX0kQecyGJyo0Trsfg3qtRqIR56n1VdOSFaOp3DR6+7Vcy7TN8TIasYEzH7tMBkfGyYDH851jR4/CkZSB0bYJ62vLr1d1+faKRErNp1FQ+WcvYx3r9DygOPFVVsnG+9Vq3YHP1LXVE7gPaGm4DTGO+RvtV8ERuAAr2G8VuXAvwBOSzuxL3jOFWAAAAAElFTkSuQmCC');
  }

  create(): void {
    this.scene.start('CityMapScene');
    this.scene.launch('UIScene');
    this.scene.bringToTop('UIScene');
  }
}
