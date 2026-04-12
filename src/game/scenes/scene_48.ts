import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene48 extends Scene {
    constructor() { super('scene_48'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_6').setDisplaySize(width, height);
        // Click debug: show coords, log, and draw a temporary marker
        const debugText = this.add.text(12, height - 28, '', { font: '14px Arial', color: '#00ff00' }).setDepth(50);
        let marker: Phaser.GameObjects.Graphics | null = null;

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const x = Math.round(pointer.x);
            const y = Math.round(pointer.y);
            console.log('scene_48 pointerdown', x, y);
            debugText.setText(`x: ${x}, y: ${y}`);

            if (marker) { marker.destroy(); marker = null; }
            marker = this.add.graphics();
            marker.fillStyle(0xff0000, 1);
            marker.fillCircle(x, y, 6);

            this.time.delayedCall(800, () => { if (marker) { marker.destroy(); marker = null; } });
        });

        // Create interactive hitboxes for beaker and ladle
        let beakerClicked = false;
        let ladleClicked = false;

        const checkBoth = () => {
            if (beakerClicked && ladleClicked) showNextButton();
        };

        const makeHitbox = (x1: number, y1: number, x2: number, y2: number) => {
            const left = Math.min(x1, x2);
            const top = Math.min(y1, y2);
            const w = Math.abs(x2 - x1);
            const h = Math.abs(y2 - y1);
            const cx = Math.round(left + w / 2);
            const cy = Math.round(top + h / 2);

            // invisible interactive rectangle only (no visible border)
            const rect = this.add.rectangle(0, 0, w, h, 0x000000, 0).setOrigin(0.5).setInteractive();
            const container = this.add.container(cx, cy, [rect]).setDepth(60);

            let checked: Phaser.GameObjects.Text | null = null;

            rect.on('pointerdown', () => {
                if (checked) return;
                checked = this.add.text(0, 0, '✓', { font: '48px Arial', color: '#00ff66' }).setOrigin(0.5, 0.5).setDepth(61);
                container.add(checked);
            });

            return { container, rect, setChecked: () => { if (!checked) { checked = this.add.text(0, 0, '✓', { font: '48px Arial', color: '#00ff66' }).setOrigin(0.5, 0.5).setDepth(61); container.add(checked); } } };
        };

        const beaker = makeHitbox(418, 213, 511, 327);
        const ladle = makeHitbox(277, 321, 131, 447);

        // Hook clicks to update state and show checkmarks
        beaker.rect.on('pointerdown', () => { beakerClicked = true; checkBoth(); });
        ladle.rect.on('pointerdown', () => { ladleClicked = true; checkBoth(); });

        // Next button (hidden until both clicked)
        let nextBtn: Phaser.GameObjects.Container | null = null;
        const showNextButton = () => {
            if (nextBtn) return;
            const nextX = this.scale.width - 96;
            const nextY = this.scale.height - 72;
            const nbBg = this.add.rectangle(0, 0, 160, 48, 0x000000, 0.85).setOrigin(0.5).setDepth(70);
            const nbTxt = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(71);
            nbBg.setInteractive({ useHandCursor: true });
            const nbContainer = this.add.container(nextX, nextY, [nbBg, nbTxt]).setDepth(70);
            nbBg.on('pointerdown', () => {
                nbContainer.destroy();
                this.scene.start('scene_49');
            });
            nextBtn = nbContainer;
        };

        // Bottom-center dialog: instruction to take beaker and ladle
        const dialogW = Math.min(760, Math.round(width * 0.8));
        const paddingDlg = 12;
        const content = 'Take the beaker and ladle from the Autopsy tool tray.';
        const txtDlgStyle: Phaser.Types.GameObjects.Text.TextStyle = { font: '18px Arial', color: '#ffffff', wordWrap: { width: dialogW - paddingDlg * 2 }, align: 'center' };
        const dialogTxt = this.add.text(0, 0, content, txtDlgStyle).setOrigin(0.5, 0).setDepth(65);
        const bgH = paddingDlg + dialogTxt.height + paddingDlg;
        const bgDlg = this.add.graphics().setDepth(64);
        bgDlg.fillStyle(0x000000, 0.92);
        bgDlg.fillRoundedRect(-dialogW / 2, -bgH / 2, dialogW, bgH, 10);
        const dialogY = Math.round(height - (bgH / 2) - 24);
        const dialogContainer = this.add.container(width / 2, dialogY, [bgDlg, dialogTxt]).setDepth(65);
        dialogTxt.y = -bgH / 2 + paddingDlg;

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene48;
