import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Scene61 extends Scene {
    constructor() { super('scene_61'); }

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

        
        // Show quiz UI with dim overlay
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.55).setOrigin(0).setDepth(1220);

        const quizW = Math.min(720, Math.round(width * 0.75));
        const quizPadding = 18;
        const qStyle: Phaser.Types.GameObjects.Text.TextStyle = { font: '20px Arial', color: '#ffffff', wordWrap: { width: quizW - quizPadding * 2 }, align: 'center' };
        const question = 'Considering all the injuries observed from the victims body, what is the most probable manner of death of the victim?';
        const qText = this.add.text(0, 0, question, qStyle).setDepth(1222).setOrigin(0.5, 0);

        const options = ['Accidental', 'Homicide', 'Suicide'];
        const optionContainers: Phaser.GameObjects.Container[] = [];
        const optionStyle: Phaser.Types.GameObjects.Text.TextStyle = { font: '18px Arial', color: '#ffffff' };

        const optionHeight = 48;
        const optionGap = 12;
        const totalH = quizPadding + qText.height + optionGap + options.length * (optionHeight + optionGap) + quizPadding;

        const quizBg = this.add.graphics().setDepth(1221);
        quizBg.fillStyle(0x000000, 0.95);
        quizBg.fillRoundedRect(-quizW / 2, -totalH / 2, quizW, totalH, 10);

        // create option rows
        options.forEach((opt, i) => {
            const bg = this.add.rectangle(0, 0, quizW - quizPadding * 2, optionHeight, 0x222222, 0.9).setOrigin(0.5).setDepth(1222);
            const txtOpt = this.add.text(0, 0, opt, optionStyle).setDepth(1223).setOrigin(0.5);
            const cont = this.add.container(0, 0, [bg, txtOpt]).setDepth(1222);
            optionContainers.push(cont);
        });

        const quizContainer = this.add.container(width / 2, Math.round(height / 2), [quizBg, qText, ...optionContainers]).setDepth(1222);
        qText.x = 0; qText.y = -totalH / 2 + quizPadding;

        const firstOptionCenterY = qText.y + qText.height + optionGap + optionHeight / 2;
        optionContainers.forEach((cont, i) => {
            cont.x = 0;
            cont.y = firstOptionCenterY + i * (optionHeight + optionGap);
            const bg = cont.list[0] as Phaser.GameObjects.Rectangle;
            const txtOpt = cont.list[1] as Phaser.GameObjects.Text;
            bg.setInteractive({ useHandCursor: true });
            bg.on('pointerdown', () => {
                // highlight selection
                optionContainers.forEach(c => { (c.list[0] as Phaser.GameObjects.Rectangle).setFillStyle(0x222222, 0.9); });
                bg.setFillStyle(0x3366ff, 1);
                // show Next button
                nextBtn.setVisible(true);
            });
        });

        // Next button for quiz
        const nextBtnBg = this.add.rectangle(0, 0, 140, 44, 0x000000, 0.9).setOrigin(0.5).setDepth(1224);
        const nextBtnTxt = this.add.text(0, 0, 'Next', { font: '18px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(1225);
        const nextBtn = this.add.container(width - 96, height - 72, [nextBtnBg, nextBtnTxt]).setDepth(1226);
        nextBtn.setVisible(false);
        (nextBtnBg as Phaser.GameObjects.Rectangle).setInteractive({ useHandCursor: true });
        nextBtnBg.on('pointerdown', () => {
            try { overlay.destroy(); } catch (e) {}
            try { quizContainer.destroy(); } catch (e) {}
            try { nextBtn.destroy(); } catch (e) {}
            this.scene.start('scene_62');
        });

        EventBus.emit('current-scene-ready', this);
    }
}

export default Scene61;
