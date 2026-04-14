import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene55 extends Scene {
    constructor() { super('scene_55'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_52').setDisplaySize(width, height);
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

        // Bottom-center dialog: instruction
        const dialogW = Math.min(760, Math.round(width * 0.8));
        const dialogPadding = 12;
        const dialogText = 'Using the scalpel, slice the stomach open.';
        const style: Phaser.Types.GameObjects.Text.TextStyle = { font: '18px Arial', color: '#ffffff', wordWrap: { width: dialogW - dialogPadding * 2 }, align: 'center' };
        const txt = this.add.text(0, 0, dialogText, style).setOrigin(0.5).setDepth(1200);
        const bgRect = this.add.graphics().setDepth(1199);
        const bgH = dialogPadding + txt.height + dialogPadding;
        bgRect.fillStyle(0x000000, 0.9);
        bgRect.fillRoundedRect(-dialogW / 2, 0, dialogW, bgH, 10);
        const dialogY = height - bgH - 28;
        const dialogContainer = this.add.container(width / 2, dialogY, [bgRect, txt]).setDepth(1200);
        txt.y = dialogPadding;

        // Add drawing hitbox with red border between (798,389) and (1072,600)
        const dx1 = 798, dy1 = 389, dx2 = 1072, dy2 = 600;
        const dLeft = Math.min(dx1, dx2);
        const dTop = Math.min(dy1, dy2);
        const dW = Math.abs(dx2 - dx1);
        const dH = Math.abs(dy2 - dy1);

        // red border outline
        const outline = this.add.rectangle(dLeft + dW / 2, dTop + dH / 2, dW, dH).setStrokeStyle(2, 0xff0000).setDepth(1255);

        // transparent drawing area
        const drawRect = this.add.rectangle(dLeft + dW / 2, dTop + dH / 2, dW, dH, 0x000000, 0).setOrigin(0.5).setInteractive().setDepth(1256);

        let drawing = false;
        let lastX = 0;
        let lastY = 0;
        let drawG: Phaser.GameObjects.Graphics | null = null;
        let hasDrawn = false;
        let nextBtn: Phaser.GameObjects.Container | null = null;

        const showNextButton = () => {
            if (nextBtn) return;
            const x = width - 96;
            const y = height - 72;
            const bg = this.add.rectangle(0, 0, 160, 48, 0x000000, 0.7).setOrigin(0.5).setDepth(1300);
            const txt = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(1301);
            bg.setInteractive({ useHandCursor: true });
            const container = this.add.container(x, y, [bg, txt]).setDepth(1300);
            bg.on('pointerdown', () => {
                container.destroy();
                nextBtn = null;
                this.scene.start('scene_56');
            });
            nextBtn = container;
        };

        const hideNextButton = () => {
            if (nextBtn) { nextBtn.destroy(); nextBtn = null; }
        };

        const startDrawing = (pointer: Phaser.Input.Pointer) => {
            drawing = true;
            lastX = pointer.x;
            lastY = pointer.y;
            hasDrawn = false;
            hideNextButton();
            if (drawG) { drawG.destroy(); drawG = null; }
            drawG = this.add.graphics().setDepth(1260);
            drawG.lineStyle(3, 0xff0000, 1);
        };

        drawRect.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            startDrawing(pointer);
        });

        // fallback: start drawing if user clicks inside logical bounds anywhere
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (drawing) return;
            const px = pointer.x;
            const py = pointer.y;
            if (px >= dLeft && px <= dLeft + dW && py >= dTop && py <= dTop + dH) {
                startDrawing(pointer);
            }
        });

        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (!drawing || !drawG) return;
            const x = pointer.x;
            const y = pointer.y;
            // clamp to drawing bounds
            const cx = Phaser.Math.Clamp(x, dLeft, dLeft + dW);
            const cy = Phaser.Math.Clamp(y, dTop, dTop + dH);
            drawG.lineBetween(lastX, lastY, cx, cy);
            lastX = cx;
            lastY = cy;
            hasDrawn = true;
        });

        this.input.on('pointerup', () => {
            drawing = false;
            if (hasDrawn && !nextBtn) showNextButton();
        });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene55;
