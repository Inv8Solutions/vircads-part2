import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene4 extends Scene {
    constructor() {
        super('scene_4');
    }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_3').setDisplaySize(width, height);

        const dialogW = Math.min(480, Math.floor(width * 0.6));
        const dialogH = 48;
        const dialogX = width / 2;
        const dialogY = height - dialogH - 24;

        const gfx = this.add.graphics();
        gfx.fillStyle(0x000000, 0.6);
        gfx.fillRoundedRect(dialogX - dialogW / 2, dialogY - dialogH / 2, dialogW, dialogH, 8);

        this.add.text(dialogX, dialogY, 'Click to continue', { font: '18px Arial', color: '#ffffff' }).setOrigin(0.5);
        const zone = this.add.zone(dialogX, dialogY, dialogW, dialogH).setOrigin(0.5).setInteractive({ useHandCursor: true });
        zone.on('pointerdown', () => this.scene.start('scene_5'));

        // Top-center dialog (moved from scene_3)
        const content = `The first to be examined is the brain. To access the skull covering the brain, cut across the cadaver’s scalp, from ear to ear. To do so, obtain the necessary equipment for dissection from the table.`;
        const dialogWTop = Math.min(900, Math.floor(width * 0.8));
        const dialogXTop = width / 2;
        const dialogYTop = 28;

        const textTop = this.add.text(dialogXTop - dialogWTop / 2 + 12, dialogYTop, content, { font: '16px Arial', color: '#ffffff', wordWrap: { width: dialogWTop - 24 } });
        const boxHTop = textTop.height + 20;
        const gfxTop = this.add.graphics();
        gfxTop.fillStyle(0x000000, 0.75);
        gfxTop.fillRoundedRect(dialogXTop - dialogWTop / 2, dialogYTop - 10, dialogWTop, boxHTop, 8);
        textTop.setDepth(1);

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene4;
