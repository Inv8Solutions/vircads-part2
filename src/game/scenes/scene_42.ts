import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene42 extends Scene {
    constructor() { super('scene_42'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_6').setDisplaySize(width, height);
        // Click debug: show coords, log, and draw a temporary marker
        const debugText = this.add.text(12, height - 28, '', { font: '14px Arial', color: '#00ff00' }).setDepth(50);
        let marker: Phaser.GameObjects.Graphics | null = null;

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const x = Math.round(pointer.x);
            const y = Math.round(pointer.y);
            console.log('scene_42 pointerdown', x, y);
            debugText.setText(`x: ${x}, y: ${y}`);

            if (marker) { marker.destroy(); marker = null; }
            marker = this.add.graphics();
            marker.fillStyle(0xff0000, 1);
            marker.fillCircle(x, y, 6);

            this.time.delayedCall(800, () => { if (marker) { marker.destroy(); marker = null; } });
        });

        // Invisible hitbox (display coordinates)
        const hitX = (420 + 506) / 2;
        const hitY = (342 + 432) / 2;
        const hitW = 506 - 420;
        const hitH = 432 - 342;
        const hitRect = this.add.rectangle(hitX, hitY, hitW, hitH, 0x000000, 0).setOrigin(0.5).setInteractive();
        hitRect.on('pointerdown', () => {
            console.log('scene_42 hitbox clicked, starting scene_43');
            this.scene.start('scene_43');
        });

        // Bottom-middle dialog
        const dialogW = Math.min(760, Math.round(width * 0.8));
        const padding = 14;
        const content = 'Take the scalpel to make precise cuts and remove the lungs.';
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

export default Scene42;
