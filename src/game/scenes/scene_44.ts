    import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene44 extends Scene {
    constructor() { super('scene_44'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_44').setDisplaySize(width, height);
        // Bottom-middle dialog
        const dialogW = Math.min(820, Math.round(width * 0.82));
        const padding = 14;
        const content = 'With the lungs removed, you now have a clearer path to the heart. Ensure that all vessels connecting the heart to the rest of the body is cut before taking it out.';
        const txtStyle: Phaser.Types.GameObjects.Text.TextStyle = { font: '16px Arial', color: '#ffffff', wordWrap: { width: dialogW - padding * 2 }, align: 'center' };
        const dialogTxt = this.add.text(0, 0, content, txtStyle).setOrigin(0.5, 0).setDepth(100);
        const bgH = padding + dialogTxt.height + padding;
        const bg = this.add.graphics().setDepth(99);
        bg.fillStyle(0x000000, 0.92);
        bg.fillRoundedRect(-dialogW / 2, -bgH / 2, dialogW, bgH, 10);
        const dialogY = Math.round(height - (bgH / 2) - 24);
        const dialogContainer = this.add.container(width / 2, dialogY, [bg, dialogTxt]).setDepth(100);
        dialogTxt.y = -bgH / 2 + padding;

        // Lower-right Next button
        const nextX = width - 96;
        const nextY = height - 72;
        const nbBg = this.add.rectangle(0, 0, 160, 48, 0x000000, 0.85).setOrigin(0.5).setDepth(101);
        const nbTxt = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(102);
        nbBg.setInteractive({ useHandCursor: true });
        const nbContainer = this.add.container(nextX, nextY, [nbBg, nbTxt]).setDepth(101);
        nbBg.on('pointerdown', () => {
            nbContainer.destroy();
            dialogContainer.destroy();
            bg.destroy();
            dialogTxt.destroy();
            this.scene.start('scene_45');
        });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene44;
