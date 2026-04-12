import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene50 extends Scene {
    constructor() { super('scene_50'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_46').setDisplaySize(width, height);
        // add beaker image in the middle
        try {
            if (this.textures.exists('beaker_blood')) {
                // show the beaker at its natural/full size, centered
                this.add.image(width / 2, height / 2, 'beaker_blood').setOrigin(0.5).setDepth(60);
            } else {
                const g = this.add.graphics();
                g.fillStyle(0x770000, 1);
                g.fillCircle(width / 2, height / 2, 64);
                g.setDepth(60);
            }
        } catch (e) { /* ignore */ }

        // bottom dialog with lab_tech avatar speaking
        try {
            const text = 'Doctor, a total of 2 liters of blood was collected from the body.';
            const avatarSize = 72;
            const maxTextW = Math.min(900, width - avatarSize - 160);
            const dialogText = this.add.text(0, 0, text, { font: '18px Arial', color: '#ffffff', wordWrap: { width: maxTextW } }).setDepth(72);

            const boxPad = 14;
            const boxW = dialogText.width + avatarSize + boxPad * 3;
            const boxH = Math.max(dialogText.height + boxPad * 2, avatarSize + boxPad);
            const bx = Math.round((width - boxW) / 2);
            const by = height - boxH - 36;

            const box = this.add.graphics().setDepth(71);
            box.fillStyle(0x0b0b0b, 0.95);
            box.fillRoundedRect(bx, by, boxW, boxH, 12);
            box.lineStyle(2, 0xffffff, 0.06);
            box.strokeRoundedRect(bx, by, boxW, boxH, 12);

            // avatar left inside box
            if (this.textures.exists('lab_tech')) {
                const ax = bx + boxPad + avatarSize / 2;
                const ay = by + boxH / 2;
                const avatar = this.add.image(ax, ay, 'lab_tech').setDisplaySize(avatarSize, avatarSize).setDepth(73).setOrigin(0.5);
            } else {
                const avx = bx + boxPad + avatarSize / 2;
                const avy = by + boxH / 2;
                const g2 = this.add.graphics();
                g2.fillStyle(0x666666, 1);
                g2.fillCircle(avx, avy, avatarSize / 2);
                g2.setDepth(73);
            }

            // position text to the right of avatar
            dialogText.setPosition(bx + boxPad + avatarSize + boxPad, by + boxPad + 4);
        } catch (e) { /* ignore dialog errors */ }
        // bottom-right Next button
        try {
            const btnW = 140; const btnH = 48; const pad = 20;
            const bx = width - btnW / 2 - pad; const by = height - btnH / 2 - pad;
            const nextContainer = this.add.container(bx, by).setDepth(90);
            const bg = this.add.graphics();
            bg.fillStyle(0x222222, 0.95);
            bg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);
            bg.lineStyle(2, 0xffffff, 0.9);
            bg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);
            const label = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(91);
            nextContainer.add([bg, label]);
            bg.setInteractive(new Phaser.Geom.Rectangle(-btnW/2, -btnH/2, btnW, btnH), Phaser.Geom.Rectangle.Contains);
            bg.on('pointerdown', () => { this.scene.start('scene_51'); });
        } catch (e) { /* ignore next button errors */ }

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene50;
