import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene8 extends Scene {
    constructor() {
        super('scene_8');
    }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_8').setDisplaySize(width, height);

        // Top-center instructional dialog
        const content = `Before the coronal incision, part and loosen the hair along the incision line to fully expose the scalp for a clear, accurate cut.`;
        const dialogW = Math.min(900, Math.floor(width * 0.8));
        const dialogX = width / 2;
        const dialogY = 24;

        const text = this.add.text(dialogX - dialogW / 2 + 12, dialogY, content, { font: '16px Arial', color: '#ffffff', wordWrap: { width: dialogW - 24 } });
        const boxH = text.height + 20;
        const gfx = this.add.graphics();
        gfx.fillStyle(0x000000, 0.75);
        gfx.fillRoundedRect(dialogX - dialogW / 2, dialogY - 8, dialogW, boxH, 8);
        text.setDepth(1);

        // Next button centered below the dialog box
        const btnW = Math.min(200, Math.floor(dialogW * 0.4));
        const btnH = 40;
        const btnX = dialogX;
        const btnY = dialogY - 8 + boxH + 16; // 16px gap below box

        const btnG = this.add.graphics();
        btnG.fillStyle(0x1e90ff, 1);
        btnG.fillRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, 8);
        btnG.setDepth(1);

        const btnText = this.add.text(btnX, btnY, 'Next', { font: '16px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(2);

        const btnZone = this.add.zone(btnX, btnY, btnW, btnH).setOrigin(0.5).setInteractive({ useHandCursor: true });
        btnZone.on('pointerdown', () => { this.scene.start('scene_9'); });
        btnZone.on('pointerover', () => { btnG.clear(); btnG.fillStyle(0x1573d1, 1); btnG.fillRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, 8); });
        btnZone.on('pointerout', () => { btnG.clear(); btnG.fillStyle(0x1e90ff, 1); btnG.fillRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, 8); });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene8;
