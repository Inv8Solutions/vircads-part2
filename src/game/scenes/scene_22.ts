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
        // create a bottom dialog instructing player to click the brain (shown before pressing)
        const dlgW2 = Math.min(760, Math.round(width * 0.8));
        const pad2 = 12;
        const msg = 'Please click on the brain to continue.';
        const msgStyle: Phaser.Types.GameObjects.Text.TextStyle = { font: '18px Arial', color: '#ffffff', wordWrap: { width: dlgW2 - pad2 * 2 }, align: 'center' };
        const msgTxt = this.add.text(0, 0, msg, msgStyle).setOrigin(0.5, 0).setDepth(1002);
        const dlgH2 = pad2 + msgTxt.height + pad2;
        const dlgBg2 = this.add.graphics().setDepth(1001);
        dlgBg2.fillStyle(0x000000, 0.95);
        dlgBg2.fillRoundedRect(-dlgW2 / 2, 0, dlgW2, dlgH2, 10);
        const dlgY2 = height - dlgH2 - 28;
        const clickDlgContainer = this.add.container(width / 2, dlgY2, [dlgBg2, msgTxt]).setDepth(1001);
        msgTxt.y = pad2;

        const hitRect = this.add.rectangle(hx1, hy1, hw, hh, 0x000000, 0).setOrigin(0, 0).setInteractive({ useHandCursor: true }).setDepth(1000);
        let nextShown = false;
        hitRect.on('pointerdown', () => {
            try {
                // remove the instruction dialog
                try { clickDlgContainer.destroy(); } catch (e) {}

                if (nextShown) return;
                nextShown = true;

                // show Bottom-right Next button to advance to scene_23
                const nextX = width - 96;
                const nextY = height - 72;
                const nbBg = this.add.rectangle(0, 0, 160, 48, 0x000000, 0.85).setOrigin(0.5).setDepth(1004);
                const nbTxt = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(1005);
                nbBg.setInteractive({ useHandCursor: true });
                const nbContainer = this.add.container(nextX, nextY, [nbBg, nbTxt]).setDepth(1004);
                nbBg.on('pointerdown', () => {
                    try { nbContainer.destroy(); } catch (e) {}
                    try { hitRect.destroy(); } catch (e) {}
                    this.scene.start('scene_23');
                });
            } catch (e) { /* ignore */ }
        });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene22;
