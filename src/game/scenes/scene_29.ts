import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene29 extends Scene {
    constructor() { super('scene_29'); }

    create() {
        const { width, height } = this.scale;
        // Zoom background by 20%
        const zoomFactor = 1.7  ;
        this.add.image(width / 2, height / 2, 'scene_29').setDisplaySize(Math.round(width * zoomFactor), Math.round(height * zoomFactor));

        // UI scaffold placeholder
        const uiContainer = this.add.container(0, 0).setDepth(1000);
        const label = this.add.text(12, 12, 'scene_29 UI scaffold', { font: '16px Arial', color: '#ffffff' }).setDepth(1000);
        uiContainer.add(label);

        // Click debug: show pointer coordinates and a temporary marker
        const debugText = this.add.text(12, 48, '', { font: '14px Arial', color: '#00ff00' }).setDepth(1200);
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            debugText.setText(`x: ${Math.round(pointer.x)}, y: ${Math.round(pointer.y)}`);
            const mark = this.add.circle(pointer.x, pointer.y, 8, 0xff0000, 1).setDepth(1201);
            this.tweens.add({ targets: mark, alpha: 0, duration: 800, onComplete: () => { try { mark.destroy(); } catch (e) {} } });
        });

        // Drawing hitbox: rectangle (364,355) -> (767,526)
        const dx1 = 364, dy1 = 355, dx2 = 767, dy2 = 526;
        const dW = dx2 - dx1;
        const dH = dy2 - dy1;
        const dCX = dx1 + dW / 2;
        const dCY = dy1 + dH / 2;
        // visual outline for the drawing area
        const guide = this.add.graphics().setDepth(1199);
        guide.lineStyle(2, 0x00ff00, 0.6);
        guide.strokeRect(dx1, dy1, dW, dH);

        const drawZone = this.add.zone(dCX, dCY, dW, dH).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(1200);
        const drawRect = new Phaser.Geom.Rectangle(dx1, dy1, dW, dH);

        let isDrawing = false;
        let prevX = 0;
        let prevY = 0;
        const drawGfx = this.add.graphics().setDepth(1250);
        drawGfx.lineStyle(4, 0xff0000, 1);
        // simple drawing (no stroke counting)

        drawZone.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            isDrawing = true;
            prevX = Phaser.Math.Clamp(pointer.x, dx1, dx2);
            prevY = Phaser.Math.Clamp(pointer.y, dy1, dy2);
            // begin path by placing a small dot
            drawGfx.fillStyle(0xff0000, 1);
            drawGfx.fillCircle(prevX, prevY, 2);
        });

        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (!isDrawing) return;
            if (!drawRect.contains(pointer.x, pointer.y)) {
                isDrawing = false;
                return;
            }
            drawGfx.lineBetween(prevX, prevY, pointer.x, pointer.y);
            prevX = pointer.x;
            prevY = pointer.y;
        });

        this.input.on('pointerup', () => { isDrawing = false; });

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

        const dialogText = 'The incision line has been clearly marked and the body is now ready to be cut, doctor.';
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

        // Lower-right Next button (hidden until 3 drawn lines)
        const nextX = width - 96;
        const nextY = height - 72;
        const nbBg = this.add.rectangle(0, 0, 160, 48, 0x000000, 0.85).setOrigin(0.5).setDepth(1005);
        const nbTxt = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(1006);
        nbBg.setInteractive({ useHandCursor: true });
        const nbContainer = this.add.container(nextX, nextY, [nbBg, nbTxt]).setDepth(1005);
        nbContainer.setVisible(true);
        nbBg.on('pointerdown', () => {
            nbContainer.destroy();
            this.scene.start('scene_30');
        });
        

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene29;
