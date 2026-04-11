import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene31 extends Scene {
    constructor() { super('scene_31'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_31').setDisplaySize(width, height);

        // UI scaffold placeholder
        const uiContainer = this.add.container(0, 0).setDepth(1000);
        const label = this.add.text(12, 12, 'scene_31 UI scaffold', { font: '16px Arial', color: '#ffffff' }).setDepth(1000);
        uiContainer.add(label);

        // Center dialog card with image and caption
        const cardW = Math.min(520, Math.round(width * 0.45));
        const cardH = Math.min(360, Math.round(height * 0.4));
        const padding = 14;

        const bg = this.add.graphics().setDepth(1100);
        bg.fillStyle(0x000000, 0.92);
        bg.fillRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 12);

        // image centered inside card (positions are relative to container)
        const img = this.add.image(0, -6, 'opened_torso').setOrigin(0.5).setDepth(1101);
        // scale image to fit within card width minus padding
        const maxImgW = cardW - padding * 2;
        const maxImgH = cardH - 100;
        const src: any = this.textures.get('opened_torso')?.getSourceImage?.();
        if (src && src.width && src.height) {
            const scale = Math.min(maxImgW / src.width, maxImgH / src.height, 1);
            img.setDisplaySize(Math.round(src.width * scale), Math.round(src.height * scale));
        } else {
            img.setDisplaySize(maxImgW, maxImgH);
        }

        const caption = this.add.text(0, cardH / 2 - 20, 'actual image', { font: '14px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(1101);

        // Place the card at top-right corner with a margin
        const margin = 16;
        const cardX = width - cardW / 2 - margin;
        const cardY = cardH / 2 + margin;
        const card = this.add.container(cardX, cardY, [bg, img, caption]).setDepth(1100);

        // Bottom-right Next button
        const nextX = width - 96;
        const nextY = height - 72;
        const nbBg = this.add.rectangle(0, 0, 160, 48, 0x000000, 0.85).setOrigin(0.5).setDepth(1200);
        const nbTxt = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(1201);
        nbBg.setInteractive({ useHandCursor: true });
        const nbContainer = this.add.container(nextX, nextY, [nbBg, nbTxt]).setDepth(1200);
        nbBg.on('pointerdown', () => {
            nbContainer.destroy();
            this.scene.start('scene_32');
        });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene31;
