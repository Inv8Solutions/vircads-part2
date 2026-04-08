import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene5 extends Scene {
    constructor() {
        super('scene_5');
    }

    create() {
        const { width, height } = this.scale;
        // per mapping: use scene_4.png as the background for scene_5
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
        zone.on('pointerdown', () => this.scene.start('scene_6'));

        // Top-center informational dialog
        const content = `Do not forget: documentation is always important. In this case, your Autopsy Technician will take the photographs as you examine the body. Additionally, your Autopsy Technician will be incharge on weighing the organs and  record you findings.`;
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

export default Scene5;
