import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene40 extends Scene {
    constructor() { super('scene_40'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_40').setDisplaySize(width, height);
        const uiDepth = 1200;

        // Bottom-right Next button that opens the quiz UI
        const nextX = width - 96;
        const nextY = height - 72;
        const nbBg = this.add.rectangle(0, 0, 160, 48, 0x000000, 0.85).setOrigin(0.5).setDepth(uiDepth + 10).setInteractive({ useHandCursor: true });
        const nbTxt = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(uiDepth + 11);
        const nbContainer = this.add.container(nextX, nextY, [nbBg, nbTxt]).setDepth(uiDepth + 10);

        const openQuiz = () => {
            // semi-modal overlay container
            const overlay = this.add.container(0, 0).setDepth(uiDepth + 50);

            const cover = this.add.rectangle(width/2, height/2, width, height, 0x000000, 0.5).setDepth(uiDepth + 51);
            overlay.add(cover);

            const boxW = Math.min(600, width - 120);
            const startY = height * 0.24;
            const question = 'After lifting the rib cage, the chest cavity is now accessible. To ensure clear examination, which organs should be first removed?';
            const options = ['Heart', 'Lungs'];
            const correctIndex = 1; // Heart

            const questionText = this.add.text(width / 2, startY, question, { fontFamily: 'Arial', fontSize: '20px', color: '#ffffff', align: 'center', wordWrap: { width: boxW } }).setOrigin(0.5, 0).setDepth(uiDepth + 52);
            overlay.add(questionText);

            const optionHeight = 56;
            const gap = 12;
            let y = startY + questionText.height + 24;

            const optionRects: Phaser.GameObjects.Rectangle[] = [];
            const tooltip = this.add.text(0, 0, '', { fontFamily: 'Arial', fontSize: '16px', color: '#000000', backgroundColor: '#ffffff', padding: { x: 8, y: 6 } }).setDepth(uiDepth + 60).setVisible(false);

            const disableAll = () => optionRects.forEach(r => r.disableInteractive());
            const enableAll = () => optionRects.forEach(r => r.setInteractive({ useHandCursor: true }));

            options.forEach((opt, idx) => {
                const rect = this.add.rectangle(width / 2, y + optionHeight / 2, boxW, optionHeight, 0x222222).setStrokeStyle(2, 0xffffff).setDepth(uiDepth + 52).setInteractive({ useHandCursor: true });
                const txt = this.add.text(rect.x - boxW / 2 + 12, rect.y - optionHeight / 2 + 12, opt, { fontFamily: 'Arial', fontSize: '18px', color: '#ffffff' }).setDepth(uiDepth + 53);
                overlay.add([rect, txt]);
                optionRects.push(rect);

                rect.on('pointerup', () => {
                    const isCorrect = idx === correctIndex;
                    tooltip.setText(isCorrect ? 'Correct' : 'Wrong');
                    tooltip.setStyle({ backgroundColor: isCorrect ? '#7CFC00' : '#FF6961', color: '#000000' });
                    tooltip.setPosition(rect.x + boxW / 2 + 10, rect.y - tooltip.height / 2);
                    tooltip.setVisible(true);

                    disableAll();

                    if (isCorrect) {
                        this.time.delayedCall(700, () => {
                            overlay.destroy();
                            this.scene.start('scene_41');
                        });
                    } else {
                        this.time.delayedCall(700, () => {
                            tooltip.setVisible(false);
                            enableAll();
                        });
                    }
                });

                y += optionHeight + gap;
            });
        };

        nbBg.on('pointerdown', () => {
            openQuiz();
        });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene40;
