import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene23 extends Scene {
    constructor() { super('scene_23'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_23').setDisplaySize(width, height);
        // Center dialog about organ weight with citation
        const dialogW = Math.min(820, Math.round(width * 0.82));
        const padding = 14;
        const text = 'The organ weight plays a significant role in forming the opinion regarding the cause of death in various pathological conditions and the use of organ weight in autopsy aids the forensic pathologist, or in this case, the medico-legal officer in the detection of gross anatomical abnormalities and pathology. Organ weight can be a good diagnostic criterion during an autopsy if normality is accurately defined and known.';
        const subtext = 'Vaibhav, V., Meshram, R., Shukla, P. K., Kalonia, T., & Bhute, A. R. (2022b). A preliminary study of organ weight after histological exclusion of abnormality during autopsy in the adult population of Uttarakhand, India. Cureus, 14(7), e27044. https://doi.org/10.7759/cureus.27044';

        const mainStyle: Phaser.Types.GameObjects.Text.TextStyle = { font: '16px Arial', color: '#ffffff', wordWrap: { width: dialogW - padding * 2 } };
        const subStyle: Phaser.Types.GameObjects.Text.TextStyle = { font: '13px Arial', color: '#cccccc', wordWrap: { width: dialogW - padding * 2 } };

        const mainObj = this.add.text(0, 0, text, mainStyle).setOrigin(0.5, 0).setDepth(1000);
        const subObj = this.add.text(0, 0, subtext, subStyle).setOrigin(0.5, 0).setDepth(1000);

        const dlgHeight = padding + mainObj.height + 8 + subObj.height + padding;
        const bg = this.add.graphics().setDepth(999);
        bg.fillStyle(0x000000, 0.92);
        bg.fillRoundedRect(-dialogW / 2, 0, dialogW, dlgHeight, 10);

        const containerY = Math.round((height - dlgHeight) / 2 - 20);
        const dlgContainer = this.add.container(width / 2, containerY, [bg, mainObj, subObj]).setDepth(1000);
        mainObj.x = 0;
        mainObj.y = padding;
        subObj.x = 0;
        subObj.y = padding + mainObj.height + 8;

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
            bg.destroy();
            mainObj.destroy();
            subObj.destroy();
            this.scene.start('scene_24');
        });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene23;
