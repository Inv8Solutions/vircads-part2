import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene35 extends Scene {
    constructor() { super('scene_35'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_32').setDisplaySize(width, height);

        const uiDepth = 1000;

        const question = "Which structure must be cut first to gain access to the thoracic and abdominal organs after incising the skin?";
        const options = ['Rib cage', 'Diaphragm', 'Sternum'];
        const correctIndex = 0; // Rib cage

        const padding = 24;
        const boxW = Math.min(600, width - padding * 2);
        const startY = height * 0.28;

        const questionText = this.add.text(width / 2, startY, question, {
            fontFamily: 'Arial', fontSize: '20px', color: '#ffffff', align: 'center', wordWrap: { width: boxW }
        }).setOrigin(0.5, 0).setDepth(uiDepth);

        // container for options
        const optsContainer = this.add.container(0, 0).setDepth(uiDepth);

        const optionHeight = 56;
        const gap = 12;
        const totalH = options.length * optionHeight + (options.length - 1) * gap;
        let y = startY + questionText.height + 24;

        const optionRects: Phaser.GameObjects.Rectangle[] = [];

        // tooltip text (reused)
        const tooltip = this.add.text(0, 0, '', { fontFamily: 'Arial', fontSize: '16px', color: '#000000', backgroundColor: '#ffffff', padding: { x: 8, y: 6 } }).setDepth(uiDepth + 1).setVisible(false);

        const disableAll = () => {
            optionRects.forEach(r => r.disableInteractive());
        };

        const enableAll = () => {
            optionRects.forEach(r => r.setInteractive({ useHandCursor: true }));
        };

        options.forEach((opt, idx) => {
            const rect = this.add.rectangle(width / 2, y + optionHeight / 2, boxW, optionHeight, 0x222222).setStrokeStyle(2, 0xffffff).setDepth(uiDepth).setInteractive({ useHandCursor: true });
            const txt = this.add.text(rect.x - boxW / 2 + 12, rect.y - optionHeight / 2 + 12, opt, { fontFamily: 'Arial', fontSize: '18px', color: '#ffffff' }).setDepth(uiDepth + 1);

            rect.on('pointerup', () => {
                // show tooltip near the option
                const isCorrect = idx === correctIndex;
                tooltip.setText(isCorrect ? 'Correct' : 'Wrong');
                tooltip.setStyle({ backgroundColor: isCorrect ? '#7CFC00' : '#FF6961', color: '#000000' });
                tooltip.setPosition(rect.x + boxW / 2 + 10, rect.y - tooltip.height / 2);
                tooltip.setVisible(true);

                disableAll();

                if (isCorrect) {
                    // small delay so player sees the tooltip
                    this.time.delayedCall(800, () => {
                        this.scene.start('scene_36');
                    });
                } else {
                    // hide tooltip and re-enable options so player can retry
                    this.time.delayedCall(800, () => {
                        tooltip.setVisible(false);
                        enableAll();
                    });
                }
            });

            optionRects.push(rect);
            optsContainer.add([rect, txt]);

            y += optionHeight + gap;
        });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene35;
