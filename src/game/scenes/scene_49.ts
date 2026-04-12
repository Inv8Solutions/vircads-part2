import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene49 extends Scene {
    constructor() { super('scene_49'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_46').setDisplaySize(width, height);
        // Click debug: show coords, log, and draw a temporary marker
        const debugText = this.add.text(12, height - 28, '', { font: '14px Arial', color: '#00ff00' }).setDepth(50);
        let marker: Phaser.GameObjects.Graphics | null = null;

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const x = Math.round(pointer.x);
            const y = Math.round(pointer.y);
            console.log('scene_49 pointerdown', x, y);
            debugText.setText(`x: ${x}, y: ${y}`);

            if (marker) { marker.destroy(); marker = null; }
            marker = this.add.graphics();
            marker.fillStyle(0xff0000, 1);
            marker.fillCircle(x, y, 6);

            this.time.delayedCall(800, () => { if (marker) { marker.destroy(); marker = null; } });
        });
        // Add a visible red hitbox and make it redirect to the next scene on click
        const x1 = 688, y1 = 16, x2 = 1002, y2 = 326;
        const rx = Math.min(x1, x2);
        const ry = Math.min(y1, y2);
        const rw = Math.abs(x2 - x1);
        const rh = Math.abs(y2 - y1);

        const hitBoxGraphics = this.add.graphics();
        hitBoxGraphics.lineStyle(4, 0xff0000, 1);
        hitBoxGraphics.strokeRect(rx, ry, rw, rh);
        hitBoxGraphics.setDepth(60);
        // prepare persistent cursor variables so interactive zones don't override it
        const canvasEl = this.game.canvas as HTMLCanvasElement;
        let cursorStyle = '';

        const hitZone = this.add.zone(rx + rw / 2, ry + rh / 2, rw, rh).setInteractive();
        // reapply our custom cursor when pointer enters/leaves the zone
        hitZone.on('pointerover', () => { try { canvasEl.style.cursor = cursorStyle || ''; } catch (e) { } });
        hitZone.on('pointerout', () => { try { canvasEl.style.cursor = cursorStyle || ''; } catch (e) { } });
        hitZone.on('pointerdown', () => {
            console.log('scene_49 hitbox clicked, showing Next button');
            // remove current settings: destroy hit visuals, disable hit zone, clear debug and marker and cursor
            try { hitZone.disableInteractive(); hitZone.destroy(); } catch (e) { }
            try { hitBoxGraphics.destroy(); } catch (e) { }
            try { if (marker) { marker.destroy(); marker = null; } } catch (e) { }
            try { debugText.destroy(); } catch (e) { }
            try { cursorStyle = ''; canvasEl.style.cursor = ''; } catch (e) { }

            // show beaker image on middle-left with fade-in, then show Next button
            const beakerX = Math.round(width * 0.25);
            const beakerY = Math.round(height * 0.5);
            let beakerImg: Phaser.GameObjects.Image | null = null;
            try {
                if (this.textures.exists('beaker_blood')) {
                    beakerImg = this.add.image(beakerX, beakerY, 'beaker_blood').setOrigin(0.5).setAlpha(0).setDepth(70);
                } else {
                    // fallback: simple placeholder circle
                    const g = this.add.graphics();
                    g.fillStyle(0x880000, 1);
                    g.fillCircle(beakerX, beakerY, 48);
                    g.setDepth(70);
                }
            } catch (e) { /* ignore */ }

            const showNext = () => {
                const btnW = 140; const btnH = 48; const pad = 20;
                const bx = width - btnW / 2 - pad; const by = height - btnH / 2 - pad;
                const nextContainer = this.add.container(bx, by).setDepth(80);
                const bg = this.add.graphics();
                bg.fillStyle(0x222222, 0.9);
                bg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);
                bg.lineStyle(2, 0xffffff, 0.9);
                bg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);
                const label = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5);
                nextContainer.add([bg, label]);
                bg.setInteractive(new Phaser.Geom.Rectangle(-btnW/2, -btnH/2, btnW, btnH), Phaser.Geom.Rectangle.Contains);
                bg.on('pointerdown', () => { this.scene.start('scene_50'); });
            };

            if (beakerImg) {
                this.tweens.add({ targets: beakerImg, alpha: 1, duration: 400, ease: 'Quad.easeOut', onComplete: () => { showNext(); } });
            } else {
                // if no beaker image, show Next immediately
                showNext();
            }
        });
        // Use the preloaded 'ladle' texture to build a downscaled cursor data URL.
        try {
            const tex: any = this.textures.get('ladle');
            const img: HTMLImageElement | undefined = tex?.getSourceImage?.() || undefined;
            if (img && img.width && img.height) {
                const maxSize = 64; // max cursor size for compatibility
                const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
                const cw = Math.max(1, Math.round(img.width * scale));
                const ch = Math.max(1, Math.round(img.height * scale));
                const off = document.createElement('canvas');
                off.width = cw; off.height = ch;
                const ctx = off.getContext('2d');
                if (ctx) ctx.drawImage(img, 0, 0, cw, ch);
                const dataUrl = off.toDataURL('image/png');
                // use center as hotspot
                cursorStyle = `url(${dataUrl}) ${Math.round(cw / 2)} ${Math.round(ch / 2)}, auto`;
                canvasEl.style.cursor = cursorStyle;
            } else {
                // fallback to file path
                const cursorUrl = '/assets/ladle.png';
                cursorStyle = `url(${cursorUrl}) 16 16, auto`;
                canvasEl.style.cursor = cursorStyle;
            }
        } catch (e) {
            try { cursorStyle = ''; (this.game.canvas.parentElement || document.body as HTMLElement).style.cursor = ''; } catch (ex) { }
        }

        // restore cursor when scene shuts down
        this.events.once('shutdown', () => {
            try { (this.game.canvas as HTMLCanvasElement).style.cursor = ''; } catch (e) { }
            try { ((this.game.canvas.parentElement || document.body) as HTMLElement).style.cursor = ''; } catch (e) { }
        });

        // Bottom-center dialog
        try {
            const dialogText = 'Using the ladle, scoop out the blood and transfer it to the beaker.';
            const maxW = Math.min(width - 160, 900);
            const dialog = this.add.text(width / 2, height - 80, dialogText, {
                font: '18px Arial',
                color: '#ffffff',
                align: 'center',
                wordWrap: { width: maxW }
            }).setOrigin(0.5).setDepth(76);

            const pad = 18;
            const boxW = dialog.width + pad * 2;
            const boxH = dialog.height + pad * 2;
            const boxX = width / 2 - boxW / 2;
            const boxY = (height - 80) - boxH / 2;

            const box = this.add.graphics().setDepth(75);
            box.fillStyle(0x0b0b0b, 0.9);
            box.fillRoundedRect(boxX, boxY, boxW, boxH, 10);
            box.lineStyle(2, 0xffffff, 0.08);
            box.strokeRoundedRect(boxX, boxY, boxW, boxH, 10);
        } catch (e) { /* ignore dialog errors */ }

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene49;
