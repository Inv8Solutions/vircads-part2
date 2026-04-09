import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene27 extends Scene {
    constructor() { super('scene_27'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_27').setDisplaySize(width, height);

        // Top-middle dialog
        const dialogW = Math.min(760, Math.round(width * 0.8));
        const padding = 12;
        const text = 'next step is to examine the thoracic and abdominal cavities. This requires opening the body through a standard autopsy incision to allow systematic internal examination of the organs.';
        const style: Phaser.Types.GameObjects.Text.TextStyle = { font: '16px Arial', color: '#ffffff', wordWrap: { width: dialogW - padding * 2 } };
        const textObj = this.add.text(0, 0, text, style).setOrigin(0.5, 0).setDepth(1000);
        const dlgHeight = padding + textObj.height + padding;
        const bg = this.add.graphics().setDepth(1000);
        bg.fillStyle(0x000000, 0.9);
        bg.fillRoundedRect(-dialogW / 2, 0, dialogW, dlgHeight, 10);
        const topY = 20;
        const topContainer = this.add.container(width / 2, topY, [bg, textObj]).setDepth(1000);
        textObj.x = 0;
        textObj.y = padding;

        // Bottom-middle dialog
        const bottomText = 'Click next to proceed to the tool tray.';
        const bottomStyle: Phaser.Types.GameObjects.Text.TextStyle = { font: '16px Arial', color: '#ffffff', wordWrap: { width: dialogW - padding * 2 } };
        const bottomTextObj = this.add.text(0, 0, bottomText, bottomStyle).setOrigin(0.5, 0).setDepth(1000);
        const bottomDlgHeight = padding + bottomTextObj.height + padding;
        const bottomBg = this.add.graphics().setDepth(1000);
        bottomBg.fillStyle(0x000000, 0.9);
        bottomBg.fillRoundedRect(-dialogW / 2, 0, dialogW, bottomDlgHeight, 10);
        const bottomY = Math.round(height - bottomDlgHeight - 20);
        const bottomContainer = this.add.container(width / 2, bottomY, [bottomBg, bottomTextObj]).setDepth(1000);
        bottomTextObj.x = 0;
        bottomTextObj.y = padding;

        // Bottom-right Next button (styled consistently)
        const nextX = width - 96;
        const nextY = height - 72;
        const nbBg = this.add.rectangle(0, 0, 160, 48, 0x000000, 0.85).setOrigin(0.5).setDepth(1100);
        const nbTxt = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(1101);
        nbBg.setInteractive({ useHandCursor: true });
        const nbContainer = this.add.container(nextX, nextY, [nbBg, nbTxt]).setDepth(1100);
        nbBg.on('pointerdown', () => {
            // cleanup dialogs and proceed
            try { topContainer.destroy(); } catch (e) {}
            try { bottomContainer.destroy(); } catch (e) {}
            try { nbContainer.destroy(); } catch (e) {}
            this.scene.start('scene_28');
        });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene27;
