import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene3 extends Scene {
    constructor() {
        super('scene_3');
    }

    create() {
        const { width, height } = this.scale;
        // use scene_2.png as requested
        this.add.image(width / 2, height / 2, 'scene_2').setDisplaySize(width, height);

        const dialogW = Math.min(480, Math.floor(width * 0.6));
        const dialogH = 48;
        const dialogX = width / 2;
        const dialogY = height - dialogH - 24;

        const gfx = this.add.graphics();
        gfx.fillStyle(0x000000, 0.6);
        gfx.fillRoundedRect(dialogX - dialogW / 2, dialogY - dialogH / 2, dialogW, dialogH, 8);

        this.add.text(dialogX, dialogY, 'Click to continue', { font: '18px Arial', color: '#ffffff' }).setOrigin(0.5);
        const zone = this.add.zone(dialogX, dialogY, dialogW, dialogH).setOrigin(0.5).setInteractive({ useHandCursor: true });
        zone.on('pointerdown', () => this.scene.start('scene_4'));

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene3;
