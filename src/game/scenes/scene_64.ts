import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene64 extends Scene {
    constructor() { super('scene_64'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_62').setDisplaySize(width, height);

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

        

        // Bottom-center dialog (lab_tech speaking) — mirror scene_63 style
        try {
            const text = 'Here are the organ photos I collected.';
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

        // --- Documentation organs carousel (centered on screen) ---
        const docFiles = ['organ1.png','organ2.png','organ3.png','organ4.png','organ5.png','organ6.png','organ7.png','organ8.png'];

        if (docFiles.length > 0) {
            const docKeys = docFiles.map((_, i) => `organ_${i}`);

            // queue only missing textures
            const toLoad: string[] = [];
            docFiles.forEach((file, i) => {
                const key = docKeys[i];
                if (!this.textures.exists(key)) {
                    this.load.image(key, `/assets/documentation_organs/${file}`);
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

            // Dim the scene behind the carousel
            const dim = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.45).setDepth(1188);

            // Prev/Next UI
            const btnStyle: Phaser.Types.GameObjects.Text.TextStyle = { font: '34px Arial', color: '#ffffff' };
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

                    // background behind image
                    const imgPad = 12;
                    const bgW = Math.round(displayImage.displayWidth + imgPad * 2);
                    const bgH2 = Math.round(displayImage.displayHeight + imgPad * 2);
                    const bgX = Math.round(displayImage.x - bgW / 2);
                    const bgY = Math.round(displayImage.y - bgH2 / 2);
                    if (!carouselBg) {
                        carouselBg = this.add.graphics().setDepth(1199);
                    } else {
                        carouselBg.clear();
                    }
                    carouselBg.fillStyle(0x000000, 0.9);
                    carouselBg.fillRoundedRect(bgX, bgY, bgW, bgH2, 10);

                    // position nav buttons
                    const halfW = displayImage.displayWidth / 2;
                    prev.setPosition(displayImage.x - halfW - 28, displayImage.y);
                    next.setPosition(displayImage.x + halfW + 28, displayImage.y);
                    prevBg.setPosition(prev.x, prev.y);
                    nextBg.setPosition(next.x, next.y);
                    prev.setAlpha(1); next.setAlpha(1); prevBg.setAlpha(1); nextBg.setAlpha(1);
                } else {
                    prev.setAlpha(0.4); next.setAlpha(0.4); prevBg.setAlpha(0.4); nextBg.setAlpha(0.4);
                }
            };

            prev.on('pointerdown', () => { showIndex(currentIndex - 1); });
            next.on('pointerdown', () => { showIndex(currentIndex + 1); });
            prevBg.on('pointerdown', () => { showIndex(currentIndex - 1); });
            nextBg.on('pointerdown', () => { showIndex(currentIndex + 1); });

            // mark cached textures
            docKeys.forEach(k => { if (this.textures.exists(k)) loadedKeys.add(k); });
            if (loadedKeys.size > 0) {
                const firstCachedIndex = docKeys.findIndex(k => loadedKeys.has(k));
                if (firstCachedIndex >= 0) showIndex(firstCachedIndex);
            }

            if (toLoad.length > 0) {
                this.load.on('filecomplete', (fileKey: string) => {
                    if (!fileKey.startsWith('organ_')) return;
                    loadedKeys.add(fileKey);
                    if (!displayImage) {
                        const idx = docKeys.indexOf(fileKey);
                        if (idx >= 0) showIndex(idx);
                    }
                });
                this.load.start();
            }
        }

        // bottom-right Next button
        try {
            const btnW = 140; const btnH = 48; const pad = 20;
            const bx2 = width - btnW / 2 - pad; const by2 = height - btnH / 2 - pad;
            const nextContainer = this.add.container(bx2, by2).setDepth(90);
            const bg2 = this.add.graphics();
            bg2.fillStyle(0x222222, 0.95);
            bg2.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);
            bg2.lineStyle(2, 0xffffff, 0.9);
            bg2.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);
            const label2 = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(91);
            nextContainer.add([bg2, label2]);
            bg2.setInteractive(new Phaser.Geom.Rectangle(-btnW/2, -btnH/2, btnW, btnH), Phaser.Geom.Rectangle.Contains);
            bg2.on('pointerdown', () => { this.scene.start('scene_65'); });
        } catch (e) { /* ignore next button errors */ }

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene64;
