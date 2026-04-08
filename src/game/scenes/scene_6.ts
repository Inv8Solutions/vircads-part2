import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene6 extends Scene {
    constructor() {
        super('scene_6');
    }

    create() {
        const { width, height } = this.scale;

        // background for scene_6
        this.add.image(width / 2, height / 2, 'scene_6').setDisplaySize(width, height);

        // Informational dialog placed at coordinates (412, 606)
        const content = `In a dissection, a sharp blade is used to cut through the skin and tissue. Take the scalpel from the autopsy tool tray.`;
        const dialogWTop = Math.min(900, Math.floor(width * 0.8));
        const startX = 412; // left coordinate
        const startY = 606; // top coordinate

        // create text first so we can measure height for the background box
        const textTop = this.add.text(startX + 12, startY + 10, content, { font: '16px Arial', color: '#ffffff', wordWrap: { width: dialogWTop - 24 } });
        const boxHTop = textTop.height + 20;
        const gfxTop = this.add.graphics();
        gfxTop.fillStyle(0x000000, 0.75);
        gfxTop.fillRoundedRect(startX, startY, dialogWTop, boxHTop, 8);
        textTop.setDepth(1);

        // Click coordinate debug: show coords on-screen and log to console; draw temporary marker
        const debugText = this.add.text(12, height - 28, '', { font: '14px Arial', color: '#00ff00' }).setDepth(2);
        let marker: Phaser.GameObjects.Graphics | null = null;

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const x = Math.round(pointer.x);
            const y = Math.round(pointer.y);
            console.log('pointerdown', x, y);
            debugText.setText(`x: ${x}, y: ${y}`);

            if (marker) { marker.destroy(); marker = null; }
            marker = this.add.graphics();
            marker.fillStyle(0xff0000, 1);
            marker.fillCircle(x, y, 6);

            this.time.delayedCall(800, () => { if (marker) { marker.destroy(); marker = null; } });
        });

        // Hitbox between (414,345) and (507,434) — clicking it advances to next scene
        const hx1 = 414, hy1 = 345, hx2 = 507, hy2 = 434;
        const hW = hx2 - hx1;
        const hH = hy2 - hy1;
        const hX = hx1 + hW / 2;
        const hY = hy1 + hH / 2;

        const hitZone = this.add.zone(hX, hY, hW, hH).setOrigin(0.5).setInteractive({ useHandCursor: true });
        hitZone.on('pointerdown', () => {
            console.log('hitbox clicked -> scene_7');
            this.scene.start('scene_7');
        });

        // emit ready so Vue can receive the active scene
        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene6;
