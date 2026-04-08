import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene9 extends Scene {
    constructor() {
        super('scene_9');
    }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_8').setDisplaySize(width, height);

        // Center dialog with main text and citation
        const main = `Coronal incision is a preferable and easy type of incision. The examiner makes a cut with a scalpel from behind one ear, across the forehead, to the other ear. The cut is divided, and the scalp is pulled away from the skull and goes over the body's face.`;
        const sub = `Chadha, A. (2025, May 28). Forensic autopsy explained: key types, incisions, and procedures. Your Guide at Every Step to Become the Top Doctor. https://www.diginerve.com/blogs/forensic-autopsy-types-incisions-techniques-neet-pg/`;

        const dialogW = Math.min(1000, Math.floor(width * 0.8));
        const dialogX = width / 2;
        const dialogY = height / 2 - 40;

        const mainText = this.add.text(dialogX - dialogW / 2 + 16, dialogY, main, { font: '18px Arial', color: '#ffffff', wordWrap: { width: dialogW - 32 } });
        const mainH = mainText.height;

        const subText = this.add.text(dialogX - dialogW / 2 + 16, dialogY + mainH + 12, sub, { font: '12px Arial', color: '#cccccc', wordWrap: { width: dialogW - 32 } });
        const subH = subText.height;

        const boxH = mainH + subH + 40;
        const gfx = this.add.graphics();
        gfx.fillStyle(0x000000, 0.8);
        gfx.fillRoundedRect(dialogX - dialogW / 2, dialogY - 12, dialogW, boxH, 10);
        mainText.setDepth(1);
        subText.setDepth(1);

        // Next button centered below the dialog box
        const btnW = Math.min(200, Math.floor(dialogW * 0.4));
        const btnH = 40;
        const btnX = dialogX;
        const btnY = dialogY - 12 + boxH + 18; // gap below box

        const btnG = this.add.graphics();
        btnG.fillStyle(0x1e90ff, 1);
        btnG.fillRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, 8);
        btnG.setDepth(1);

        const btnText = this.add.text(btnX, btnY, 'Next', { font: '16px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(2);

        const btnZone = this.add.zone(btnX, btnY, btnW, btnH).setOrigin(0.5).setInteractive({ useHandCursor: true });
        btnZone.on('pointerdown', () => { this.scene.start('scene_10'); });
        btnZone.on('pointerover', () => { btnG.clear(); btnG.fillStyle(0x1573d1, 1); btnG.fillRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, 8); });
        btnZone.on('pointerout', () => { btnG.clear(); btnG.fillStyle(0x1e90ff, 1); btnG.fillRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, 8); });

        EventBus.emit('current-scene-ready', this);

        
    }
}

export default Scene9;
