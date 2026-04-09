import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        // Load all project images used by the intro and scenes
        this.load.image('background', 'assets/bg.png');
        this.load.image('content_advisory', 'assets/content_advisory.png');
        this.load.image('intro_text', 'assets/intro_text.png');
        this.load.image('scene_1', 'assets/scene_1.png');
        this.load.image('scene_2', 'assets/scene_2.png');
        this.load.image('scene_3', 'assets/scene_3.png');
        this.load.image('scene_6', 'assets/scene_6.png');
        this.load.image('scene_8', 'assets/scene_8.png');
        this.load.image('scene_10', 'assets/scene_10.png');
        this.load.image('scene_11', 'assets/scene_11.png');
        this.load.image('scene_12', 'assets/scene_12.png');
        this.load.image('coronal_flap', 'assets/coronal_flap.png');
        this.load.image('placard', 'assets/placard.png');
        this.load.image('scene_15', 'assets/scene_15.png');
        this.load.image('skull_cut', 'assets/skull_cut.png');
        this.load.image('scene_18', 'assets/scene_18.png');
        this.load.image("skull_removal", "assets/skull_removal_actual.jpeg");
        // Preferentially load `brain_removal.png` if present (developer: add the PNG to public/assets/),
        // otherwise ensure a replacement image is available during testing.
        this.load.image('brain_removal', 'assets/brain_removal.png');
        // Ensure carousel images are loaded under the keys used by scene_19
        this.load.image('internal_bleeding', 'assets/internal_bleeding_brain.jpeg');
        this.load.image('no_internal_bleeding', 'assets/no_internal_bleeding_brain.jpeg');
        this.load.image('lab_tech', 'assets/lab_tech.png');
        this.load.image('optic_chiasm', 'assets/optic_chiasm.jpeg');
        this.load.image('scene_23', 'assets/scene_23.png');
    }

    create ()
    {
        // Verify important textures were loaded (logs appear in browser console)
        try {
            // eslint-disable-next-line no-console
            console.log('Boot: internal_bleeding exists=', this.textures.exists('internal_bleeding'));
            // eslint-disable-next-line no-console
            console.log('Boot: no_internal_bleeding exists=', this.textures.exists('no_internal_bleeding'));
            console.log('Boot: optic_chiasm exists=', this.textures.exists('optic_chiasm'));
            console.log('Boot: brain_removal exists=', this.textures.exists('brain_removal'));
            if (!this.textures.exists('brain_removal')) {
                // eslint-disable-next-line no-console
                console.warn('Boot: brain_removal not found — if you expect a PNG, add public/assets/brain_removal.png or map the key to an existing file.');
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.warn('Boot: texture check failed', e);
        }

        // Start the Intro scene (replaces missing Preloader)
        this.scene.start('Intro');
    }
}
