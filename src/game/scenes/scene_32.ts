import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene32 extends Scene {
    constructor() { super('scene_32'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_32').setDisplaySize(width, height);

        // Bottom-middle dialog
        const dialogW = Math.min(760, Math.round(width * 0.8));
        const padding = 12;
        const dialogText = 'The rib cage could now be examined for any signs of trauma.';
        const style: Phaser.Types.GameObjects.Text.TextStyle = { font: '18px Arial', color: '#ffffff', wordWrap: { width: dialogW - padding * 2 } };
        const txt = this.add.text(0, 0, dialogText, style).setOrigin(0.5).setDepth(1100);
        const bg = this.add.graphics().setDepth(1099);
        const bgH = padding + txt.height + padding;
        bg.fillStyle(0x000000, 0.9);
        bg.fillRoundedRect(-dialogW / 2, 0, dialogW, bgH, 10);
        const dialogY = height - bgH - 28;
        const dialogContainer = this.add.container(width / 2, dialogY, [bg, txt]).setDepth(1100);
        txt.y = padding;

        // Bottom-right Next button
        const nextX = width - 96;
        const nextY = height - 72;
        const nbBg = this.add.rectangle(0, 0, 160, 48, 0x000000, 0.85).setOrigin(0.5).setDepth(1200);
        const nbTxt = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(1201);
        nbBg.setInteractive({ useHandCursor: true });
        const nbContainer = this.add.container(nextX, nextY, [nbBg, nbTxt]).setDepth(1200);
        nbBg.on('pointerdown', () => {
            nbContainer.destroy();
            this.scene.start('scene_33');
        });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene32;
