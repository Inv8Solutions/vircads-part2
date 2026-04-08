import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene10 extends Scene {
    constructor() {
        super('scene_10');
    }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_10').setDisplaySize(width, height);

        // Click coordinate debug: show coords on-screen and log to console; draw temporary marker
        const debugText = this.add.text(12, height - 28, '', { font: '14px Arial', color: '#00ff00' }).setDepth(2);
        let marker: Phaser.GameObjects.Graphics | null = null;

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const x = Math.round(pointer.x);
            const y = Math.round(pointer.y);
            console.log('scene_10 pointerdown', x, y);
            debugText.setText(`x: ${x}, y: ${y}`);

            if (marker) { marker.destroy(); marker = null; }
            marker = this.add.graphics();
            marker.fillStyle(0xff0000, 1);
            marker.fillCircle(x, y, 6);

            this.time.delayedCall(800, () => { if (marker) { marker.destroy(); marker = null; } });
        });

        // Invisible drawing hit area: use a transparent rectangle for reliable input
        // Original coordinates: (576,622) to (1069,627)
        const hx1 = 576, hy1 = 622, hx2 = 1069, hy2 = 627;
        const hW = Math.max(1, hx2 - hx1);
        // make hitbox taller upwards so it's easier to start drawing from above
        const upExtra = 120; // expand upwards by this many pixels
        const top = Math.max(0, hy1 - upExtra);
        const bottom = hy2;
        const hH = Math.max(20, bottom - top);
        const hX = hx1 + hW / 2;
        const hY = top + hH / 2;

        // Use a transparent rectangle (more reliable than a Zone for pointer input)
        const drawRect = this.add.rectangle(hX, hY, hW, hH, 0x000000, 0).setOrigin(0.5).setInteractive();

        let drawing = false;
        let lastX = 0;
        let lastY = 0;
        let drawG: Phaser.GameObjects.Graphics | null = null;
        let finalized = false; // true when the user reached the right edge
        let incomplete = false; // true when user released before reaching edge
        let reachedEdge = false;
        let attempts = 0; // number of drawing attempts (clicks)
        let nextBtn: Phaser.GameObjects.Container | null = null;
        let hasDrawn = false; // true when pointermove has drawn at least once

        const showNextButton = () => {
            if (nextBtn) return;
            const x = width / 2;
            const y = height - 80;
            const bg = this.add.rectangle(0, 0, 160, 48, 0x000000, 0.7).setOrigin(0.5);
            const txt = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5);
            bg.setInteractive({ useHandCursor: true });
            const container = this.add.container(x, y, [bg, txt]).setDepth(50);
            bg.on('pointerdown', () => {
                container.destroy();
                nextBtn = null;
                this.scene.start('scene_11');
            });
            nextBtn = container;
        };

        const hideNextButton = () => {
            if (nextBtn) {
                nextBtn.destroy();
                nextBtn = null;
            }
        };

        drawRect.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            // If there is an unfinished or finalized drawing, reset it on new click
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

            // If the user clicked directly at the edge, finalize immediately
            if (pointer.x >= hx2 - 2) {
                reachedEdge = true;
                finalized = true;
                drawing = false;
                console.log('scene_10 drawing finalized immediately on pointerdown');
                if (drawG) {
                    drawG.fillStyle(0x00ff00, 0.6);
                    drawG.fillCircle(hx2 - 4, pointer.y, 6);
                }
                if (attempts === 1) showNextButton();
            }
        });

            // Fallback: some clicks may not register on the rectangle; start drawing
            // if the user clicks inside the logical hit bounds anywhere on the scene.
            this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
                if (drawing) return; // already handled
                const px = pointer.x;
                const py = pointer.y;
                // check bounds against original area (hx1..hx2) and expanded top..bottom
                if (px >= hx1 && px <= hx2 && py >= top && py <= bottom) {
                    // reset any prior incomplete/finalized drawing
                    if (drawG && (incomplete || finalized)) {
                        drawG.destroy();
                        drawG = null;
                        incomplete = false;
                        finalized = false;
                        hideNextButton();
                        attempts = 0;
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

                    // If the click was already at the right edge, finalize immediately
                    if (px >= hx2 - 2) {
                        reachedEdge = true;
                        finalized = true;
                        drawing = false;
                        console.log('scene_10 drawing finalized immediately on fallback pointerdown');
                        if (drawG) {
                            drawG.fillStyle(0x00ff00, 0.6);
                            drawG.fillCircle(hx2 - 4, py, 6);
                        }
                        if (attempts === 1) showNextButton();
                    }
                }
            });

        // Stop drawing when pointer is released anywhere
        this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
            drawing = false;
            if (!reachedEdge) {
                // mark as incomplete; user can click again to reset and try
                incomplete = true;
                console.log('scene_10 drawing incomplete (did not reach edge)');
            }

            // If the user drew something and released, show Next button
            if (hasDrawn && !nextBtn) {
                showNextButton();
            }
        });

        // Draw while pointer moves and the user is in drawing mode
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (!drawing || !drawG) return;
            const x = pointer.x;
            const y = pointer.y;
            drawG.lineBetween(lastX, lastY, x, y);
            lastX = x;
            lastY = y;
            hasDrawn = true;

            // If the pointer reaches the right edge of the original area, finalize
            if (!reachedEdge && x >= hx2 - 2) {
                reachedEdge = true;
                finalized = true;
                drawing = false;
                console.log('scene_10 drawing finalized (reached edge)');
                // optionally add a small visual cue for finalized
                if (drawG) {
                    drawG.fillStyle(0x00ff00, 0.6);
                    drawG.fillCircle(hx2 - 4, y, 6);
                }
            }
        });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene10;
