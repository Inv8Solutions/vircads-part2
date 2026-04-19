import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene39 extends Scene {
    constructor() { super('scene_39'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_32').setDisplaySize(width, height);

        // Click debug: show pointer coordinates and a temporary marker
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

        // (removed center image card)

        // Invisible hitbox spanning coordinates (679,42) to (991,464)
        const x1 = 679, y1 = 42, x2 = 991, y2 = 464;
        const left = Math.min(x1, x2);
        const top = Math.min(y1, y2);
        const w = Math.abs(x2 - x1);
        const h = Math.abs(y2 - y1);
        const hit = this.add.rectangle(left + w / 2, top + h / 2, w, h, 0x000000, 0).setInteractive({ useHandCursor: true }).setDepth(1251);
        hit.on('pointerup', () => {
            console.log('scene_39 invisible hitbox clicked');
            const mark = this.add.circle(hit.x, hit.y, 8, 0x00ff00).setDepth(1300);
            this.tweens.add({ targets: mark, alpha: 0, duration: 800, onComplete: () => { try { mark.destroy(); } catch (e) {} } });
            this.scene.start('scene_40');
        });

        // Bottom-center dialog with provided content
        const dialogW = Math.min(760, Math.round(width * 0.8));
        const dialogPadding = 12;
        const dialogText = 'Carefully lift and remove the rib cage to expose the chest cavity';
        const style: Phaser.Types.GameObjects.Text.TextStyle = { font: '18px Arial', color: '#ffffff', wordWrap: { width: dialogW - dialogPadding * 2 } };
        const txt2 = this.add.text(0, 0, dialogText, style).setOrigin(0.5).setDepth(1200);
        const bgRect2 = this.add.graphics().setDepth(1199);
        const bgH2 = dialogPadding + txt2.height + dialogPadding;
        bgRect2.fillStyle(0x000000, 0.9);
        bgRect2.fillRoundedRect(-dialogW / 2, 0, dialogW, bgH2, 10);
        const dialogY = height - bgH2 - 28;
        const dialogContainer = this.add.container(width / 2, dialogY, [bgRect2, txt2]).setDepth(1200);
        txt2.y = dialogPadding;

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene39;
