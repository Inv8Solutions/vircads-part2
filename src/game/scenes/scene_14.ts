import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene14 extends Scene {
    constructor() {
        super('scene_14');
    }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_6').setDisplaySize(width, height);

        // Click coordinate debug: show coords on-screen and log to console; draw temporary marker
        const debugText = this.add.text(12, height - 28, '', { font: '14px Arial', color: '#00ff00' }).setDepth(2);
        let marker: Phaser.GameObjects.Graphics | null = null;

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const x = Math.round(pointer.x);
            const y = Math.round(pointer.y);
            console.log('scene_14 pointerdown', x, y);
            debugText.setText(`x: ${x}, y: ${y}`);

            if (marker) { marker.destroy(); marker = null; }
            marker = this.add.graphics();
            marker.fillStyle(0xff0000, 1);
            marker.fillCircle(x, y, 6);

            this.time.delayedCall(800, () => { if (marker) { marker.destroy(); marker = null; debugText.setText(''); } });
        });

        // Invisible hitbox defined by top-left (169,217) and bottom-right (411,303)
        const hx1 = 169, hy1 = 217, hx2 = 411, hy2 = 303;
        const w = Math.max(1, hx2 - hx1);
        const h = Math.max(1, hy2 - hy1);
        const hitRect = this.add.rectangle(hx1, hy1, w, h, 0x000000, 0).setOrigin(0, 0).setInteractive({ useHandCursor: true });
        hitRect.on('pointerdown', () => {
            console.log('scene_14 hitbox clicked', hx1, hy1, hx2, hy2);
            this.scene.start('scene_15');
        });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene14;
