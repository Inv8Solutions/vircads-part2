import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene36 extends Scene {
    constructor() { super('scene_36'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_32').setDisplaySize(width, height);

        const uiDepth = 1000;

        const content = `After incising the skin, the rib cage must be cut first to gain access to the thoracic and abdominal organs because it forms the rigid bony framework that encloses and protects the thoracic cavity. Cutting the rib cage allows removal of the sternum and opening of the chest cavity, making the internal organs accessible for examination.`;

        const boxW = Math.min(820, width - 120);
        const textStyle: Phaser.Types.GameObjects.Text.TextStyle = { fontFamily: 'Arial', fontSize: '18px', color: '#ffffff', align: 'left', wordWrap: { width: boxW - 40 } };

        // create text first to measure height (use center origin later)
        const txt = this.add.text(0, 0, content, textStyle).setDepth(uiDepth + 1).setOrigin(0.5, 0);
        // measure and compute background height
        const bgHeight = txt.height + 80;

        // background card (rounded, dark translucent like other scenes)
        const bg = this.add.graphics().setDepth(uiDepth);
        bg.fillStyle(0x000000, 0.92);
        bg.fillRoundedRect(-boxW / 2, -bgHeight / 2, boxW, bgHeight, 12);

        // Container to hold card and text, centered
        const card = this.add.container(width / 2, height / 2, [bg, txt]).setDepth(uiDepth);
        txt.setPosition(0, -bgHeight / 2 + 20);

        // Bottom-right Next button styled like other scenes
        const nextX = width - 96;
        const nextY = height - 72;
        const nbBg = this.add.rectangle(0, 0, 160, 48, 0x000000, 0.85).setOrigin(0.5).setDepth(uiDepth + 2).setInteractive({ useHandCursor: true });
        const nbTxt = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(uiDepth + 3);
        const nbContainer = this.add.container(nextX, nextY, [nbBg, nbTxt]).setDepth(uiDepth + 2);
        nbBg.on('pointerdown', () => {
            nbContainer.destroy();
            this.scene.start('scene_37');
        });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene36;
