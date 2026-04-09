import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene19 extends Scene {
    constructor() { super('scene_19'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_18').setDisplaySize(width, height);

        // Carousel styled like dialog cards
        const baseWidth = Math.min(width * 0.8, 640);
        const reducePx = 96;
        const cardWidth = Math.max(160, baseWidth - reducePx);
        const padding = 12;

        const cardBg = this.add.graphics();
        cardBg.fillStyle(0x000000, 0.9);
        const cardHeight = 280;
        cardBg.fillRoundedRect(-cardWidth / 2, 0, cardWidth, cardHeight, 10);

        const cardX = cardWidth / 2 + 20;
        const cardY = 40;
        const cardContainer = this.add.container(cardX, cardY, [cardBg]).setDepth(1000);

        // Title
        const title = this.add.text(0, 8, 'signs of internal bleeding', { font: '18px Arial', color: '#ffffff', align: 'center' }).setOrigin(0.5, 0);
        cardContainer.add(title);

        // Image and caption placeholders
        const img = this.add.image(0, 0, 'internal_bleeding').setOrigin(0.5, 0);
        const maxImgW = cardWidth - padding * 2;
        const targetImgH = 160 + 100; // increase image target height by 50px
        const setImageSize = (key: string) => {
            const src: any = this.textures.get(key)?.getSourceImage?.();
            const srcW = (src && src.width) ? src.width : img.width || maxImgW;
            const srcH = (src && src.height) ? src.height : img.height || targetImgH;
            // scale to fit within maxImgW x targetImgH without upscaling
            const sc = Math.min(1, maxImgW / srcW, targetImgH / srcH);
            img.setTexture(key);
            img.setDisplaySize(Math.round(srcW * sc), Math.round(srcH * sc));
        };
        img.x = 0;
        img.y = title.y + title.height + 8;
        cardContainer.add(img);

        const caption = this.add.text(0, img.y + img.displayHeight + 8, '', { font: '16px Arial', color: '#ffffff', align: 'center', wordWrap: { width: maxImgW } }).setOrigin(0.5, 0);
        cardContainer.add(caption);

        // Cards data
        const cards = [
            { key: 'internal_bleeding', text: 'with internal bleeding' },
            { key: 'no_internal_bleeding', text: 'without internal bleeding' }
        ];
        let current = 0;
        let placeholder: Phaser.GameObjects.Graphics | null = null;
        const statusText = this.add.text(12, 12, '', { font: '14px Arial', color: '#00ff00' }).setDepth(2000);

        const updateCard = (idx: number) => {
            const c = cards[idx];
            const exists = this.textures.exists(c.key);
            console.log('scene_19 updateCard:', c.key, 'textureExists=', exists);
            

            if (placeholder) { placeholder.destroy(); placeholder = null; }
            if (exists) {
                setImageSize(c.key);
                img.setVisible(true);
            } else {
                img.setVisible(false);
                placeholder = this.add.graphics();
                placeholder.fillStyle(0x444444, 1);
                const phW = maxImgW;
                const phH = targetImgH;
                // draw placeholder centered on img.x
                placeholder.fillRoundedRect(-phW / 2, img.y, phW, phH, 6);
            }

            img.y = title.y + title.height + 8;
            // if placeholder is shown, caption position uses placeholder height
            const imgH = (placeholder) ? 160 : img.displayHeight;
            caption.setText(c.text);
            caption.y = img.y + imgH + 8;

            const totalH = padding + title.height + 8 + imgH + 8 + caption.height + padding;
            cardBg.clear();
            cardBg.fillStyle(0x000000, 0.9);
            cardBg.fillRoundedRect(-cardWidth / 2, 0, cardWidth, totalH, 10);
            cardContainer.setSize(cardWidth, totalH);
            // reposition arrow buttons if present
            if (leftBtn) leftBtn.y = totalH / 2;
            if (rightBtn) rightBtn.y = totalH / 2;
        };

        // Arrow buttons as dark containers for better visibility
        let leftBtn: Phaser.GameObjects.Container | null = null;
        let rightBtn: Phaser.GameObjects.Container | null = null;
        const makeArrow = (x: number, y: number, label: string) => {
            const bg = this.add.rectangle(x, y, 44, 44, 0x111111, 0.95).setOrigin(0.5).setDepth(1001);
            const txt = this.add.text(x, y, label, { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(1002);
            bg.setInteractive({ useHandCursor: true });
            const container = this.add.container(0, 0, [bg, txt]).setDepth(1001);
            return { container, bg, txt };
        };

        const leftWidgets = makeArrow(-cardWidth / 2 + 30, cardHeight / 2, '<');
        leftBtn = leftWidgets.container;
        const rightWidgets = makeArrow(cardWidth / 2 - 30, cardHeight / 2, '>');
        rightBtn = rightWidgets.container;
        // attach pointer handlers to the bg rectangles
        (leftWidgets.bg as Phaser.GameObjects.Rectangle).on('pointerdown', () => { current = (current - 1 + cards.length) % cards.length; updateCard(current); });
        (rightWidgets.bg as Phaser.GameObjects.Rectangle).on('pointerdown', () => { current = (current + 1) % cards.length; updateCard(current); });
        cardContainer.add([leftBtn, rightBtn]);

        // Close 'X' button
        // Initialize
        updateCard(current);

        // Bottom-right Next button (advances to scene_20)
        const nextX = width - 96;
        const nextY = height - 72;
        const nbBg = this.add.rectangle(0, 0, 160, 48, 0x000000, 0.85).setOrigin(0.5).setDepth(1001);
        const nbTxt = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(1001);
        nbBg.setInteractive({ useHandCursor: true });
        const nbContainer = this.add.container(nextX, nextY, [nbBg, nbTxt]).setDepth(1001);
        nbBg.on('pointerdown', () => {
            // destroy carousel components and proceed
            nbContainer.destroy();
            cardContainer.destroy();
            cardBg.destroy();
            img.destroy();
            caption.destroy();
            title.destroy();
            leftBtn?.destroy();
            rightBtn?.destroy();
            // start next scene
            this.scene.start('scene_20');
        });

        // Lower-left lab tech dialog (actor speaking)
        const dialogW = Math.min(420, Math.round(width * 0.45));
        const dPadding = 10;
        const actorKey = 'lab_tech';
        const actorImg = this.add.image(0, 0, actorKey).setOrigin(0.5, 0);
        const actorSrc: any = this.textures.get(actorKey)?.getSourceImage?.();
        const actorSrcW = (actorSrc && actorSrc.width) ? actorSrc.width : 72;
        const actorSrcH = (actorSrc && actorSrc.height) ? actorSrc.height : 72;
        const actorTargetH = 72;
        const aScale = Math.min(1, actorTargetH / actorSrcH, (dialogW / 3) / actorSrcW);
        actorImg.setDisplaySize(Math.round(actorSrcW * aScale), Math.round(actorSrcH * aScale));

        const dialogText = 'Doctor, the brain shows no sign of any internal bleeding.';
        const dialogStyle: Phaser.Types.GameObjects.Text.TextStyle = { font: '16px Arial', color: '#ffffff', wordWrap: { width: dialogW - dPadding * 2 - actorImg.displayWidth - 12 } };
        const dialogTextObj = this.add.text(0, 0, dialogText, dialogStyle).setOrigin(0, 0);

        const dlgHeight = dPadding + Math.max(actorImg.displayHeight, dialogTextObj.height) + dPadding;
        const dlgBg = this.add.graphics();
        dlgBg.fillStyle(0x000000, 0.9);
        dlgBg.fillRoundedRect(-dialogW / 2, 0, dialogW, dlgHeight, 8);

        const dlgX = Math.round(dialogW / 2 + 20);
        const dlgY = Math.round(height - dlgHeight - 20);
        const dlgContainer = this.add.container(dlgX, dlgY, [dlgBg, actorImg, dialogTextObj]).setDepth(1000);
        actorImg.x = -dialogW / 2 + dPadding + actorImg.displayWidth / 2;
        actorImg.y = dPadding;
        dialogTextObj.x = -dialogW / 2 + dPadding + actorImg.displayWidth + 12;
        dialogTextObj.y = dPadding;

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene19;
