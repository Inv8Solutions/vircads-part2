import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene30 extends Scene {
    constructor() { super('scene_30'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_29').setDisplaySize(width, height);

        // UI scaffold placeholder
        const uiContainer = this.add.container(0, 0).setDepth(1000);
        const label = this.add.text(12, 12, 'scene_30 UI scaffold', { font: '16px Arial', color: '#ffffff' }).setDepth(1000);
        uiContainer.add(label);

        // Center dialog with content and citation
        const dialogW = Math.min(900, Math.round(width * 0.8));
        const padding = 18;
        const text = `The internal examination starts with a large, deep, Y-shaped incision that is made from shoulder to shoulder meeting at the breast bone and extending all the way down to the pubic bone. When a woman is being examined, the Y-incision is curved around the bottom of the breasts before meeting at the breast bone.`;
        const subtext = `Valdes, R., & Kiger, P. J. (2018b, September 13). How autopsies work. HowStuffWorks. https://science.howstuffworks.com/autopsy5.htm`;

        const txtStyle: Phaser.Types.GameObjects.Text.TextStyle = { font: '18px Arial', color: '#ffffff', wordWrap: { width: dialogW - padding * 2 } };
        const subStyle: Phaser.Types.GameObjects.Text.TextStyle = { font: '14px Arial', color: '#cccccc', wordWrap: { width: dialogW - padding * 2 } };

        const bg = this.add.graphics().setDepth(1100);
        const approxText = this.add.text(0, 0, text, txtStyle).setOrigin(0.5).setDepth(1101);
        const approxSub = this.add.text(0, 0, subtext, subStyle).setOrigin(0.5).setDepth(1101);

        const totalH = padding + approxText.height + 8 + approxSub.height + padding;
        bg.fillStyle(0x000000, 0.9);
        bg.fillRoundedRect(-dialogW / 2, -totalH / 2, dialogW, totalH, 10);

        const container = this.add.container(width / 2, height / 2, [bg, approxText, approxSub]).setDepth(1100);
        approxText.y = - (approxSub.height / 2 + 6);
        approxSub.y = approxText.y + approxText.height / 2 + 12;

        // Bottom-right Next button
        const nextX = width - 96;
        const nextY = height - 72;
        const nbBg = this.add.rectangle(0, 0, 160, 48, 0x000000, 0.85).setOrigin(0.5).setDepth(1200);
        const nbTxt = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(1201);
        nbBg.setInteractive({ useHandCursor: true });
        const nbContainer = this.add.container(nextX, nextY, [nbBg, nbTxt]).setDepth(1200);
        nbBg.on('pointerdown', () => {
            nbContainer.destroy();
            this.scene.start('scene_31');
        });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene30;
