import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene45 extends Scene {
    constructor() { super('scene_45'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_44').setDisplaySize(width, height);
        // Click debug: show coords, log, and draw a temporary marker
        const debugText = this.add.text(12, height - 28, '', { font: '14px Arial', color: '#00ff00' }).setDepth(50);
        let marker: Phaser.GameObjects.Graphics | null = null;

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const x = Math.round(pointer.x);
            const y = Math.round(pointer.y);
            console.log('scene_45 pointerdown', x, y);
            debugText.setText(`x: ${x}, y: ${y}`);

            if (marker) { marker.destroy(); marker = null; }
            marker = this.add.graphics();
            marker.fillStyle(0xff0000, 1);
            marker.fillCircle(x, y, 6);

            this.time.delayedCall(800, () => { if (marker) { marker.destroy(); marker = null; } });
        });

        // Heart hitbox: coords (776,208) to (950,394)
        const hx1 = 776, hy1 = 208, hx2 = 950, hy2 = 394;
        const left = Math.min(hx1, hx2);
        const top = Math.min(hy1, hy2);
        const w = Math.abs(hx2 - hx1);
        const h = Math.abs(hy2 - hy1);
        const cx = Math.round(left + w / 2);
        const cy = Math.round(top + h / 2);

        const border = this.add.graphics().setDepth(70);
        border.lineStyle(3, 0xff0000, 1);
        border.strokeRect(-w / 2, -h / 2, w, h);

        const rect = this.add.rectangle(0, 0, w, h, 0x000000, 0).setOrigin(0.5).setInteractive();
        const container = this.add.container(cx, cy, [border, rect]).setDepth(70);

        rect.on('pointerdown', () => {
            console.log('scene_45 heart hitbox clicked, starting scene_46');
            this.scene.start('scene_46');
        });

        // Bottom-center dialog
        const dialogW = Math.min(760, Math.round(width * 0.8));
        const padding = 14;
        const content = 'Click on the heart to remove it from the body';
        const txtStyle: Phaser.Types.GameObjects.Text.TextStyle = { font: '18px Arial', color: '#ffffff', wordWrap: { width: dialogW - padding * 2 }, align: 'center' };
        const dialogTxt = this.add.text(0, 0, content, txtStyle).setOrigin(0.5, 0).setDepth(60);
        const bgH = padding + dialogTxt.height + padding;
        const bg = this.add.graphics().setDepth(59);
        bg.fillStyle(0x000000, 0.92);
        bg.fillRoundedRect(-dialogW / 2, -bgH / 2, dialogW, bgH, 10);
        const dialogY = Math.round(height - (bgH / 2) - 24);
        const dialogContainer = this.add.container(width / 2, dialogY, [bg, dialogTxt]).setDepth(60);
        dialogTxt.y = -bgH / 2 + padding;

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene45;
