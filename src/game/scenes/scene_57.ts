import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene57 extends Scene {
    constructor() { super('scene_57'); }

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

        
        // Centered quiz dialog — compute size to wrap content
        const quizW = Math.min(680, Math.round(width * 0.7));
        const quizPadding = 12;
        const question = "In estimating PMI, an empty stomach most likely indicates that the victim last ate:";
        const qText = this.add.text(0, 0, question, { font: '18px Arial', color: '#ffffff', wordWrap: { width: quizW - quizPadding * 2 }, align: 'center' }).setOrigin(0.5, 0).setDepth(1221);

        const options = [
            'Right before death',
            '4 hours or more before death',
            '2 hours after death'
        ];

        const optionContainers: Phaser.GameObjects.Container[] = [];
        const optionGap = 44;
        const optionHeight = 36;
        let tooltip: Phaser.GameObjects.Text | null = null;

        const optionsTotalHeight = optionHeight + optionGap * (options.length - 1);
        const totalH = quizPadding + qText.height + 8 + optionsTotalHeight + quizPadding;

        // container for the whole quiz modal
        const quizContainer = this.add.container(width / 2, height / 2).setDepth(1220);
        const quizBg = this.add.graphics();
        quizBg.fillStyle(0x111111, 0.96);
        quizBg.fillRoundedRect(-quizW / 2, -totalH / 2, quizW, totalH, 10);
        quizContainer.add(quizBg);

        // place question
        qText.x = 0;
        qText.y = -totalH / 2 + quizPadding;
        quizContainer.add(qText);

        let currentY = qText.y + qText.height + 8; // start Y inside container for first option (top of option)

        const resetOptions = () => {
            optionContainers.forEach(c => {
                const bg = c.getAt(0) as Phaser.GameObjects.Rectangle;
                bg.fillColor = 0x000000;
                bg.setAlpha(0.8);
                c.setInteractive();
            });
            if (tooltip) { try { tooltip.destroy(); } catch (e) {} tooltip = null; }
        };

        options.forEach((opt, idx) => {
            const contY = currentY + optionHeight / 2;
            const bg = this.add.rectangle(0, 0, quizW - quizPadding * 2, optionHeight, 0x000000, 0.8).setOrigin(0.5).setDepth(1221);
            const txtOpt = this.add.text(0, 0, opt, { font: '16px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(1222);
            const cont = this.add.container(0, contY, [bg, txtOpt]).setDepth(1221 + idx);
            quizContainer.add(cont);
            optionContainers.push(cont);
            currentY += optionGap;
        });

        optionContainers.forEach((cont, i) => {
            cont.setSize((quizW - quizPadding * 2), optionHeight);
            cont.setInteractive({ useHandCursor: true });
            cont.on('pointerdown', () => {
                const isCorrect = (i === 1);
                optionContainers.forEach(c => c.disableInteractive());
                if (!isCorrect) {
                    tooltip = this.add.text(width / 2, height / 2 + totalH / 2 + 12, 'Incorrect — try again', { font: '16px Arial', color: '#ff6666', backgroundColor: '#000000' }).setOrigin(0.5).setDepth(1230);
                    this.time.delayedCall(900, () => {
                        try { tooltip?.destroy(); } catch (e) {}
                        tooltip = null;
                        resetOptions();
                    });
                    return;
                }

                const ok = this.add.text(width / 2, height / 2 + totalH / 2 + 12, 'Correct', { font: '18px Arial', color: '#88ff88' }).setOrigin(0.5).setDepth(1230);
                // destroy quiz UI then advance
                try { quizContainer.destroy(); } catch (e) {}
                this.time.delayedCall(700, () => {
                    try { ok.destroy(); } catch (e) {}
                    this.scene.start('scene_58');
                });
            });
        });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene57;
