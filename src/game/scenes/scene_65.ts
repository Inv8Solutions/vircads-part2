import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene65 extends Scene {
    constructor() { super('scene_65'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_62').setDisplaySize(width, height);

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

       
        

        // Show autopsy report in a centered container
        try {
            const reportKey = 'autopsy_report';
            const showReport = () => {
                try {
                    const img = this.add.image(0, 0, reportKey).setOrigin(0.5).setDepth(1201);
                    // display at 65% of natural image size
                    const iw = img.width as number;
                    const ih = img.height as number;
                    const scale = 0.65;
                    const displayW = Math.round(iw * scale);
                    const displayH = Math.round(ih * scale);
                    img.setDisplaySize(displayW, displayH);
                    img.setPosition(0, 0);

                    const pad = 12;
                    const bgW = Math.round(displayW + pad * 2);
                    const bgH = Math.round(displayH + pad * 2);

                    const bg = this.add.graphics().setDepth(1200);
                    bg.fillStyle(0x000000, 0.95);
                    bg.fillRoundedRect(-bgW / 2, -bgH / 2, bgW, bgH, 10);

                    const container = this.add.container(width / 2, height / 2, [bg, img]).setDepth(1200);
                    // allow clicking the report to remove it
                    img.setInteractive();
                    img.on('pointerdown', () => { try { container.destroy(); bg.destroy(); img.destroy(); } catch (e) {} });
                } catch (e) { /* ignore show errors */ }
            };

            if (!this.textures.exists(reportKey)) {
                this.load.image(reportKey, '/assets/documentation_body/autopsy_report.png');
                this.load.once('complete', () => { showReport(); });
                this.load.start();
            } else {
                showReport();
            }
        } catch (e) { /* ignore autopsy report errors */ }

        try {
            const btnW = 140; const btnH = 48; const pad = 20;
            const bx = width - btnW / 2 - pad; const by = height - btnH / 2 - pad;
            const nextContainer = this.add.container(bx, by).setDepth(90);
            const bg = this.add.graphics();
            bg.fillStyle(0x222222, 0.95);
            bg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);
            bg.lineStyle(2, 0xffffff, 0.9);
            bg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);
            const label = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(91);
            nextContainer.add([bg, label]);
            bg.setInteractive(new Phaser.Geom.Rectangle(-btnW/2, -btnH/2, btnW, btnH), Phaser.Geom.Rectangle.Contains);
            bg.on('pointerdown', () => {
                try {
                    const dlgW = Math.min(760, Math.round(width * 0.8));
                    const dlgPad = 16;
                    const msg = 'CONGRATULATIONS! you have completed the autopsy process';
                    const msgStyle: Phaser.Types.GameObjects.Text.TextStyle = { font: '18px Arial', color: '#ffffff', wordWrap: { width: dlgW - dlgPad * 2 }, align: 'center' };
                    const msgTxt = this.add.text(0, 0, msg, msgStyle).setOrigin(0.5).setDepth(2000);
                    const dlgH = dlgPad + msgTxt.height + dlgPad + 52;
                    const dlgBg = this.add.graphics().setDepth(1999);
                    dlgBg.fillStyle(0x0b0b0b, 0.95);
                    dlgBg.fillRoundedRect(-dlgW / 2, 0, dlgW, dlgH, 12);
                    const dlgY = Math.round((height - dlgH) / 2);
                    const dlgContainer = this.add.container(width / 2, dlgY, [dlgBg, msgTxt]).setDepth(1999);
                    msgTxt.y = dlgPad;

                    // OK button
                    const btnW = 120; const btnH = 44;
                    const btnBg = this.add.graphics().setDepth(2001);
                    btnBg.fillStyle(0x222222, 0.95);
                    btnBg.fillRoundedRect(-btnW / 2, dlgH - btnH - dlgPad, btnW, btnH, 8);
                    btnBg.lineStyle(2, 0xffffff, 0.9);
                    btnBg.strokeRoundedRect(-btnW / 2, dlgH - btnH - dlgPad, btnW, btnH, 8);
                    const btnLabel = this.add.text(0, dlgH - btnH - dlgPad + btnH / 2, 'OK', { font: '18px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(2002);
                    dlgContainer.add([btnBg, btnLabel]);
                    btnBg.setInteractive(new Phaser.Geom.Rectangle(-btnW/2, dlgH - btnH - dlgPad, btnW, btnH), Phaser.Geom.Rectangle.Contains);
                    btnBg.on('pointerdown', () => { try { dlgContainer.destroy(); } catch (e) {} });
                } catch (e) { /* ignore */ }
            });
        } catch (e) { /* ignore next button errors */ }

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene65;
