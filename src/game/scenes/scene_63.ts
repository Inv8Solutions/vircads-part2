import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene63 extends Scene {
    constructor() { super('scene_63'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_62').setDisplaySize(width, height);

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

        // Bottom-center dialog (lab_tech speaking)
        try {
            const text = 'Here are the photos I have taken earlier.';
            const avatarSize = 72;
            const maxTextW = Math.min(900, width - avatarSize - 160);
            const dialogText = this.add.text(0, 0, text, { font: '18px Arial', color: '#ffffff', wordWrap: { width: maxTextW } }).setDepth(1200);

            const boxPad = 14;
            const boxW = dialogText.width + avatarSize + boxPad * 3;
            const boxH = Math.max(dialogText.height + boxPad * 2, avatarSize + boxPad);
            const bx = Math.round((width - boxW) / 2);
            const by = height - boxH - 36;

            const box = this.add.graphics().setDepth(1199);
            box.fillStyle(0x0b0b0b, 0.95);
            box.fillRoundedRect(bx, by, boxW, boxH, 12);
            box.lineStyle(2, 0xffffff, 0.06);
            box.strokeRoundedRect(bx, by, boxW, boxH, 12);

            // avatar left inside box
            if (this.textures.exists('lab_tech')) {
                const ax = bx + boxPad + avatarSize / 2;
                const ay = by + boxH / 2;
                this.add.image(ax, ay, 'lab_tech').setDisplaySize(avatarSize, avatarSize).setDepth(1200).setOrigin(0.5);
            } else {
                const avx = bx + boxPad + avatarSize / 2;
                const avy = by + boxH / 2;
                const g2 = this.add.graphics();
                g2.fillStyle(0x666666, 1);
                g2.fillCircle(avx, avy, avatarSize / 2);
                g2.setDepth(1200);
            }

            // position text to the right of avatar
            dialogText.setPosition(bx + boxPad + avatarSize + boxPad, by + boxPad + 4);
        } catch (e) { /* ignore dialog errors */ }

        // --- Documentation carousel (centered on screen) ---
        const docFiles = [
            'doc1.png','doc2.png','doc3.png','doc4.png','doc5.png','doc6.png','doc7.png','doc8.png','doc9.png','doc10.png','doc11.png','doc12.png'
        ];

        if (docFiles.length > 0) {
            const docKeys = docFiles.map((_, i) => `doc_${i}`);

            // Only queue images that aren't already in the texture cache
            const toLoad: string[] = [];
            docFiles.forEach((file, i) => {
                const key = docKeys[i];
                if (!this.textures.exists(key)) {
                    this.load.image(key, `/assets/documentation_body/${file}`);
                    toLoad.push(key);
                }
            });

            let currentIndex = 0;
            let displayImage: Phaser.GameObjects.Image | null = null;
            let carouselBg: Phaser.GameObjects.Graphics | null = null;
            const loadedKeys = new Set<string>();

            const fitImage = (img: Phaser.GameObjects.Image) => {
                const maxW = Math.min(Math.round(width * 0.8), 760);
                const maxH = Math.round(height * 0.6);
                const iw = img.width || img.displayWidth;
                const ih = img.height || img.displayHeight;
                const scale = Math.min(maxW / iw, maxH / ih, 1);
                img.setDisplaySize(Math.round(iw * scale), Math.round(ih * scale));
            };

            // Dim the scene behind the carousel (below carousel elements but above background)
            const dim = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.45).setDepth(1188);

            // Prev / Next controls (centered, outside image) — create immediately so UI is responsive
            const btnStyle: Phaser.Types.GameObjects.Text.TextStyle = { font: '34px Arial', color: '#ffffff' };
            // background circles for buttons
            const prevBg = this.add.graphics().setDepth(1200);
            prevBg.fillStyle(0x000000, 0.6);
            prevBg.fillCircle(0, 0, 28);
            prevBg.setPosition(width / 2 - 220, height / 2);
            prevBg.setInteractive(new Phaser.Geom.Circle(0, 0, 28), Phaser.Geom.Circle.Contains);

            const nextBg = this.add.graphics().setDepth(1200);
            nextBg.fillStyle(0x000000, 0.6);
            nextBg.fillCircle(0, 0, 28);
            nextBg.setPosition(width / 2 + 220, height / 2);
            nextBg.setInteractive(new Phaser.Geom.Circle(0, 0, 28), Phaser.Geom.Circle.Contains);

            const prev = this.add.text(width / 2 - 220, height / 2, '<', btnStyle).setOrigin(0.5).setDepth(1201).setInteractive({ useHandCursor: true });
            const next = this.add.text(width / 2 + 220, height / 2, '>', btnStyle).setOrigin(0.5).setDepth(1201).setInteractive({ useHandCursor: true });

            const showIndex = (idx: number) => {
                currentIndex = (idx + docKeys.length) % docKeys.length;
                const key = docKeys[currentIndex];
                if (this.textures.exists(key) || loadedKeys.has(key)) {
                    if (!displayImage) {
                        displayImage = this.add.image(width / 2, height / 2, key).setDepth(1200).setInteractive();
                    } else {
                        displayImage.setTexture(key);
                    }
                    fitImage(displayImage);

                    // draw/position black rounded background behind the image
                    const imgPad = 12;
                    const bgW = Math.round(displayImage.displayWidth + imgPad * 2);
                    const bgH = Math.round(displayImage.displayHeight + imgPad * 2);
                    const bgX = Math.round(displayImage.x - bgW / 2);
                    const bgY = Math.round(displayImage.y - bgH / 2);
                    if (!carouselBg) {
                        carouselBg = this.add.graphics().setDepth(1199);
                    } else {
                        carouselBg.clear();
                    }
                    carouselBg.fillStyle(0x000000, 0.9);
                    carouselBg.fillRoundedRect(bgX, bgY, bgW, bgH, 10);

                    // position nav buttons relative to image after sizing
                    const halfW = displayImage.displayWidth / 2;
                    prev.setPosition(displayImage.x - halfW - 28, displayImage.y);
                    next.setPosition(displayImage.x + halfW + 28, displayImage.y);
                } else {
                    // image not yet loaded — show a simple loading hint by dimming buttons
                    prev.setAlpha(0.4);
                    next.setAlpha(0.4);
                    prevBg.setAlpha(0.4);
                    nextBg.setAlpha(0.4);
                }
            };

            // wire both the visible text and the circular background to respond to clicks
            prev.on('pointerdown', () => { showIndex(currentIndex - 1); });
            next.on('pointerdown', () => { showIndex(currentIndex + 1); });
            prevBg.on('pointerdown', () => { showIndex(currentIndex - 1); });
            nextBg.on('pointerdown', () => { showIndex(currentIndex + 1); });

            // If some images are already cached, mark them as loaded
            docKeys.forEach(k => { if (this.textures.exists(k)) loadedKeys.add(k); });

            // If at least one image already cached, show it immediately
            if (loadedKeys.size > 0) {
                // choose first available cached image
                const firstCachedIndex = docKeys.findIndex(k => loadedKeys.has(k));
                if (firstCachedIndex >= 0) showIndex(firstCachedIndex);
            }

            if (toLoad.length > 0) {
                // show first image as soon as any file is loaded
                this.load.on('filecomplete', (fileKey: string) => {
                    if (!fileKey.startsWith('doc_')) return;
                    loadedKeys.add(fileKey);
                    // if no display yet, show this one immediately for faster perceived load
                    if (!displayImage) {
                        const idx = docKeys.indexOf(fileKey);
                        if (idx >= 0) showIndex(idx);
                    }
                });

                // start background load for missing images
                this.load.start();
            }
        }

        try {
            const btnW = 140; const btnH = 48; const pad = 20;
            const bx = width - btnW / 2 - pad; const by = height - btnH / 2 - pad;
            const nextContainer = this.add.container(bx, by).setDepth(90);
            const bg = this.add.graphics();
            bg.fillStyle(0x222222, 0.95);
            bg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);
            bg.lineStyle(2, 0xffffff, 0.9);
            bg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);
            const label = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(91);
            nextContainer.add([bg, label]);
            bg.setInteractive(new Phaser.Geom.Rectangle(-btnW/2, -btnH/2, btnW, btnH), Phaser.Geom.Rectangle.Contains);
            bg.on('pointerdown', () => { this.scene.start('scene_64'); });
        } catch (e) { /* ignore next button errors */ }

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene63;
