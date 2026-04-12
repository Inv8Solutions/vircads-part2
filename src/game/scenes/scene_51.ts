import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene51 extends Scene {
    constructor() { super('scene_51'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_46').setDisplaySize(width, height);
        // bottom-center dialog
        try {
            const dialogText = 'With the organs in clear view and are easily accessible, remove the spleen, intestines, liver, and pancreas. These organs will be weighed by your Autopsy Technician.';
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

        // bottom-right Next button
        try {
            const btnW = 140; const btnH = 48; const pad = 20;
            const bx = width - btnW / 2 - pad; const by = height - btnH / 2 - pad;
            const nextContainer = this.add.container(bx, by).setDepth(80);
            const bg = this.add.graphics();
            bg.fillStyle(0x222222, 0.95);
            bg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);
            bg.lineStyle(2, 0xffffff, 0.9);
            bg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);
            const label = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(81);
            nextContainer.add([bg, label]);
            bg.setInteractive(new Phaser.Geom.Rectangle(-btnW/2, -btnH/2, btnW, btnH), Phaser.Geom.Rectangle.Contains);
            bg.on('pointerdown', () => { this.scene.start('scene_52'); });
        } catch (e) { /* ignore */ }
        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene51;
