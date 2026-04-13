import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene52 extends Scene {
    constructor() { super('scene_52'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_52').setDisplaySize(width, height);
        // bottom-center dialog
        try {
            const dialogText = 'After the organs were weighed, cut a portion of each and place it in a small plastic container with a cover. This is to be submitted to the laboratory for histopathological examinations.';
            const maxW = Math.min(width - 160, 900);
            const dialog = this.add.text(width / 2, height - 80, dialogText, {
                font: '18px Arial', color: '#ffffff', align: 'center', wordWrap: { width: maxW }
            }).setOrigin(0.5).setDepth(70);

            const pad = 18;
            const boxW = dialog.width + pad * 2;
            const boxH = dialog.height + pad * 2;
            const boxX = width / 2 - boxW / 2;
            const boxY = (height - 80) - boxH / 2;

            const box = this.add.graphics().setDepth(69);
            box.fillStyle(0x0b0b0b, 0.95);
            box.fillRoundedRect(boxX, boxY, boxW, boxH, 10);
            box.lineStyle(2, 0xffffff, 0.08);
            box.strokeRoundedRect(boxX, boxY, boxW, boxH, 10);
        } catch (e) { /* ignore */ }
        // Bottom-right Next button
        const nextX = width - 96;
        const nextY = height - 72;
        const nbBg = this.add.rectangle(0, 0, 160, 48, 0x000000, 0.85).setOrigin(0.5).setDepth(80).setInteractive({ useHandCursor: true });
        const nbTxt = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(81);
        const nbContainer = this.add.container(nextX, nextY, [nbBg, nbTxt]).setDepth(80);
        nbBg.on('pointerdown', () => {
            nbContainer.destroy();
            this.scene.start('scene_53');
        });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene52;
