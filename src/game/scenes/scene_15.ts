import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene15 extends Scene {
    constructor() {
        super('scene_15');
    }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_15').setDisplaySize(width, height);

        // Click coordinate debug: show coords on-screen and log to console; draw temporary marker
        const debugText = this.add.text(12, height - 28, '', { font: '14px Arial', color: '#00ff00' }).setDepth(2);
        let marker: Phaser.GameObjects.Graphics | null = null;

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const x = Math.round(pointer.x);
            const y = Math.round(pointer.y);
            console.log('scene_15 pointerdown', x, y);
            debugText.setText(`x: ${x}, y: ${y}`);

            if (marker) { marker.destroy(); marker = null; }
            marker = this.add.graphics();
            marker.fillStyle(0xff0000, 1);
            marker.fillCircle(x, y, 6);

            this.time.delayedCall(800, () => { if (marker) { marker.destroy(); marker = null; debugText.setText(''); } });
        });

        // Rectangular hitbox using provided coordinates (1072,647) and (590,660)
        // Make vertical size approximately 80px and keep width between the two x coords
        const hxA = { x: 1072, y: 647 };
        const hxB = { x: 590, y: 660 };
        const left = Math.min(hxA.x, hxB.x);
        const right = Math.max(hxA.x, hxB.x);
        const widthRect = Math.max(1, right - left);
        const desiredH = 80;
        const midY = (hxA.y + hxB.y) / 2;
        const top = Math.max(0, Math.round(midY - desiredH / 2));

        const hitRect = this.add.rectangle(left, top, widthRect, desiredH, 0x000000, 0).setOrigin(0, 0).setInteractive({ useHandCursor: true });

        // Drawing mechanics
        let drawing = false;
        let lastX = 0;
        let lastY = 0;
        let drawG: Phaser.GameObjects.Graphics | null = null;
        let finalized = false;
        let incomplete = false;
        let reachedEdge = false;
        let attempts = 0;
        let nextBtn: Phaser.GameObjects.Container | null = null;
        let hasDrawn = false;

        const showNextButton = () => {
            if (nextBtn) return;
            const x = width - 96;
            const y = height - 72;
            const bg = this.add.rectangle(0, 0, 160, 48, 0x000000, 0.7).setOrigin(0.5);
            const txt = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5);
            bg.setInteractive({ useHandCursor: true });
            const container = this.add.container(x, y, [bg, txt]).setDepth(1000);
            bg.on('pointerdown', () => {
                container.destroy();
                nextBtn = null;
                this.scene.start('scene_16');
            });
            nextBtn = container;
        };

        const hideNextButton = () => {
            if (nextBtn) { nextBtn.destroy(); nextBtn = null; }
        };

        // Start drawing when pointerdown on the hitRect
        hitRect.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            // Reset prior drawing if it was finalized or incomplete
            if (drawG && (incomplete || finalized)) {
                drawG.destroy();
                drawG = null;
                incomplete = false;
                finalized = false;
                hideNextButton();
                attempts = 0;
            }

            attempts++;

            drawing = true;
            reachedEdge = false;
            lastX = pointer.x;
            lastY = pointer.y;
            if (drawG) { drawG.destroy(); drawG = null; }
            drawG = this.add.graphics();
            drawG.lineStyle(3, 0xff0000, 1);
            hasDrawn = false;

            // If clicked directly at the right edge, finalize immediately
            const hx2 = left + widthRect;
            if (pointer.x >= hx2 - 2) {
                reachedEdge = true;
                finalized = true;
                drawing = false;
                console.log('scene_15 drawing finalized immediately on pointerdown');
                if (drawG) {
                    drawG.fillStyle(0x00ff00, 0.6);
                    drawG.fillCircle(hx2 - 4, pointer.y, 6);
                }
                if (attempts === 1) showNextButton();
            }
        });

        // Fallback: start drawing if pointerdown occurs inside logical bounds anywhere
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (drawing) return;
            const px = pointer.x;
            const py = pointer.y;
            const topBound = top;
            const bottomBound = top + desiredH;
            if (px >= left && px <= left + widthRect && py >= topBound && py <= bottomBound) {
                if (drawG && (incomplete || finalized)) {
                    drawG.destroy(); drawG = null; incomplete = false; finalized = false; hideNextButton(); attempts = 0;
                }

                attempts++;
                if (drawG) { drawG.destroy(); drawG = null; }
                drawG = this.add.graphics();
                drawG.lineStyle(3, 0xff0000, 1);
                drawing = true;
                reachedEdge = false;
                lastX = px;
                lastY = py;
                hasDrawn = false;

                if (px >= left + widthRect - 2) {
                    reachedEdge = true;
                    finalized = true;
                    drawing = false;
                    console.log('scene_15 drawing finalized immediately on fallback pointerdown');
                    if (drawG) { drawG.fillStyle(0x00ff00, 0.6); drawG.fillCircle(left + widthRect - 4, py, 6); }
                    if (attempts === 1) showNextButton();
                }
            }
        });

        // Pointer up handling
        this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
            drawing = false;
            if (!reachedEdge) { incomplete = true; console.log('scene_15 drawing incomplete (did not reach edge)'); }
            if (hasDrawn && !nextBtn) showNextButton();
        });

        // Pointer move drawing
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (!drawing || !drawG) return;
            const x = pointer.x;
            const y = pointer.y;
            drawG.lineBetween(lastX, lastY, x, y);
            lastX = x; lastY = y; hasDrawn = true;

            const hx2 = left + widthRect;
            if (!reachedEdge && x >= hx2 - 2) {
                reachedEdge = true; finalized = true; drawing = false;
                console.log('scene_15 drawing finalized (reached edge)');
                if (drawG) { drawG.fillStyle(0x00ff00, 0.6); drawG.fillCircle(hx2 - 4, y, 6); }
            }
        });

        // Top-centered dialog with instruction
        const dialogText = 'draw along the lines to cut the skull';
        const boxWidth = Math.min(width * 0.9, 720);
        const textStyle: Phaser.Types.GameObjects.Text.TextStyle = { font: '18px Arial', color: '#ffffff', align: 'center', wordWrap: { width: boxWidth - 24 } };
        const infoText = this.add.text(0, 0, dialogText, textStyle).setOrigin(0.5, 0);
        const boxHeight = infoText.height + 16;
        const bg = this.add.graphics();
        bg.fillStyle(0x000000, 0.85);
        bg.fillRoundedRect(-boxWidth / 2, 0, boxWidth, boxHeight, 8);
        const dialogContainer = this.add.container(width / 2, 12, [bg, infoText]).setDepth(1000);
        infoText.y = 8;
        dialogContainer.setSize(boxWidth, boxHeight);
        dialogContainer.setInteractive(new Phaser.Geom.Rectangle(-boxWidth / 2, 0, boxWidth, boxHeight), Phaser.Geom.Rectangle.Contains);
        dialogContainer.on('pointerdown', () => { dialogContainer.destroy(); bg.destroy(); infoText.destroy(); });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene15;
