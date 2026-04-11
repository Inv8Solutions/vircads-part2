import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene34 extends Scene {
    constructor() { super('scene_34'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_32').setDisplaySize(width, height);

       

        // Click debug: show pointer coordinates and a temporary marker
        const debugText = this.add.text(12, 48, '', { font: '14px Arial', color: '#00ff00' }).setDepth(1200);
        let marker: Phaser.GameObjects.Arc | null = null;
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            debugText.setText(`x: ${Math.round(pointer.x)}, y: ${Math.round(pointer.y)}`);
            if (marker) { try { marker.destroy(); } catch (e) {} marker = null; }
            marker = this.add.circle(pointer.x, pointer.y, 8, 0xff0000, 1).setDepth(1201);
            this.tweens.add({ targets: marker, alpha: 0, duration: 800, onComplete: () => { try { marker?.destroy(); marker = null; } catch (e) {} } });
        });

        // Draw a bordered rectangle at the requested coordinates
        const rx1 = 877, ry1 = 266, rx2 = 963, ry2 = 378;
        const rW = Math.max(1, rx2 - rx1);
        const rH = Math.max(1, ry2 - ry1);
        const border = this.add.graphics().setDepth(1195);
        border.lineStyle(3, 0xff0000, 1);
        border.strokeRect(rx1, ry1, rW, rH);

        // Bottom-center dialog with provided content
        const dialogW = Math.min(760, Math.round(width * 0.8));
        const padding = 12;
        const dialogText = 'Examination reveals a fractures on the left 5th coastal cartilage of the body.';
        const style: Phaser.Types.GameObjects.Text.TextStyle = { font: '18px Arial', color: '#ffffff', wordWrap: { width: dialogW - padding * 2 } };
        const txt = this.add.text(0, 0, dialogText, style).setOrigin(0.5).setDepth(1200);
        const bgRect = this.add.graphics().setDepth(1199);
        const bgH = padding + txt.height + padding;
        bgRect.fillStyle(0x000000, 0.9);
        bgRect.fillRoundedRect(-dialogW / 2, 0, dialogW, bgH, 10);
        const dialogY = height - bgH - 28;
        const dialogContainer = this.add.container(width / 2, dialogY, [bgRect, txt]).setDepth(1200);
        txt.y = padding;

        // Bottom-right Next button
        const nextX = width - 96;
        const nextY = height - 72;
        const nbBg = this.add.rectangle(0, 0, 160, 48, 0x000000, 0.85).setOrigin(0.5).setDepth(1210);
        const nbTxt = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(1211);
        nbBg.setInteractive({ useHandCursor: true });
        const nbContainer = this.add.container(nextX, nextY, [nbBg, nbTxt]).setDepth(1210);
        nbBg.on('pointerdown', () => {
            nbContainer.destroy();
            this.scene.start('scene_35');
        });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene34;
