import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene58 extends Scene {
    constructor() { super('scene_58'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_56').setDisplaySize(width, height);

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

       
        // Centered information dialog: General Timeline of Stomach Contents
        const dialogW = Math.min(880, Math.round(width * 0.8));
        const padding = 14;
        const content = `General Timeline of Stomach Contents\n\n0–1 Hour after meal: Food is still mostly in its ingested form, mixed with gastric acid.\n\n1–2 Hours: The food is starting to turn into a semi-liquid pulp (chyme). Roughly 40% or more of the meal has emptied into the small intestine, especially if it is low in fat.\n\n3–4 Hours: Most, if not all, food has been reduced to liquid or fine particles (smaller than 2–3 mm) and emptied.\n\n4+ Hours (Fasting State): The stomach is generally empty, though a small amount of residual gastric juice may remain.\n\nAfter death, the stomach stops working, thus leaving stomach contents that could provide clues for forensics by identifying the last meal and potentially the time of death.`;
        const style: Phaser.Types.GameObjects.Text.TextStyle = { font: '16px Arial', color: '#ffffff', wordWrap: { width: dialogW - padding * 2 }, align: 'left' };
        const infoText = this.add.text(0, 0, content, style).setOrigin(0.5, 0).setDepth(1200);
        const bg = this.add.graphics().setDepth(1199);
        const bgH = padding + infoText.height + padding;
        bg.fillStyle(0x000000, 0.92);
        bg.fillRoundedRect(-dialogW / 2, 0, dialogW, bgH, 10);
        const dialogY = Math.round(height / 2 - bgH / 2);
        const dialogContainer = this.add.container(width / 2, dialogY, [bg, infoText]).setDepth(1200);
        infoText.y = padding;

        // Bottom-right Next button
        const nextX = width - 96;
        const nextY = height - 72;
        const nbBg = this.add.rectangle(0, 0, 160, 48, 0x000000, 0.85).setOrigin(0.5).setDepth(1210);
        const nbTxt = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(1211);
        nbBg.setInteractive({ useHandCursor: true });
        const nbContainer = this.add.container(nextX, nextY, [nbBg, nbTxt]).setDepth(1210);
        nbBg.on('pointerdown', () => {
            try { dialogContainer.destroy(); } catch (e) {}
            try { nbContainer.destroy(); } catch (e) {}
            this.scene.start('scene_60');
        });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene58;
