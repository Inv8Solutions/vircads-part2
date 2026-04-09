import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene18 extends Scene {
    constructor() { super('scene_18'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_18').setDisplaySize(width, height);

        // Dialog card: image on top and caption below (styled like scene_12)
        const baseWidth = Math.min(width * 0.8, 640);
        const reducePx = 96;
        const cardWidth = Math.max(160, baseWidth - reducePx);
        const padding = 12;

        const cardBg = this.add.graphics();
        cardBg.fillStyle(0x000000, 0.9);
        const cardHeight = 240;
        cardBg.fillRoundedRect(-cardWidth / 2, 0, cardWidth, cardHeight, 10);

        const cardContainer = this.add.container(cardWidth / 2 + 20, 40, [cardBg]).setDepth(1000);

        const imgKey = 'skull_removal';
        const img = this.add.image(0, 0, imgKey).setOrigin(0.5, 0);
        const srcImg: any = this.textures.get(imgKey)?.getSourceImage?.();
        const srcW = (srcImg && srcImg.width) ? srcImg.width : img.width || cardWidth - padding * 2;
        const srcH = (srcImg && srcImg.height) ? srcImg.height : img.height || 160;
        const maxImgW = cardWidth - padding * 2;
        const scale = Math.min(1, maxImgW / srcW);
        img.setDisplaySize(srcW * scale, srcH * scale);
        img.x = 0;
        img.y = padding;
        cardContainer.add(img);

        const caption = this.add.text(0, img.y + img.displayHeight + 8, 'actual image after removing the skull', { font: '16px Arial', color: '#ffffff', align: 'center', wordWrap: { width: maxImgW } }).setOrigin(0.5, 0);
        cardContainer.add(caption);

        const totalH = padding + img.displayHeight + 8 + caption.height + padding;
        cardBg.clear();
        cardBg.fillStyle(0x000000, 0.9);
        cardBg.fillRoundedRect(-cardWidth / 2, 0, cardWidth, totalH, 10);

        cardContainer.setSize(cardWidth, totalH);
        cardContainer.setInteractive(new Phaser.Geom.Rectangle(-cardWidth / 2, 0, cardWidth, totalH), Phaser.Geom.Rectangle.Contains);
        cardContainer.on('pointerdown', () => { cardContainer.destroy(); cardBg.destroy(); img.destroy(); caption.destroy(); });

        // Bottom-right Next button
        const nextX = width - 96;
        const nextY = height - 72;
        const nbBg = this.add.rectangle(0, 0, 160, 48, 0x000000, 0.8).setOrigin(0.5).setDepth(1001);
        const nbTxt = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(1001);
        nbBg.setInteractive({ useHandCursor: true });
        const nbContainer = this.add.container(nextX, nextY, [nbBg, nbTxt]).setDepth(1001);
        nbBg.on('pointerdown', () => {
            nbContainer.destroy();
            this.scene.start('scene_19');
        });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene18;
