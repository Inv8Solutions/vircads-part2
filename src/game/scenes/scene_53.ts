import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene53 extends Scene {
    constructor() { super('scene_53'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_52').setDisplaySize(width, height);
        // Bottom-center dialog
        const dialogW = Math.min(760, Math.round(width * 0.8));
        const padding = 12;
        const dialogText = 'Another crucial step in an autopsy is the inspection of the cadaver’s stomach content as it may provide qualitative information concerning the nature of the last meal and the presence of abnormal constituents.';
        const style: Phaser.Types.GameObjects.Text.TextStyle = { font: '18px Arial', color: '#ffffff', wordWrap: { width: dialogW - padding * 2 }, align: 'center' };
        const txt = this.add.text(0, 0, dialogText, style).setOrigin(0.5, 0).setDepth(1200);
        const bgRect = this.add.graphics().setDepth(1199);
        const bgH = padding + txt.height + padding;
        bgRect.fillStyle(0x000000, 0.9);
        bgRect.fillRoundedRect(-dialogW / 2, 0, dialogW, bgH, 10);
        const dialogY = height - bgH - 28;
        const dialogContainer = this.add.container(width / 2, dialogY, [bgRect, txt]).setDepth(1200);
        txt.y = padding;

        // Bottom-right Next button
        const nextX = width - 96;
        const nextY = height - 72;
        const nbBg = this.add.rectangle(0, 0, 160, 48, 0x000000, 0.85).setOrigin(0.5).setDepth(1210).setInteractive({ useHandCursor: true });
        const nbTxt = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(1211);
        const nbContainer = this.add.container(nextX, nextY, [nbBg, nbTxt]).setDepth(1210);
        nbBg.on('pointerdown', () => {
            nbContainer.destroy();
            this.scene.start('scene_54');
        });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene53;
