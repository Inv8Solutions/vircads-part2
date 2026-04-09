import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene11 extends Scene {
    constructor() {
        super('scene_11');
    }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_11').setDisplaySize(width, height);

        // Click coordinate debug: show coords on-screen and log to console; draw temporary marker
        const debugText = this.add.text(12, height - 28, '', { font: '14px Arial', color: '#00ff00' }).setDepth(2);
        let marker: Phaser.GameObjects.Graphics | null = null;
        let hitOverlay: Phaser.GameObjects.Rectangle | null = null;
        let nextBtn: Phaser.GameObjects.Container | null = null;
        const hitStates: boolean[] = [false, false];
        const checkMarks: Array<Phaser.GameObjects.Text | null> = [null, null];

        // Top-centered dialog with brief instruction
        const dialogText = 'Click both sides of the scalp to elevate coronal flap';
        const boxWidth = Math.min(width * 0.9, 720);
        const textStyle: Phaser.Types.GameObjects.Text.TextStyle = { font: '18px Arial', color: '#ffffff', align: 'center', wordWrap: { width: boxWidth - 24 } };
        const infoText = this.add.text(0, 0, dialogText, textStyle).setOrigin(0.5, 0);
        const boxHeight = infoText.height + 16;
        const bgBox = this.add.graphics();
        bgBox.fillStyle(0x000000, 0.85);
        bgBox.fillRoundedRect(-boxWidth / 2, 0, boxWidth, boxHeight, 8);
        const dialogContainer = this.add.container(width / 2, 12, [bgBox, infoText]).setDepth(1000);
        infoText.y = 8;
        dialogContainer.setSize(boxWidth, boxHeight);
        dialogContainer.setInteractive(new Phaser.Geom.Rectangle(-boxWidth / 2, 0, boxWidth, boxHeight), Phaser.Geom.Rectangle.Contains);
        dialogContainer.on('pointerdown', () => { dialogContainer.destroy(); bgBox.destroy(); infoText.destroy(); });

        const showNextButton = () => {
            if (nextBtn) return;
            const x = width - 96;
            const y = height - 72;
            const bg = this.add.rectangle(0, 0, 160, 48, 0x000000, 0.8).setOrigin(0.5);
            const txt = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5);
            bg.setInteractive({ useHandCursor: true });
            const container = this.add.container(x, y, [bg, txt]).setDepth(1000);
            bg.on('pointerdown', () => {
                container.destroy();
                nextBtn = null;
                this.scene.start('scene_12');
            });
            nextBtn = container;
        };

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const x = Math.round(pointer.x);
            const y = Math.round(pointer.y);
            console.log('scene_11 pointerdown', x, y);
            debugText.setText(`x: ${x}, y: ${y}`);

            if (marker) { marker.destroy(); marker = null; }
            marker = this.add.graphics();
            marker.fillStyle(0xff0000, 1);
            marker.fillCircle(x, y, 6);

            this.time.delayedCall(800, () => { if (marker) { marker.destroy(); marker = null; debugText.setText(''); } });
        });

        // Add two invisible, scaled hitboxes
        const boxes = [
            { x1: 582, y1: 384, x2: 1121, y2: 621 },
            { x1: 566, y1: 650, x2: 1110, y2: 867 }
        ];

        const srcImg: any = this.textures.get('scene_11')?.getSourceImage?.();
        const imgW = (srcImg && srcImg.width) ? srcImg.width : 1;
        const imgH = (srcImg && srcImg.height) ? srcImg.height : 1;
        const scaleX = width / imgW;
        const scaleY = height / imgH;

        boxes.forEach((b, idx) => {
            const hx1 = b.x1 * scaleX;
            const hx2 = b.x2 * scaleX;
            const hy1 = b.y1 * scaleY;
            const hy2 = b.y2 * scaleY;
            const w = Math.max(1, hx2 - hx1);
            const h = Math.max(1, hy2 - hy1);
            const cx = hx1 + w / 2;
            const cy = hy1 + h / 2;

            const rect = this.add.rectangle(cx, cy, w, h, 0x000000, 0).setOrigin(0.5).setInteractive();
            rect.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
                const x = Math.round(pointer.x);
                const y = Math.round(pointer.y);
                console.log(`scene_11 hitbox ${idx + 1} clicked`, x, y);
                debugText.setText(`hitbox ${idx + 1}: x: ${x}, y: ${y}`);

                // temporary pointer marker
                if (marker) { marker.destroy(); marker = null; }
                marker = this.add.graphics();
                marker.fillStyle(0x00ff00, 1);
                marker.fillCircle(x, y, 8);

                // mark this hitbox as clicked and show a persistent check mark
                if (!hitStates[idx]) {
                    hitStates[idx] = true;
                    // create check mark text centered on the hitbox
                    const chk = this.add.text(cx, cy, '✓', { font: '36px Arial', color: '#00ff00' }).setOrigin(0.5).setDepth(1001);
                    checkMarks[idx] = chk;
                }

                // if both hitboxes clicked, show Next button
                if (hitStates[0] && hitStates[1]) {
                    showNextButton();
                }

                // remove temporary marker after a short delay, but keep check mark
                this.time.delayedCall(800, () => { if (marker) { marker.destroy(); marker = null; debugText.setText(''); } });
            });
        });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene11;
