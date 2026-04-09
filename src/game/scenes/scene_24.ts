import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene24 extends Scene {
    constructor() { super('scene_24'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_23').setDisplaySize(width, height);

        // Bottom-left lab tech dialog (actor speaking)
        const dialogW = Math.min(420, Math.round(width * 0.45));
        const dPadding = 10;
        const actorKey = 'lab_tech';
        const actorImg = this.add.image(0, 0, actorKey).setOrigin(0.5, 0);
        const actorSrc: any = this.textures.get(actorKey)?.getSourceImage?.();
        const actorSrcW = (actorSrc && actorSrc.width) ? actorSrc.width : 72;
        const actorSrcH = (actorSrc && actorSrc.height) ? actorSrc.height : 72;
        const actorTargetH = 88;
        const aScale = Math.min(1.6, actorTargetH / actorSrcH, (dialogW / 3) / actorSrcW);
        actorImg.setDisplaySize(Math.round(actorSrcW * aScale), Math.round(actorSrcH * aScale));

        const dialogText = 'Doctor, the cadaver\'s brain weights 1,260 grams.';
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

        // Lower-right Next button
        const nextX = width - 96;
        const nextY = height - 72;
        const nbBg = this.add.rectangle(0, 0, 160, 48, 0x000000, 0.85).setOrigin(0.5).setDepth(1001);
        const nbTxt = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(1002);
        nbBg.setInteractive({ useHandCursor: true });
        const nbContainer = this.add.container(nextX, nextY, [nbBg, nbTxt]).setDepth(1001);
        nbBg.on('pointerdown', () => {
            nbContainer.destroy();
            dlgContainer.destroy();
            dlgBg.destroy();
            actorImg.destroy();
            dialogTextObj.destroy();
            this.scene.start('scene_25');
        });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene24;
