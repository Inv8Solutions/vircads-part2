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
    }

    create ()
    {
        // Start the Intro scene (replaces missing Preloader)
        this.scene.start('Intro');
    }
}
