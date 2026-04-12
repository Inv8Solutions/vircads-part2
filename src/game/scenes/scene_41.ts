import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene41 extends Scene {
    constructor() { super('scene_41'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_40').setDisplaySize(width, height);
        // Center dialog card
        const content = 'The lungs are the first to be removed. This is done by cutting major blood vessels and airways that connect the lungs to the rest of the body.';
        const cardW = Math.min(760, Math.round(width * 0.8));
        const padding = 16;
        const style: Phaser.Types.GameObjects.Text.TextStyle = { font: '18px Arial', color: '#ffffff', wordWrap: { width: cardW - padding * 2 }, align: 'center' };
        const txt = this.add.text(0, 0, content, style).setDepth(1200).setOrigin(0.5, 0);
        const bgH = padding + txt.height + padding;
        const bg = this.add.graphics().setDepth(1199);
        bg.fillStyle(0x000000, 0.92);
        bg.fillRoundedRect(-cardW / 2, -bgH / 2, cardW, bgH, 12);
        const card = this.add.container(width / 2, height / 2, [bg, txt]).setDepth(1200);
        txt.y = -bgH / 2 + padding;

        // Lower-right Next button
        const nextX = width - 96;
        const nextY = height - 72;
        const nbBg = this.add.rectangle(0, 0, 160, 48, 0x000000, 0.85).setOrigin(0.5).setDepth(1201);
        const nbTxt = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(1202);
        nbBg.setInteractive({ useHandCursor: true });
        const nbContainer = this.add.container(nextX, nextY, [nbBg, nbTxt]).setDepth(1201);
        nbBg.on('pointerdown', () => {
            nbContainer.destroy();
            card.destroy();
            bg.destroy();
            txt.destroy();
            this.scene.start('scene_42');
        });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene41;
