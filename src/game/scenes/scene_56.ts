import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class Scene56 extends Scene {
    constructor() { super('scene_56'); }

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

        // Bottom-center dialog: prompt to click on the stomach
        const dialogW = Math.min(760, Math.round(width * 0.8));
        const dialogPadding = 12;
        const dialogText = 'Click on the stomach to inspect';
        const style: Phaser.Types.GameObjects.Text.TextStyle = { font: '18px Arial', color: '#ffffff', wordWrap: { width: dialogW - dialogPadding * 2 }, align: 'center' };
        const txt = this.add.text(0, 0, dialogText, style).setOrigin(0.5).setDepth(1200);
        const bgRect = this.add.graphics().setDepth(1199);
        const bgH = dialogPadding + txt.height + dialogPadding;
        bgRect.fillStyle(0x000000, 0.9);
        bgRect.fillRoundedRect(-dialogW / 2, 0, dialogW, bgH, 10);
        const dialogY = height - bgH - 28;
        const dialogContainer = this.add.container(width / 2, dialogY, [bgRect, txt]).setDepth(1200);
        txt.y = dialogPadding;

        // Invisible hitbox using explicit corner coordinates (absolute values)
        const x1 = 800; // left
        const y1 = 315; // top
        const x2 = 1108; // right
        const y2 = 637; // bottom
        const boxW = x2 - x1;
        const boxH = y2 - y1;
        const centerX = x1 + Math.round(boxW / 2);
        const centerY = y1 + Math.round(boxH / 2);

        // draw a visible border for the hitbox
        const border = this.add.graphics().setDepth(1201);
        const borderThickness = 3;
        border.lineStyle(borderThickness, 0xff0000, 1);
        border.strokeRect(x1, y1, boxW, boxH);

        // inset the interactive area so it's fully inside the border
        const inset = Math.max(4, Math.ceil(borderThickness));
        const innerW = Math.max(8, boxW - inset * 2);
        const innerH = Math.max(8, boxH - inset * 2);

        // Use a transparent Rectangle placed at top-left inside the border for reliable input
        const hitX = x1 + inset;
        const hitY = y1 + inset;
        const hitbox = this.add.rectangle(hitX, hitY, innerW, innerH, 0x000000, 0).setOrigin(0, 0).setDepth(1202);
        hitbox.setInteractive();

        // guard so the viewer only opens once
        let viewerOpened = false;
        hitbox.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (viewerOpened) return;
            viewerOpened = true;
            // disable further input on this hitbox to avoid re-opening
            try { hitbox.disableInteractive(); } catch (e) { /* ignore */ }
            // update bottom dialog to explain viewer interaction
            const viewerHint = 'click inside the 3d model viewer then move your cursor outside of it to rotate';
            txt.setText(viewerHint);
            // resize and redraw background to fit new text
            const newBgH = dialogPadding + txt.height + dialogPadding;
            bgRect.clear();
            bgRect.fillStyle(0x000000, 0.9);
            bgRect.fillRoundedRect(-dialogW / 2, 0, dialogW, newBgH, 10);
            const newDialogY = height - newBgH - 28;
            dialogContainer.y = newDialogY;
            txt.y = dialogPadding;

            // visual debug for click
            debugText.setText('hitbox clicked');
            const mark = this.add.circle(centerX, centerY, 6, 0x00ff00, 0.9).setDepth(1203);
            this.tweens.add({ targets: mark, alpha: 0, duration: 1000, onComplete: () => { try { mark.destroy(); } catch (e) {} } });

            // fade border to indicate used
            this.tweens.add({ targets: border, alpha: 0.35, duration: 600 });

            // Open a centered 3D viewer modal styled like previous scenes
            const modalW = Math.min(900, Math.round(width * 0.7));
            const dialogH = Math.min(620, Math.round(height * 0.7));
            const padding = 14;

            const bg = this.add.graphics().setDepth(1204);
            bg.fillStyle(0x000000, 0.92);
            bg.fillRoundedRect(-modalW / 2, -dialogH / 2, modalW, dialogH, 12);

            const title = this.add.text(0, -dialogH / 2 + padding, '3D Model Viewer', { font: '18px Arial', color: '#ffffff' }).setOrigin(0.5, 0).setDepth(1205);

            const vpW = modalW - padding * 2;
            const vpH = dialogH - padding * 2 - 32;
            const viewport = this.add.rectangle(0, 0, vpW, vpH, 0x111111, 0.85).setOrigin(0.5).setDepth(1205);
            viewport.setStrokeStyle(2, 0x444444, 1);

            const hint = this.add.text(0, 0, '3D model viewport (three.js / GLB)', { font: '14px Arial', color: '#cccccc' }).setOrigin(0.5).setDepth(1206);

            const container = this.add.container(width / 2, height / 2, [bg, title, viewport, hint]).setDepth(1204);
            viewport.y = 12;
            hint.y = viewport.y + vpH / 2 - 18;

            const vpBounds = {
                x: width / 2,
                y: height / 2 + viewport.y,
                width: vpW,
                height: vpH
            };

            // add a left-side dialog with `lab_tech` as the speaker
            const sidePad = 12;
            const labText = "The cadaver's stomach is empty, doc. Only a small amount of residual fluid is left.";
            const maxTextW = Math.min(260, Math.round(width * 0.16)) - sidePad * 2;
            const labTxt = this.add.text(0, 0, labText, { font: '16px Arial', color: '#ffffff', wordWrap: { width: maxTextW } }).setOrigin(0.5, 0).setDepth(1206);

            const avatarSize = Math.min(96, Math.round((Math.min(260, Math.round(width * 0.16))) * 0.6));
            const avatarImg = this.add.image(0, 0, 'lab_tech').setDisplaySize(avatarSize, avatarSize).setDepth(1207);

            const contentW = Math.max(labTxt.width, avatarSize);
            const boxW = Math.min(Math.max(contentW + sidePad * 2, 140), Math.round(width * 0.2));
            const contentHeight = labTxt.height + avatarSize + 8;
            const boxH = Math.min(Math.max(contentHeight + sidePad * 2, 60), Math.round(vpH * 0.95));

            const gLab = this.add.graphics().setDepth(1205);
            gLab.fillStyle(0x000000, 0.92);
            gLab.fillRoundedRect(-boxW / 2, -boxH / 2, boxW, boxH, 8);

            avatarImg.x = 0;
            avatarImg.y = -boxH / 2 + sidePad + avatarSize / 2;
            labTxt.x = 0;
            labTxt.y = -boxH / 2 + sidePad + avatarSize + 8;

            const labX = Math.round(width / 2 - modalW / 2 - boxW / 2 - 16);
            const labContainer = this.add.container(labX, Math.round(height / 2), [gLab, labTxt, avatarImg]).setDepth(1208);

            // launch the viewer inside the modal viewport and capture cleanup
            const viewer = this.initThreeGLB('assets/stomach.glb', vpBounds);

            // Bottom-right Next button to close modal and advance
            const nextX = width - 96;
            const nextY = height - 72;
            const nbBg = this.add.rectangle(0, 0, 160, 48, 0x000000, 0.85).setOrigin(0.5).setDepth(1210);
            const nbTxt = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(1211);
            nbBg.setInteractive({ useHandCursor: true });
            const nbContainer = this.add.container(nextX, nextY, [nbBg, nbTxt]).setDepth(1210);
            nbBg.on('pointerdown', () => {
                try { viewer?.cleanup(); } catch (e) { /* ignore */ }
                // remove modal and lab dialog
                try { container.destroy(); } catch (e) {}
                try { labContainer.destroy(); } catch (e) {}
                try { nbContainer.destroy(); } catch (e) {}
                try { border.destroy(); } catch (e) {}
                // proceed to next scene
                this.scene.start('scene_57');
            });
        });

        EventBus.emit('current-scene-ready', this);
    }

    private initThreeGLB(assetUrl: string, vp: { x: number; y: number; width: number; height: number }) {
        const parent = (this.game.canvas && (this.game.canvas as HTMLCanvasElement).parentElement) || document.body;
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio || 1);
        renderer.setSize(vp.width, vp.height);
        renderer.domElement.style.position = 'absolute';
        const canvasRect = (this.game.canvas as HTMLCanvasElement).getBoundingClientRect();
        const left = Math.round(canvasRect.left + vp.x - vp.width / 2 + window.scrollX);
        const top = Math.round(canvasRect.top + vp.y - vp.height / 2 + window.scrollY);
        renderer.domElement.style.left = `${left}px`;
        renderer.domElement.style.top = `${top}px`;
        renderer.domElement.style.pointerEvents = 'auto';
        const gameZStr = window.getComputedStyle(this.game.canvas as Element).zIndex || '0';
        const gameZ = Number.isNaN(parseInt(gameZStr, 10)) ? 0 : parseInt(gameZStr, 10);
        renderer.domElement.style.zIndex = String(gameZ + 1);
        parent.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, vp.width / vp.height, 0.1, 1000);
        camera.position.set(0, 1, 3);

        const ambient = new THREE.AmbientLight(0xffffff, 0.8);
        const dir = new THREE.DirectionalLight(0xffffff, 0.9);
        dir.position.set(2, 3, 4);
        scene.add(ambient, dir);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.07;
        controls.screenSpacePanning = false;
        controls.target.set(0, 0, 0);

        const stopPropagation = (e: Event) => { e.stopPropagation(); };
        renderer.domElement.addEventListener('pointerdown', stopPropagation);
        renderer.domElement.addEventListener('pointermove', stopPropagation);
        renderer.domElement.addEventListener('pointerup', stopPropagation);
        renderer.domElement.addEventListener('touchstart', stopPropagation);
        renderer.domElement.addEventListener('touchmove', stopPropagation);
        renderer.domElement.addEventListener('touchend', stopPropagation);

        const loader = new GLTFLoader();
        loader.load(
            assetUrl,
            (gltf) => {
                const model = gltf.scene || gltf.scenes?.[0];
                if (!model) {
                    console.warn('GLTF loaded but no scene found:', assetUrl);
                    return;
                }
                model.position.set(0, 0, 0);
                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3()).length();
                const scale = Math.max(0.5, 3.0 / size);
                model.scale.setScalar(scale);
                scene.add(model);
            },
            undefined,
            (err) => { console.warn('GLTF load failed:', assetUrl, err); }
        );

        const update = () => {
            controls.update();
            renderer.render(scene, camera);
        };
        this.events.on('update', update);

        const onWindowResize = () => {
            const canvasRect = (this.game.canvas as HTMLCanvasElement).getBoundingClientRect();
            const left = Math.round(canvasRect.left + vp.x - vp.width / 2 + window.scrollX);
            const top = Math.round(canvasRect.top + vp.y - vp.height / 2 + window.scrollY);
            renderer.domElement.style.left = `${left}px`;
            renderer.domElement.style.top = `${top}px`;
            renderer.setSize(vp.width, vp.height);
            camera.aspect = vp.width / vp.height;
            camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', onWindowResize);

        const cleanup = () => {
            try { this.events.off('update', update); } catch (e) {}
            try { renderer.domElement.removeEventListener('pointerdown', stopPropagation); } catch (e) {}
            try { renderer.domElement.removeEventListener('pointermove', stopPropagation); } catch (e) {}
            try { renderer.domElement.removeEventListener('pointerup', stopPropagation); } catch (e) {}
            try { renderer.domElement.removeEventListener('touchstart', stopPropagation); } catch (e) {}
            try { renderer.domElement.removeEventListener('touchmove', stopPropagation); } catch (e) {}
            try { renderer.domElement.removeEventListener('touchend', stopPropagation); } catch (e) {}
            try { controls.dispose(); } catch (e) {}
            try { renderer.dispose(); } catch (e) {}
            try { renderer.domElement.remove(); } catch (e) {}
            try { window.removeEventListener('resize', onWindowResize); } catch (e) {}
        };

        this.events.once('shutdown', cleanup);
        return { renderer, cleanup };
    }
}

export default Scene56;
