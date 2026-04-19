import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene12 extends Scene {
    constructor() {
        super('scene_12');
    }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_12').setDisplaySize(width, height);

        // Add placard image at specified coordinates and resize by -1rem from actual height
        // Requires 'placard' key to be preloaded in Boot.ts
        const placard = this.add.image(1074, 478, 'placard').setOrigin(0, 0);
        const pSrc: any = this.textures.get('placard')?.getSourceImage?.();
        const pW = (pSrc && pSrc.width) ? pSrc.width : (placard.width || 1);
        const pH = (pSrc && pSrc.height) ? pSrc.height : (placard.height || 1);
        const remPx = 16; // 1rem ≈ 16px
        const targetH = Math.max(1, pH - remPx);
        const pScale = targetH / pH;
        placard.setDisplaySize(Math.max(1, Math.round(pW * pScale)), Math.max(1, Math.round(pH * pScale)));

       

        // Bottom-right Next button
        const nextX = width - 96;
        const nextY = height - 72;
        const nbBg = this.add.rectangle(0, 0, 160, 48, 0x000000, 0.8).setOrigin(0.5).setDepth(1000);
        const nbTxt = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(1000);
        nbBg.setInteractive({ useHandCursor: true });
        const nbContainer = this.add.container(nextX, nextY, [nbBg, nbTxt]).setDepth(1000);
        nbBg.on('pointerdown', () => {
            nbContainer.destroy();
            // start the next scene (scene_13)
            this.scene.start('scene_13');
        });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene12;
