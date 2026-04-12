import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene47 extends Scene {
    constructor() { super('scene_47'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_46').setDisplaySize(width, height);
        // Centered dialog describing blood pooling and removal
        const dialogW = Math.min(920, Math.round(width * 0.8));
        const padding = 14;
        const content = 'After the removal of the lungs and heart, a pooling of blood could be seen. This blood may come from internal bleeding or blood that simply pooled in the body as the heart stopped beating after death. It is scooped out with the use of a ladle and measured in a beaker to help determine blood loss, identify injuries or disease, and allow clearer examination of the organs.';
        const style: Phaser.Types.GameObjects.Text.TextStyle = { font: '16px Arial', color: '#ffffff', wordWrap: { width: dialogW - padding * 2 }, align: 'center' };
        const txt = this.add.text(0, 0, content, style).setDepth(100).setOrigin(0.5, 0);
        const bgH = padding + txt.height + padding;
        const bg = this.add.graphics().setDepth(99);
        bg.fillStyle(0x000000, 0.92);
        bg.fillRoundedRect(-dialogW / 2, -bgH / 2, dialogW, bgH, 10);
        const dialogContainer = this.add.container(width / 2, Math.round(height / 2), [bg, txt]).setDepth(100);
        txt.y = -bgH / 2 + padding;

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
            txt.destroy();
            this.scene.start('scene_48');
        });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene47;
