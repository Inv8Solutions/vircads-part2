import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

export class Scene25 extends Scene {
    constructor() { super('scene_25'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_23').setDisplaySize(width, height);

        // Center dialog container for 3D model viewer
        const dialogW = Math.min(900, Math.round(width * 0.7));
        const dialogH = Math.min(620, Math.round(height * 0.7));
        const padding = 14;

        const bg = this.add.graphics().setDepth(1000);
        bg.fillStyle(0x000000, 0.92);
        bg.fillRoundedRect(-dialogW / 2, -dialogH / 2, dialogW, dialogH, 12);

        const title = this.add.text(0, -dialogH / 2 + padding, '3D Model Viewer', { font: '18px Arial', color: '#ffffff' }).setOrigin(0.5, 0).setDepth(1001);

        const vpW = dialogW - padding * 2;
        const vpH = dialogH - padding * 2 - 32;
        const viewport = this.add.rectangle(0, 0, vpW, vpH, 0x111111, 0.85).setOrigin(0.5).setDepth(1001);
        viewport.setStrokeStyle(2, 0x444444, 1);

        const hint = this.add.text(0, 0, '3D model viewport (three.js / OBJ)', { font: '14px Arial', color: '#cccccc' }).setOrigin(0.5).setDepth(1002);

        const container = this.add.container(width / 2, height / 2, [bg, title, viewport, hint]).setDepth(1000);
        viewport.y = 12;
        hint.y = viewport.y + vpH / 2 - 18;

        // Store bounds for 3D renderer hookup
        const vpBounds = {
            x: width / 2,
            y: height / 2 + viewport.y,
            width: vpW,
            height: vpH
        };
        this.data.set('modelViewport', vpBounds);

        // 3D OBJ scaffold: drop a .obj into public/assets and update OBJ_URL below
        const OBJ_URL = 'assets/your_model.obj';
        const ENABLE_3D = true;
        if (ENABLE_3D) {
            this.initThreeOBJ(OBJ_URL, vpBounds);
        }

        // Top-middle dialog: description
        const topW = Math.min(640, Math.round(width * 0.6));
        const topPad = 12;
        const topText = 'This is a model of the extracted brain';
        const topStyle: Phaser.Types.GameObjects.Text.TextStyle = { font: '16px Arial', color: '#ffffff', wordWrap: { width: topW - topPad * 2 } };
        const topObj = this.add.text(0, 0, topText, topStyle).setOrigin(0.5, 0).setDepth(1002);
        const topH = topPad + topObj.height + topPad;
        const topBg = this.add.graphics().setDepth(1001);
        topBg.fillStyle(0x000000, 0.9);
        topBg.fillRoundedRect(-topW / 2, 0, topW, topH, 8);
        const topY = 18;
        const topContainer = this.add.container(width / 2, topY, [topBg, topObj]).setDepth(1002);
        topObj.x = 0; topObj.y = topPad;

        // Bottom-center dialog: interaction hint
        const botW = Math.min(520, Math.round(width * 0.5));
        const botPad = 10;
        const botText = 'click and drag the model to rotate';
        const botStyle: Phaser.Types.GameObjects.Text.TextStyle = { font: '15px Arial', color: '#ffffff', wordWrap: { width: botW - botPad * 2 } };
        const botObj = this.add.text(0, 0, botText, botStyle).setOrigin(0.5, 0).setDepth(1002);
        const botH = botPad + botObj.height + botPad;
        const botBg = this.add.graphics().setDepth(1001);
        botBg.fillStyle(0x000000, 0.9);
        botBg.fillRoundedRect(-botW / 2, 0, botW, botH, 8);
        const botY = height - botH - 18;
        const botContainer = this.add.container(width / 2, botY, [botBg, botObj]).setDepth(1002);
        botObj.x = 0; botObj.y = botPad;

        // Lower-right Next button
        const nextX = width - 96;
        const nextY = height - 72;
        const nbBg = this.add.rectangle(0, 0, 160, 48, 0x000000, 0.85).setOrigin(0.5).setDepth(1005);
        const nbTxt = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(1006);
        nbBg.setInteractive({ useHandCursor: true });
        const nbContainer = this.add.container(nextX, nextY, [nbBg, nbTxt]).setDepth(1005);
        nbBg.on('pointerdown', () => {
            nbContainer.destroy();
            // start the next scene (scene_26)
            this.scene.start('scene_26');
        });

        EventBus.emit('current-scene-ready', this);
    }

    private initThreeOBJ(objUrl: string, vp: { x: number; y: number; width: number; height: number }) {
        const parent = this.game.canvas.parentElement || document.body;
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio || 1);
        renderer.setSize(vp.width, vp.height);
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.left = `${Math.round(vp.x - vp.width / 2)}px`;
        renderer.domElement.style.top = `${Math.round(vp.y - vp.height / 2)}px`;
        renderer.domElement.style.pointerEvents = 'none';
        parent.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, vp.width / vp.height, 0.1, 1000);
        camera.position.set(0, 1, 3);

        const ambient = new THREE.AmbientLight(0xffffff, 0.8);
        const dir = new THREE.DirectionalLight(0xffffff, 0.9);
        dir.position.set(2, 3, 4);
        scene.add(ambient, dir);

        const loader = new OBJLoader();
        loader.load(
            objUrl,
            (obj) => {
                obj.position.set(0, 0, 0);
                scene.add(obj);
            },
            undefined,
            () => {
                // eslint-disable-next-line no-console
                console.warn('OBJ load failed:', objUrl);
            }
        );

        const update = () => {
            renderer.render(scene, camera);
        };
        this.events.on('update', update);
        this.events.once('shutdown', () => {
            this.events.off('update', update);
            renderer.dispose();
            renderer.domElement.remove();
        });
    }
}

export default Scene25;
