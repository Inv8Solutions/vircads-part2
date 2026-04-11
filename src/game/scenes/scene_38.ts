import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene38 extends Scene {
    constructor() { super('scene_38'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_32').setDisplaySize(width, height);
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

        // Bottom-center dialog with provided content
        const dialogW = Math.min(760, Math.round(width * 0.8));
        const dialogPadding = 12;
        const dialogText = 'Using the rib cutter, cut the costal cartilages adjacent to the sternum from the 2nd to the 6th ribs on both sides.';
        const style: Phaser.Types.GameObjects.Text.TextStyle = { font: '18px Arial', color: '#ffffff', wordWrap: { width: dialogW - dialogPadding * 2 } };
        const txt = this.add.text(0, 0, dialogText, style).setOrigin(0.5, 0).setDepth(1200);
        const bgRect = this.add.graphics().setDepth(1199);
        const bgH = dialogPadding + txt.height + dialogPadding;
        bgRect.fillStyle(0x000000, 0.9);
        bgRect.fillRoundedRect(-dialogW / 2, 0, dialogW, bgH, 10);
        const dialogY = height - bgH - 28;
        const dialogContainer = this.add.container(width / 2, dialogY, [bgRect, txt]).setDepth(1200);
        txt.y = dialogPadding;

        // Multiple small hitboxes with red borders and checks
        const coords: Array<[number, number]> = [
            [988,178], [995,245], [990,303], [979,360], [971,414],
            [691,168], [685,239], [687,296], [697,363], [706,419]
        ];
        const size = 15;
        let remaining = coords.length;
        const clickedFlags: boolean[] = new Array(coords.length).fill(false);

        const showNextBtn = () => {
            const nextX = width - 96;
            const nextY = height - 72;
            const nbBg = this.add.rectangle(0, 0, 160, 48, 0x000000, 0.85).setOrigin(0.5).setDepth(1300).setInteractive({ useHandCursor: true });
            const nbTxt = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(1301);
            const nbContainer = this.add.container(nextX, nextY, [nbBg, nbTxt]).setDepth(1300);
            nbBg.on('pointerdown', () => {
                nbContainer.destroy();
                this.scene.start('scene_39');
            });
        };

        coords.forEach(([cx, cy], idx) => {
            // red border
            const outline = this.add.rectangle(cx, cy, size, size).setStrokeStyle(2, 0xff0000).setDepth(1250);

            // invisible interactive area
            const hit = this.add.rectangle(cx, cy, size, size, 0x000000, 0).setInteractive({ useHandCursor: true }).setDepth(1251);

            // check indicator (hidden until clicked)
            const checkContainer = this.add.container(cx, cy).setDepth(1252).setVisible(false);
            const checkBg = this.add.circle(0, 0, size / 2 + 2, 0x28a745).setDepth(1252);
            const checkText = this.add.text(0, 0, '✓', { font: '12px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(1253);
            checkContainer.add([checkBg, checkText]);

            hit.on('pointerup', () => {
                if (clickedFlags[idx]) return;
                clickedFlags[idx] = true;
                checkContainer.setVisible(true);
                remaining -= 1;
                if (remaining <= 0) showNextBtn();
            });
        });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene38;
