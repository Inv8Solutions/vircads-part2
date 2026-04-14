import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene60 extends Scene {
    constructor() { super('scene_60'); }

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

        // Bottom-center dialog
        const dialogW = Math.min(760, Math.round(width * 0.8));
        const dialogPadding = 12;
        const dialogText = 'After inspection of the stomach, the kidney and adrenal glands should be removed for weighting and taking of samples. click to remove both kidneys';
        const style: Phaser.Types.GameObjects.Text.TextStyle = { font: '18px Arial', color: '#ffffff', wordWrap: { width: dialogW - dialogPadding * 2 }, align: 'center' };
        const txt = this.add.text(0, 0, dialogText, style).setOrigin(0.5).setDepth(1200);
        const bgRect = this.add.graphics().setDepth(1199);
        const bgH = dialogPadding + txt.height + dialogPadding;
        bgRect.fillStyle(0x000000, 0.9);
        bgRect.fillRoundedRect(-dialogW / 2, 0, dialogW, bgH, 10);
        const dialogY = height - bgH - 28;
        const dialogContainer = this.add.container(width / 2, dialogY, [bgRect, txt]).setDepth(1200);
        // center text vertically inside the background
        txt.setOrigin(0.5, 0.5);
        txt.y = Math.round(bgH / 2);

        // Next button (hidden until both kidneys removed)
        const nextX = width - 96;
        const nextY = height - 72;
        const nbBg = this.add.rectangle(0, 0, 160, 48, 0x000000, 0.85).setOrigin(0.5).setDepth(1210);
        const nbTxt = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(1211);
        const nbContainer = this.add.container(nextX, nextY, [nbBg, nbTxt]).setDepth(1210);
        nbContainer.setVisible(false);

        const makeHit = (x1: number, y1: number, x2: number, y2: number, onRemoved?: () => void) => {
            const left = Math.min(x1, x2);
            const top = Math.min(y1, y2);
            const w = Math.abs(x2 - x1);
            const h = Math.abs(y2 - y1);

            const border = this.add.graphics().setDepth(1205);
            border.lineStyle(3, 0xff0000, 1);
            border.strokeRect(left, top, w, h);

            const check = this.add.text(left + w - 12, top + 6, '✓', { font: '20px Arial', color: '#00ff00' }).setOrigin(1, 0).setDepth(1210);
            check.setVisible(false);

            const inset = 6;
            const hitW = Math.max(10, w - inset * 2);
            const hitH = Math.max(10, h - inset * 2);
            const hitX = left + w / 2;
            const hitY = top + h / 2;

            const hit = this.add.rectangle(hitX, hitY, hitW, hitH, 0x000000, 0).setDepth(1206).setInteractive({ useHandCursor: true });

            let removed = false;
            hit.on('pointerdown', () => {
                if (removed) return;
                removed = true;
                hit.disableInteractive();
                check.setVisible(true);
                this.tweens.add({ targets: border, alpha: 0, duration: 350, onComplete: () => { try { border.destroy(); } catch (e) {} } });
                if (onRemoved) onRemoved();
            });

            return { border, hit, check };
        };

        let removedCount = 0;
        const onKidRemoved = () => {
            removedCount += 1;
            if (removedCount >= 2) {
                nbContainer.setVisible(true);
                nbBg.setInteractive({ useHandCursor: true });
                this.tweens.add({ targets: nbContainer, alpha: 1, duration: 220 });
            }
        };

        // left kidney: 708,498 | 800,700
        makeHit(708, 498, 800, 700, onKidRemoved);
        // right kidney: 941,561 | 1046,678
        makeHit(941, 561, 1046, 678, onKidRemoved);

        nbBg.on('pointerdown', () => {
            try { dialogContainer.destroy(); } catch (e) {}
            try { nbContainer.destroy(); } catch (e) {}
            this.scene.start('scene_61');
        });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene60;
