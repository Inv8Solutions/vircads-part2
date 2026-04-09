import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene17 extends Scene {
    constructor() { super('scene_17'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_15').setDisplaySize(width, height);

        // Centered informational dialog
        const mainText = 'The skull is cut with a bone saw to create a "cap" that can be pried off, exposing the brain. When the cap is pulled off, the dura or the soft tissue membrane that covers the brain remains attached to the bottom of the skull cap. The brain is then exposed.';
        const subText = 'Valdes, R., & Kiger, P. J. (2018, September 13). How autopsies work. HowStuffWorks. https://science.howstuffworks.com/autopsy5.htm';

        const boxWidth = Math.min(width * 0.9, 760);
        const padding = 14;
        const mainStyle: Phaser.Types.GameObjects.Text.TextStyle = { font: '18px Arial', color: '#ffffff', align: 'center', wordWrap: { width: boxWidth - padding * 2 } };
        const subStyle: Phaser.Types.GameObjects.Text.TextStyle = { font: '14px Arial', color: '#cccccc', align: 'center', wordWrap: { width: boxWidth - padding * 2 } };

        const main = this.add.text(0, 0, mainText, mainStyle).setOrigin(0.5, 0);
        const sub = this.add.text(0, 0, subText, subStyle).setOrigin(0.5, 0);

        const totalH = padding + main.height + 8 + sub.height + padding;
        const bg = this.add.graphics();
        bg.fillStyle(0x000000, 0.92);
        bg.fillRoundedRect(-boxWidth / 2, 0, boxWidth, totalH, 10);

        const yPos = Math.round((height - totalH) / 2);
        const container = this.add.container(width / 2, yPos, [bg, main, sub]).setDepth(1000);
        main.y = padding;
        sub.y = main.y + main.height + 8;

        container.setSize(boxWidth, totalH);
        container.setInteractive(new Phaser.Geom.Rectangle(-boxWidth / 2, 0, boxWidth, totalH), Phaser.Geom.Rectangle.Contains);
        container.on('pointerdown', () => { container.destroy(); bg.destroy(); main.destroy(); sub.destroy(); });

        // Next button below the dialog
        const btnY = yPos + totalH + 12;
        const btnBg = this.add.rectangle(0, 0, 160, 48, 0x000000, 0.85).setOrigin(0.5).setDepth(1001);
        const btnTxt = this.add.text(0, 0, 'Next', { font: '16px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(1001);
        btnBg.setInteractive({ useHandCursor: true });
        const btnContainer = this.add.container(width / 2, btnY, [btnBg, btnTxt]).setDepth(1001);
        btnBg.on('pointerdown', () => {
            btnContainer.destroy();
            this.scene.start('scene_18');
        });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene17;
