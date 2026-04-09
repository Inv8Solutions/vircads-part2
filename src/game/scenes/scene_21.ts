import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene21 extends Scene {
    constructor() { super('scene_21'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_18').setDisplaySize(width, height);

        // Center-top dialog: CUTTING OF OPTIC CHIASM
        const dialogW = Math.min(760, Math.round(width * 0.8));
        const padding = 14;
        const title = 'CUTTING OF OPTIC CHIASM';
        const notes = [
            'Cutting the optic chiasm separates the front  (anterior) of the skull from the rest, creating enough space to lift the brain out without force.',
            'Without this cut, pulling the brain through a small opening could tear delicate tissue, especially the frontal lobes and cranial nerves.',
            'It reduces stress on the olfactory bulbs, optic nerves, and brainstem, which are easily damaged during removal.',
            'The cut exposes internal landmarks, helping you see where the brain sits relative to the skull before removal.'
        ];

        const titleStyle: Phaser.Types.GameObjects.Text.TextStyle = { font: '18px Arial', color: '#ffffff' };
        const bodyStyle: Phaser.Types.GameObjects.Text.TextStyle = { font: '15px Arial', color: '#ffffff', wordWrap: { width: dialogW - padding * 2 } };

        const titleObj = this.add.text(0, 0, title, titleStyle).setOrigin(0.5, 0);
        const bulletText = notes.map(n => '• ' + n).join('\n\n');
        const bodyObj = this.add.text(0, 0, bulletText, bodyStyle).setOrigin(0.5, 0);

        const dlgHeight = padding + titleObj.height + 8 + bodyObj.height + padding;
        const bg = this.add.graphics().setDepth(1000);
        bg.fillStyle(0x000000, 0.92);
        bg.fillRoundedRect(-dialogW / 2, 0, dialogW, dlgHeight, 10);

        const containerY = 20;
        const dlgContainer = this.add.container(width / 2, containerY, [bg, titleObj, bodyObj]).setDepth(1000);
        titleObj.x = 0;
        titleObj.y = padding;
        bodyObj.x = 0;
        bodyObj.y = padding + titleObj.height + 8;

        // Lower-left: optic chiasm image (graceful placeholder if missing)
        const ocKey = 'optic_chiasm';
        // increase target size and allow modest upscaling (up to 2x)
        const maxW = Math.round(width * 0.32);
        const maxH = Math.round(height * 0.36);
        if (this.textures.exists(ocKey)) {
            const src: any = this.textures.get(ocKey).getSourceImage?.();
            const srcW = (src && src.width) ? src.width : 100;
            const srcH = (src && src.height) ? src.height : 100;
            const aScale = Math.min(2, maxW / srcW, maxH / srcH);
            const img = this.add.image(20, height - 20, ocKey).setOrigin(0, 1).setDepth(1000);
            img.setDisplaySize(Math.round(srcW * aScale), Math.round(srcH * aScale));
        } else {
            const phW = Math.max(140, maxW);
            const phH = Math.max(140, maxH);
            const ph = this.add.graphics().setDepth(1000);
            ph.fillStyle(0x333333, 0.95);
            ph.fillRoundedRect(20, height - 20 - phH, phW, phH, 6);
            const label = this.add.text(20 + 8, height - 20 - phH + 8, 'optic_chiasm MISSING', { font: '14px Arial', color: '#ffffff' }).setDepth(1001);
        }

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene21;
