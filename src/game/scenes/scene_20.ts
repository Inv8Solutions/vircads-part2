import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene20 extends Scene {
    constructor() { super('scene_20'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_18').setDisplaySize(width, height);

        // Top-middle dialog box
        const dialogW = Math.min(760, Math.round(width * 0.8));
        const padding = 12;
        const text = 'Part of the examination is to measure the organs of the body. To remove the brain, a structure called the optic chiasm should be cut.';
        const style: Phaser.Types.GameObjects.Text.TextStyle = { font: '18px Arial', color: '#ffffff', wordWrap: { width: dialogW - padding * 2 } };
        const textObj = this.add.text(0, 0, text, style).setOrigin(0.5, 0);
        const dlgHeight = padding + textObj.height + padding;
        const bg = this.add.graphics().setDepth(1000);
        bg.fillStyle(0x000000, 0.9);
        bg.fillRoundedRect(-dialogW / 2, 0, dialogW, dlgHeight, 10);
        const containerY = 20;
        const dlgContainer = this.add.container(width / 2, containerY, [bg, textObj]).setDepth(1000);
        textObj.x = 0;
        textObj.y = padding;

        // Lower-right Next button
        const nextX = width - 96;
        const nextY = height - 72;
        const nbBg = this.add.rectangle(0, 0, 160, 48, 0x000000, 0.85).setOrigin(0.5).setDepth(1001);
        const nbTxt = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(1001);
        nbBg.setInteractive({ useHandCursor: true });
        const nbContainer = this.add.container(nextX, nextY, [nbBg, nbTxt]).setDepth(1001);
        nbBg.on('pointerdown', () => {
            this.scene.start('scene_21');
        });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene20;
