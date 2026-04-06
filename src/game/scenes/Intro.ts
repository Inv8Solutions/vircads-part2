import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Intro extends Scene
{
    constructor ()
    {
        super('Intro');
    }
    create ()
    {
        const { width, height } = this.scale;

        // Only show the content advisory as the full-screen content
        this.add.image(width / 2, height / 2, 'content_advisory').setDisplaySize(width, height);

        // bottom-center dialog: Click to continue
        const dialogW = Math.min(480, Math.floor(width * 0.6));
        const dialogH = 48;
        const dialogX = width / 2;
        const dialogY = height - dialogH - 24;

        const gfx = this.add.graphics();
        gfx.fillStyle(0x000000, 0.6);
        gfx.fillRoundedRect(dialogX - dialogW / 2, dialogY - dialogH / 2, dialogW, dialogH, 8);

        const txt = this.add.text(dialogX, dialogY, 'Click to continue', { font: '18px Arial', color: '#ffffff' }).setOrigin(0.5);

        // interactive area for the dialog
        const zone = this.add.zone(dialogX, dialogY, dialogW, dialogH).setOrigin(0.5).setInteractive({ useHandCursor: true });
        zone.on('pointerdown', () => {
            this.scene.start('scene_1');
        });

        // Notify Vue the scene is ready
        EventBus.emit('current-scene-ready', this);
    }

}


export default Intro;
