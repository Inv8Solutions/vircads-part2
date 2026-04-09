import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene16 extends Scene {
    constructor() { super('scene_16'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_15').setDisplaySize(width, height);

        // Click coordinate debug: show coords on-screen and log to console; draw temporary marker
        const debugText = this.add.text(12, height - 28, '', { font: '14px Arial', color: '#00ff00' }).setDepth(2);
        let marker: Phaser.GameObjects.Graphics | null = null;

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const x = Math.round(pointer.x);
            const y = Math.round(pointer.y);
            console.log('scene_16 pointerdown', x, y);
            debugText.setText(`x: ${x}, y: ${y}`);

            if (marker) { marker.destroy(); marker = null; }
            marker = this.add.graphics();
            marker.fillStyle(0xff0000, 1);
            marker.fillCircle(x, y, 6);

            this.time.delayedCall(800, () => { if (marker) { marker.destroy(); marker = null; debugText.setText(''); } });
        });

        // Dialog card: image on top and caption below (styled like scene_12)
        const baseWidth = Math.min(width * 0.8, 640);
        const reducePx = 96; // ~6rem total reduction to match previous card sizing
        const cardWidth = Math.max(160, baseWidth - reducePx);
        const padding = 12;

        const cardBg = this.add.graphics();
        cardBg.fillStyle(0x000000, 0.9);
        const cardHeight = 240;
        cardBg.fillRoundedRect(-cardWidth / 2, 0, cardWidth, cardHeight, 10);

        const cardContainer = this.add.container(cardWidth / 2 + 20, 40, [cardBg]).setDepth(1000);

        const imgKey = 'skull_cut';
        const img = this.add.image(0, 0, imgKey).setOrigin(0.5, 0);
        const srcImg: any = this.textures.get(imgKey)?.getSourceImage?.();
        const srcW = (srcImg && srcImg.width) ? srcImg.width : img.width || cardWidth - padding * 2;
        const srcH = (srcImg && srcImg.height) ? srcImg.height : img.height || 160;
        const maxImgW = cardWidth - padding * 2;
        const scale = Math.min(1, maxImgW / srcW);
        img.setDisplaySize(srcW * scale, srcH * scale);
        img.x = 0;
        img.y = padding;
        cardContainer.add(img);

        const caption = this.add.text(0, img.y + img.displayHeight + 8, 'Actual photo of cutting the skull', { font: '16px Arial', color: '#ffffff', align: 'center', wordWrap: { width: maxImgW } }).setOrigin(0.5, 0);
        cardContainer.add(caption);

        const totalH = padding + img.displayHeight + 8 + caption.height + padding;
        cardBg.clear();
        cardBg.fillStyle(0x000000, 0.9);
        cardBg.fillRoundedRect(-cardWidth / 2, 0, cardWidth, totalH, 10);

        cardContainer.setSize(cardWidth, totalH);
        cardContainer.setInteractive(new Phaser.Geom.Rectangle(-cardWidth / 2, 0, cardWidth, totalH), Phaser.Geom.Rectangle.Contains);
        cardContainer.on('pointerdown', () => { cardContainer.destroy(); cardBg.destroy(); img.destroy(); caption.destroy(); });

        // Next button will be created after the skull is clicked
        let skullNextBtn: Phaser.GameObjects.Container | null = null;
        const showSkullNext = () => {
            if (skullNextBtn) return;
            const nextX = width - 96;
            const nextY = height - 72;
            const nbBg = this.add.rectangle(0, 0, 160, 48, 0x000000, 0.8).setOrigin(0.5).setDepth(1000);
            const nbTxt = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(1000);
            nbBg.setInteractive({ useHandCursor: true });
            const nbContainer = this.add.container(nextX, nextY, [nbBg, nbTxt]).setDepth(1000);
            nbBg.on('pointerdown', () => {
                nbContainer.destroy();
                skullNextBtn = null;
                this.scene.start('scene_17');
            });
            skullNextBtn = nbContainer;
        };

        // Rectangular hitbox: coordinates (571,492) and (1102,727)
        const hxA = { x: 571, y: 492 };
        const hxB = { x: 1102, y: 727 };
        const hxLeft = Math.min(hxA.x, hxB.x);
        const hxTop = Math.min(hxA.y, hxB.y);
        const hxW = Math.max(1, Math.abs(hxB.x - hxA.x));
        const hxH = Math.max(1, Math.abs(hxB.y - hxA.y));

        const skullHit = this.add.rectangle(hxLeft, hxTop, hxW, hxH, 0x000000, 0).setOrigin(0, 0).setInteractive({ useHandCursor: true }).setDepth(900);
        let skullChecked = false;
        let skullCheckMark: Phaser.GameObjects.Text | null = null;
        skullHit.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            console.log('scene_16 skull hit clicked', Math.round(pointer.x), Math.round(pointer.y));
            if (!skullChecked) {
                skullChecked = true;
                // place a check mark near the top-right of the hitbox
                const cx = hxLeft + hxW - 24;
                const cy = hxTop + 24;
                skullCheckMark = this.add.text(cx, cy, '✓', { font: '32px Arial', color: '#00ff00' }).setOrigin(0.5).setDepth(1001);
                // small flash overlay for feedback
                const g = this.add.graphics();
                g.fillStyle(0x00ff00, 0.25);
                g.fillRect(hxLeft, hxTop, hxW, hxH);
                this.time.delayedCall(300, () => { g.destroy(); });
                // show Next button
                showSkullNext();
            }
        });

        // Top-centered dialog with instruction
        const dialogText = 'click on the skull to remove it';
        const boxWidth2 = Math.min(width * 0.9, 720);
        const textStyle2: Phaser.Types.GameObjects.Text.TextStyle = { font: '18px Arial', color: '#ffffff', align: 'center', wordWrap: { width: boxWidth2 - 24 } };
        const infoText2 = this.add.text(0, 0, dialogText, textStyle2).setOrigin(0.5, 0);
        const boxHeight2 = infoText2.height + 16;
        const dialogBg = this.add.graphics();
        dialogBg.fillStyle(0x000000, 0.85);
        dialogBg.fillRoundedRect(-boxWidth2 / 2, 0, boxWidth2, boxHeight2, 8);
        const dialogContainer2 = this.add.container(width / 2, 12, [dialogBg, infoText2]).setDepth(1000);
        infoText2.y = 8;
        dialogContainer2.setSize(boxWidth2, boxHeight2);
        dialogContainer2.setInteractive(new Phaser.Geom.Rectangle(-boxWidth2 / 2, 0, boxWidth2, boxHeight2), Phaser.Geom.Rectangle.Contains);
        dialogContainer2.on('pointerdown', () => { dialogContainer2.destroy(); dialogBg.destroy(); infoText2.destroy(); });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene16;
