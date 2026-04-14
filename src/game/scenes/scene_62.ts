import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene62 extends Scene {
    constructor() { super('scene_62'); }

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

        // top-center lab_tech dialog (image left, text right)
        const sidePad = 14;
        const labText = "Doctor, here are the organ samples collected earlier. I will place them in the refrigerator for preservation.";

        // make avatar larger and responsive
        const avatarSize = Math.min(140, Math.round(width * 0.12));
        const wrapW = Math.round(Math.min(640, width * 0.5));
        const labTxt = this.add.text(0, 0, labText, { font: '16px Arial', color: '#ffffff', wordWrap: { width: wrapW } }).setOrigin(0, 0).setDepth(1206);
        const avatarImg = this.add.image(0, 0, 'lab_tech').setDisplaySize(avatarSize, avatarSize).setDepth(1207);

        // compute sizes for rectangular box
        const contentW = avatarSize + 12 + labTxt.width;
        const boxW = Math.min(Math.max(contentW + sidePad * 2, 220), Math.round(width * 0.9));
        const boxH = Math.max(avatarSize + sidePad * 2, labTxt.height + sidePad * 2);

        const gLab = this.add.graphics().setDepth(1205);
        gLab.fillStyle(0x000000, 0.95);
        gLab.fillRect(-boxW / 2, -boxH / 2, boxW, boxH);

        // position image on left and text on right, vertically centered
        const leftX = -boxW / 2 + sidePad;
        avatarImg.x = leftX + avatarSize / 2;
        avatarImg.y = 0;

        labTxt.x = leftX + avatarSize + 12;
        labTxt.y = -labTxt.height / 2;

        const labX = Math.round(width / 2);
        const labY = Math.round(boxH / 2 + 24);
        const labContainer = this.add.container(labX, labY, [gLab, avatarImg, labTxt]).setDepth(1208);

        // Bottom-right Next button
        const nextX = width - 96;
        const nextY = height - 72;
        const nbBg = this.add.rectangle(0, 0, 160, 48, 0x000000, 0.85).setOrigin(0.5).setDepth(1210);
        const nbTxt = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(1211);
        nbBg.setInteractive({ useHandCursor: true });
        const nbContainer = this.add.container(nextX, nextY, [nbBg, nbTxt]).setDepth(1210);
        nbBg.on('pointerdown', () => {
            try { labContainer.destroy(); } catch (e) {}
            try { nbContainer.destroy(); } catch (e) {}
            this.scene.start('scene_63');
        });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene62;
