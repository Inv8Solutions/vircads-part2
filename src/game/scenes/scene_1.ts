import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene1 extends Scene {
    constructor() {
        super('scene_1');
    }

    create() {
        const { width, height } = this.scale;

        // show scene_1 image full-screen
        this.add.image(width / 2, height / 2, 'intro_text').setDisplaySize(width, height);

        // bottom-center dialog: Click to continue -> scene_2
        const dialogW = Math.min(480, Math.floor(width * 0.6));
        const dialogH = 48;
        const dialogX = width / 2;
        const dialogY = height - dialogH - 24;

        const gfx = this.add.graphics();
        gfx.fillStyle(0x000000, 0.6);
        gfx.fillRoundedRect(dialogX - dialogW / 2, dialogY - dialogH / 2, dialogW, dialogH, 8);

        const txt = this.add.text(dialogX, dialogY, 'Click to continue', { font: '18px Arial', color: '#ffffff' }).setOrigin(0.5);
        const zone = this.add.zone(dialogX, dialogY, dialogW, dialogH).setOrigin(0.5).setInteractive({ useHandCursor: true });
        zone.on('pointerdown', () => this.scene.start('scene_2'));

        // emit ready so Vue can receive the active scene
        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene1;
