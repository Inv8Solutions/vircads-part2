import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene28 extends Scene {
    constructor() { super('scene_28'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_6').setDisplaySize(width, height);

        // UI scaffold placeholder
        const uiContainer = this.add.container(0, 0).setDepth(1000);
        const label = this.add.text(12, 12, 'scene_28 UI scaffold', { font: '16px Arial', color: '#ffffff' }).setDepth(1000);
        uiContainer.add(label);

        // Click debug: show pointer coordinates and a temporary marker
        const debugText = this.add.text(12, 48, '', { font: '14px Arial', color: '#00ff00' }).setDepth(1200);
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            debugText.setText(`x: ${Math.round(pointer.x)}, y: ${Math.round(pointer.y)}`);
            const mark = this.add.circle(pointer.x, pointer.y, 8, 0xff0000, 1).setDepth(1201);
            this.tweens.add({ targets: mark, alpha: 0, duration: 800, onComplete: () => { try { mark.destroy(); } catch (e) {} } });
        });

        // Dialog moved 50px below center
        const dialogW = Math.min(760, Math.round(width * 0.8));
        const padding = 12;
        const dialogText = 'To begin the internal body examination, obtain the scalpel from the autopsy tool tray.';
        const style: Phaser.Types.GameObjects.Text.TextStyle = { font: '16px Arial', color: '#ffffff', wordWrap: { width: dialogW - padding * 2 } };
        const textObj = this.add.text(0, 0, dialogText, style).setOrigin(0.5, 0).setDepth(1000);
        const dlgHeight = padding + textObj.height + padding;
        const bg = this.add.graphics().setDepth(1000);
        bg.fillStyle(0x000000, 0.9);
        bg.fillRoundedRect(-dialogW / 2, 0, dialogW, dlgHeight, 10);
        const containerY = Math.round(height / 2 + 50 - dlgHeight / 2);
        const topContainer = this.add.container(width / 2, containerY, [bg, textObj]).setDepth(1000);
        textObj.x = 0;
        textObj.y = padding;

        // Rectangular hitbox at coordinates (418,346) -> (507,427)
        const x1 = 418, y1 = 346, x2 = 507, y2 = 427;
        const hbW = x2 - x1;
        const hbH = y2 - y1;
        const hbX = x1 + hbW / 2;
        const hbY = y1 + hbH / 2;
        const rectZone = this.add.zone(hbX, hbY, hbW, hbH).setOrigin(0.5).setInteractive({ useHandCursor: true });
        rectZone.on('pointerdown', () => {
            rectZone.disableInteractive();
            try { topContainer.destroy(); } catch (e) {}
            try { uiContainer.destroy(); } catch (e) {}
            this.scene.start('scene_29');
        });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene28;
