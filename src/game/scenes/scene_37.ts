import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene37 extends Scene {
    constructor() { super('scene_37'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_6').setDisplaySize(width, height);
        // click-debug: place a temporary marker and coordinate label where the player clicks
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const x = (pointer as any).worldX ?? pointer.x;
            const y = (pointer as any).worldY ?? pointer.y;
            console.log('scene_37 click at', x, y);

            const mark = this.add.circle(x, y, 8, 0xff4444).setDepth(2000);
            const coord = this.add.text(x + 12, y - 8, `(${Math.round(x)}, ${Math.round(y)})`, { font: '14px Arial', color: '#ffffff', backgroundColor: '#000000' }).setDepth(2000);

            this.time.delayedCall(2500, () => {
                mark.destroy();
                coord.destroy();
            });
        });

        // Hitbox defined by coordinates (296,334) and (387,439) - make a square using the larger dimension
        const x1 = 296, y1 = 334, x2 = 387, y2 = 439;
        const left = Math.min(x1, x2);
        const top = Math.min(y1, y2);
        const dx = Math.abs(x2 - x1);
        const dy = Math.abs(y2 - y1);
        const size = Math.max(dx, dy);
        const centerX = left + size / 2;
        const centerY = top + size / 2;

        // invisible interactive area on top
        const hit = this.add.rectangle(centerX, centerY, size, size, 0x000000, 0).setInteractive({ useHandCursor: true }).setDepth(1901);
        hit.on('pointerup', () => {
            this.scene.start('scene_38');
        });

        // Bottom-center dialog (styled like other scenes)
        const dialogW = Math.min(760, Math.round(width * 0.8));
        const padding = 12;
        const dialogText = 'Take the rib cutter from the Autopsy tool tray.';
        const style: Phaser.Types.GameObjects.Text.TextStyle = { font: '18px Arial', color: '#ffffff', wordWrap: { width: dialogW - padding * 2 } };
        const txt = this.add.text(0, 0, dialogText, style).setOrigin(0.5).setDepth(1950);
        const bgRect = this.add.graphics().setDepth(1949);
        const bgH = padding + txt.height + padding;
        bgRect.fillStyle(0x000000, 0.9);
        bgRect.fillRoundedRect(-dialogW / 2, 0, dialogW, bgH, 10);
        const dialogY = height - bgH - 28;
        const dialogContainer = this.add.container(width / 2, dialogY, [bgRect, txt]).setDepth(1950);
        txt.y = padding;

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene37;
