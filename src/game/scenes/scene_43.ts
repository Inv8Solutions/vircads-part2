import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene43 extends Scene {
    constructor() { super('scene_43'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_40').setDisplaySize(width, height);
        // Click debug: show coords, log, and draw a temporary marker
        const debugText = this.add.text(12, height - 28, '', { font: '14px Arial', color: '#00ff00' }).setDepth(50);
        let marker: Phaser.GameObjects.Graphics | null = null;

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const x = Math.round(pointer.x);
            const y = Math.round(pointer.y);
            console.log('scene_43 pointerdown', x, y);
            debugText.setText(`x: ${x}, y: ${y}`);

            if (marker) { marker.destroy(); marker = null; }
            marker = this.add.graphics();
            marker.fillStyle(0xff0000, 1);
            marker.fillCircle(x, y, 6);

            this.time.delayedCall(800, () => { if (marker) { marker.destroy(); marker = null; } });
        });

        // Create two lung hitboxes with red border
        const makeHitbox = (x1: number, y1: number, x2: number, y2: number) => {
            const left = Math.min(x1, x2);
            const top = Math.min(y1, y2);
            const w = Math.abs(x2 - x1);
            const h = Math.abs(y2 - y1);
            const cx = Math.round(left + w / 2);
            const cy = Math.round(top + h / 2);

            // Border graphics (red)
            const border = this.add.graphics().setDepth(70);
            border.lineStyle(3, 0xff0000, 1);
            border.strokeRect(-w / 2, -h / 2, w, h);

            // Invisible interactive rect placed in a container so border and rect move together
            const rect = this.add.rectangle(0, 0, w, h, 0x000000, 0).setOrigin(0.5).setInteractive();
            const container = this.add.container(cx, cy, [border, rect]).setDepth(70);

            let removed = false;
            let xMark: Phaser.GameObjects.Text | null = null;

            rect.on('pointerdown', () => {
                if (removed) return;
                removed = true;
                // show X mark centered
                xMark = this.add.text(cx, cy, 'X', { font: '48px Arial', color: '#ff4444' }).setOrigin(0.5).setDepth(71);
                // hide border
                border.clear();
                checkBothRemoved();
            });

            return { container, border, rect, isRemoved: () => removed };
        };

        const lung1 = makeHitbox(796, 83, 679, 495);
        const lung2 = makeHitbox(881, 89, 1000, 475);

        // Next button - shown when both lungs removed
        let nextBtn: Phaser.GameObjects.Container | null = null;
        const showNext = () => {
            if (nextBtn) return;
            const nextX = width - 96;
            const nextY = height - 72;
            const nbBg = this.add.rectangle(0, 0, 160, 48, 0x000000, 0.85).setOrigin(0.5).setDepth(80);
            const nbTxt = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(81);
            nbBg.setInteractive({ useHandCursor: true });
            const nbContainer = this.add.container(nextX, nextY, [nbBg, nbTxt]).setDepth(80);
            nbBg.on('pointerdown', () => {
                nbContainer.destroy();
                nextBtn = null;
                this.scene.start('scene_44');
            });
            nextBtn = nbContainer;
        };

        const checkBothRemoved = () => {
            if (lung1.isRemoved() && lung2.isRemoved()) {
                showNext();
            }
        };

        // Bottom-center dialog telling the user to click lungs
        const dialogW = Math.min(760, Math.round(width * 0.8));
        const padding = 12;
        const content = 'click on the lungs to remove it';
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

export default Scene43;
