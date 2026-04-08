import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene7 extends Scene {
    constructor() {
        super('scene_7');
    }

    create() {
        const { width, height } = this.scale;

        // scaffold: set background key 'scene_7' when asset available
        this.add.image(width / 2, height / 2, 'scene_3').setDisplaySize(width, height);

        // Click coordinate debug: show coords on-screen and log to console; draw temporary marker
        const debugText = this.add.text(12, height - 28, '', { font: '14px Arial', color: '#00ff00' }).setDepth(2);
        let marker: Phaser.GameObjects.Graphics | null = null;

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const x = Math.round(pointer.x);
            const y = Math.round(pointer.y);
            console.log('scene_7 pointerdown', x, y);
            debugText.setText(`x: ${x}, y: ${y}`);

            if (marker) { marker.destroy(); marker = null; }
            marker = this.add.graphics();
            marker.fillStyle(0xff0000, 1);
            marker.fillCircle(x, y, 6);

            this.time.delayedCall(800, () => { if (marker) { marker.destroy(); marker = null; } });
        });

        // Invisible hitbox on coordinates (406,406) - (521,491) that advances to scene_8
        const hx1 = 406, hy1 = 406, hx2 = 521, hy2 = 491;
        const hW = hx2 - hx1;
        const hH = hy2 - hy1;
        const hX = hx1 + hW / 2;
        const hY = hy1 + hH / 2;
        const hitZone = this.add.zone(hX, hY, hW, hH).setOrigin(0.5).setInteractive({ useHandCursor: true });
        hitZone.on('pointerdown', () => {
            console.log('scene_7 hitbox clicked -> scene_8');
            this.scene.start('scene_8');
        });

        // Small bottom dialog: "tap the head to proceed"
        const dlgW = Math.min(360, Math.floor(width * 0.45));
        const dlgX = width / 2;
        const dlgY = height - 72;
        const dlgG = this.add.graphics();
        dlgG.fillStyle(0x000000, 0.7);
        dlgG.fillRoundedRect(dlgX - dlgW / 2, dlgY - 22, dlgW, 44, 8);
        const dlgText = this.add.text(dlgX, dlgY, 'tap the head to proceed', { font: '16px Arial', color: '#ffffff' }).setOrigin(0.5);

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene7;
