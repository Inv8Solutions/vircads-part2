import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene26 extends Scene {
    constructor() { super('scene_26'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_23').setDisplaySize(width, height);

        // Top-middle dialog
        const dialogW = Math.min(760, Math.round(width * 0.8));
        const padding = 12;
        const text = 'After completing the cranial examination, the next step is to examine the thoracic and abdominal cavities. This requires opening the body through a standard autopsy incision to allow systematic internal examination of the organs.';
        const style: Phaser.Types.GameObjects.Text.TextStyle = { font: '16px Arial', color: '#ffffff', wordWrap: { width: dialogW - padding * 2 } };
        const textObj = this.add.text(0, 0, text, style).setOrigin(0.5, 0).setDepth(1000);
        const dlgHeight = padding + textObj.height + padding;
        const bg = this.add.graphics().setDepth(1000);
        bg.fillStyle(0x000000, 0.9);
        bg.fillRoundedRect(-dialogW / 2, 0, dialogW, dlgHeight, 10);
        const containerY = Math.round(height / 2 - dlgHeight / 2);
        const dlgContainer = this.add.container(width / 2, containerY, [bg, textObj]).setDepth(1000);
        textObj.x = 0;
        textObj.y = padding;

        // Bottom-right Next button
        const btnMargin = 20;
        const btnW = 110;
        const btnH = 44;
        const btnX = Math.round(width - btnMargin - btnW / 2);
        const btnY = Math.round(height - btnMargin - btnH / 2);
        const btnBg = this.add.graphics().setDepth(1100);
        btnBg.fillStyle(0x000000, 1);
        btnBg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);
        const btnText = this.add.text(0, 0, 'Next', { font: '18px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(1101);
        const btnContainer = this.add.container(btnX, btnY, [btnBg, btnText]).setDepth(1100);
        const hitZone = this.add.zone(btnX, btnY, btnW, btnH).setOrigin(0.5).setInteractive({ useHandCursor: true });
        hitZone.on('pointerdown', () => {
            this.scene.start('scene_27');
        });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene26;
