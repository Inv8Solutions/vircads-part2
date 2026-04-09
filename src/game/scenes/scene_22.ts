import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene22 extends Scene {
    constructor() { super('scene_22'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_18').setDisplaySize(width, height);

        // Top-middle dialog
        const dialogW = Math.min(760, Math.round(width * 0.8));
        const padding = 12;
        const text = 'After cutting the optic chasm, remove the brain and have your Autopsy Technician record its weight.';
        const style: Phaser.Types.GameObjects.Text.TextStyle = { font: '18px Arial', color: '#ffffff', wordWrap: { width: dialogW - padding * 2 } };
        const textObj = this.add.text(0, 0, text, style).setOrigin(0.5, 0);
        const dlgHeight = padding + textObj.height + padding;
        const bg = this.add.graphics().setDepth(1000);
        bg.fillStyle(0x000000, 0.9);
        bg.fillRoundedRect(-dialogW / 2, 0, dialogW, dlgHeight, 10);
        const containerY = 20;
        const dlgContainer = this.add.container(width / 2, containerY, [bg, textObj]).setDepth(1000);
        textObj.x = 0;
        textObj.y = padding;

        // Click coordinate debug: show coords on-screen and draw temporary marker
        const debugText = this.add.text(12, height - 28, '', { font: '14px Arial', color: '#00ff00' }).setDepth(1000);
        let marker: Phaser.GameObjects.Graphics | null = null;

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const x = Math.round(pointer.x);
            const y = Math.round(pointer.y);
            // eslint-disable-next-line no-console
            console.log('scene_22 pointerdown', x, y);
            debugText.setText(`x: ${x}, y: ${y}`);

            if (marker) { marker.destroy(); marker = null; }
            marker = this.add.graphics().setDepth(1001);
            marker.fillStyle(0xff0000, 1);
            marker.fillCircle(x, y, 6);

            this.time.delayedCall(900, () => { if (marker) { marker.destroy(); marker = null; debugText.setText(''); } });
        });

        // Invisible hitbox defined by (585,491) -> (1107,727)
        const hx1 = 585, hy1 = 491, hx2 = 1107, hy2 = 727;
        const hw = Math.max(1, hx2 - hx1);
        const hh = Math.max(1, hy2 - hy1);
        const hitRect = this.add.rectangle(hx1, hy1, hw, hh, 0x000000, 0).setOrigin(0, 0).setInteractive({ useHandCursor: true }).setDepth(1000);
        hitRect.on('pointerdown', () => {
            // create dialog card centered showing `brain_removal` and caption
            const cardW = Math.min(700, Math.round(width * 0.7));
            const padding = 12;
            const key = 'brain_removal';
            let imgObj: Phaser.GameObjects.Image | null = null;
            let imgH = 0;

            if (this.textures.exists(key)) {
                const src: any = this.textures.get(key).getSourceImage?.();
                const srcW = (src && src.width) ? src.width : 200;
                const srcH = (src && src.height) ? src.height : 200;
                const maxImgW = cardW - padding * 2;
                const maxImgH = Math.round(height * 0.55);
                const scale = Math.min(1, maxImgW / srcW, maxImgH / srcH);
                imgObj = this.add.image(0, 0, key).setOrigin(0.5, 0).setDepth(1002);
                imgObj.setDisplaySize(Math.round(srcW * scale), Math.round(srcH * scale));
                imgH = imgObj.displayHeight;
            } else {
                // placeholder
                const phW = Math.max(180, cardW - padding * 2);
                const phH = Math.max(140, Math.round(height * 0.35));
                const ph = this.add.graphics().setDepth(1002);
                ph.fillStyle(0x444444, 0.98);
                ph.fillRoundedRect(-phW / 2, 0, phW, phH, 8);
                const lbl = this.add.text(-phW / 2 + 8, 8, `${key} MISSING`, { font: '16px Arial', color: '#fff' }).setDepth(1003);
                imgH = phH;
            }

            const caption = this.add.text(0, 0, 'actual image', { font: '16px Arial', color: '#ffffff' }).setOrigin(0.5, 0).setDepth(1002);
            const cardH = padding + imgH + 8 + caption.height + padding;
            const cardBg = this.add.graphics().setDepth(1001);
            cardBg.fillStyle(0x000000, 0.95);
            cardBg.fillRoundedRect(-cardW / 2, 0, cardW, cardH, 10);

            const containerY = Math.round((height - cardH) / 2 - 20);
            const cardContainer = this.add.container(width / 2, containerY, [cardBg]).setDepth(1001);
            if (imgObj) { imgObj.x = 0; imgObj.y = padding; cardContainer.add(imgObj); }
            caption.x = 0; caption.y = padding + imgH + 8; cardContainer.add([caption]);

            // Lower-right Next button to advance to scene_23
            const nextX = width - 96;
            const nextY = height - 72;
            const nbBg = this.add.rectangle(0, 0, 160, 48, 0x000000, 0.85).setOrigin(0.5).setDepth(1004);
            const nbTxt = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(1005);
            nbBg.setInteractive({ useHandCursor: true });
            const nbContainer = this.add.container(nextX, nextY, [nbBg, nbTxt]).setDepth(1004);
            nbBg.on('pointerdown', () => {
                // destroy card and next button then start next scene
                cardContainer.destroy();
                cardBg.destroy();
                if (imgObj) imgObj.destroy();
                caption.destroy();
                nbContainer.destroy();
                hitRect.destroy();
                this.scene.start('scene_23');
            });
        });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene22;
