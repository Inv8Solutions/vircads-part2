import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene67 extends Scene {
    constructor() { super('scene_67'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_67').setDisplaySize(width, height);

        const debugText = this.add.text(12, 48, '', { font: '14px Arial', color: '#00ff00' }).setDepth(1200);
        let marker: Phaser.GameObjects.Arc | null = null;
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const x = (pointer as any).worldX ?? pointer.x;
            const y = (pointer as any).worldY ?? pointer.y;
            debugText.setText(`x: ${Math.round(x)}, y: ${Math.round(y)}`);
            if (marker) { try { marker.destroy(); } catch (e) {} marker = null; }
            marker = this.add.circle(x, y, 8, 0xff0000, 1).setDepth(1201);
            this.tweens.add({ targets: marker, alpha: 0, duration: 800, onComplete: () => { try { marker?.destroy(); marker = null; } catch (e) {} } });
        });

        const dialogW = Math.min(760, Math.round(width * 0.8));
        const dialogPadding = 12;
        const dialogText = 'Scene 67';
        const style: Phaser.Types.GameObjects.Text.TextStyle = { font: '18px Arial', color: '#ffffff', wordWrap: { width: dialogW - dialogPadding * 2 }, align: 'center' };
        const txt = this.add.text(0, 0, dialogText, style).setOrigin(0.5).setDepth(1200);
        const bgRect = this.add.graphics().setDepth(1199);
        const bgH = dialogPadding + txt.height + dialogPadding;
        bgRect.fillStyle(0x000000, 0.9);
        bgRect.fillRoundedRect(-dialogW / 2, 0, dialogW, bgH, 10);
        const dialogY = height - bgH - 28;
        const dialogContainer = this.add.container(width / 2, dialogY, [bgRect, txt]).setDepth(1200);
        txt.y = dialogPadding;

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene67;
