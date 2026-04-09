import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene13 extends Scene {
    constructor() {
        super('scene_13');
    }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_12').setDisplaySize(width, height);

        // TODO: add scene-specific UI/logic here

        // Top-centered dialog with instructions
        const dialogText = 'As the skull is made of dense, hard bone, the scalpel is not able to cut through it. A bone saw is used instead. Take the bone saw from the tool table.';
        const boxWidth = Math.min(width * 0.9, 720);
        const textStyle: Phaser.Types.GameObjects.Text.TextStyle = { font: '18px Arial', color: '#ffffff', align: 'center', wordWrap: { width: boxWidth - 24 } };
        const infoText = this.add.text(0, 0, dialogText, textStyle).setOrigin(0.5, 0);
        const boxHeight = infoText.height + 16;
        const bg = this.add.graphics();
        bg.fillStyle(0x000000, 0.85);
        bg.fillRoundedRect(-boxWidth / 2, 0, boxWidth, boxHeight, 8);
        const dialogContainer = this.add.container(width / 2, 12, [bg, infoText]).setDepth(1000);
        infoText.y = 8;
        dialogContainer.setSize(boxWidth, boxHeight);
        dialogContainer.setInteractive(new Phaser.Geom.Rectangle(-boxWidth / 2, 0, boxWidth, boxHeight), Phaser.Geom.Rectangle.Contains);
        dialogContainer.on('pointerdown', () => { dialogContainer.destroy(); bg.destroy(); infoText.destroy(); });

        // Next button attached to bottom of dialog
        const btnY = boxHeight + 18;
        const btnBg = this.add.rectangle(0, btnY, 120, 40, 0x000000, 0.85).setOrigin(0.5).setDepth(1001);
        const btnTxt = this.add.text(0, btnY, 'Next', { font: '16px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(1001);
        btnBg.setInteractive({ useHandCursor: true });
        btnBg.on('pointerdown', () => {
            // remove dialog and proceed
            if (dialogContainer) dialogContainer.destroy();
            this.scene.start('scene_14');
        });
        dialogContainer.add([btnBg, btnTxt]);

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene13;
