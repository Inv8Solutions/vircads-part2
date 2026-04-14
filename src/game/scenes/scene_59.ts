import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene59 extends Scene {
    constructor() { super('scene_59'); }

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

       
       
        // Show full-size open stomach image with caption inside a styled dialog
        const imgKey = 'open_stomach';
        const dialogW = Math.min(880, Math.round(width * 0.8));
        const padding = 14;
        const tex = this.textures.get(imgKey);
        const img = this.add.image(0, 0, imgKey).setOrigin(0.5, 0).setDepth(1202);
        // determine display size, clamp to dialog inner area
        let dispW = img.width;
        let dispH = img.height;
        if (tex && tex.getSourceImage) {
            const src = tex.getSourceImage() as HTMLImageElement | HTMLCanvasElement | undefined;
            if (src && (src.width || src.height)) {
                const naturalW = src.width || img.width;
                const naturalH = src.height || img.height;
                const maxW = Math.max(100, dialogW - padding * 2);
                const maxH = Math.max(100, Math.round(height * 0.6));
                const scale = Math.min(1, maxW / naturalW, maxH / naturalH);
                dispW = Math.round(naturalW * scale);
                dispH = Math.round(naturalH * scale);
                img.setDisplaySize(dispW, dispH);
            }
        }

        const caption = this.add.text(0, 0, 'actual image', { font: '16px Arial', color: '#ffffff' }).setOrigin(0.5, 0).setDepth(1203);

        const dialogInnerH = padding + dispH + 8 + caption.height + padding;
        const bg = this.add.graphics().setDepth(1199);
        bg.fillStyle(0x000000, 0.92);
        bg.fillRoundedRect(-dialogW / 2, -dialogInnerH / 2, dialogW, dialogInnerH, 10);

        const dialogContainer = this.add.container(width / 2, Math.round(height / 2), [bg, img, caption]).setDepth(1200);
        img.x = 0; img.y = -dialogInnerH / 2 + padding;
        caption.x = 0; caption.y = img.y + dispH + 8;

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

export default Scene59;
