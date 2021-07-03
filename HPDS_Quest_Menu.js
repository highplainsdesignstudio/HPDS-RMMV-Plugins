//=============================================================================
// RPG Maker MZ - HPDS Quest Menu
//=============================================================================
/*:
 * @target MZ
 * @plugindesc Quest system or whatever.
 * @author High Plains Design Studio
 *
 * @help HPDS_Quest_Menu.js
 *
 * This plugin adds a quest system and quests menu.
 * There are a few plugin commands. Figure them out for now.
 * 
 * @param questLabel
 * @text Quest Label
 * @desc Sets the label in the Quests menu.
 * @default Quests
 * 
 * @command show
 * @text Show Quests Menu Button
 * @desc Show the Quests Menu Button or not.
 * 
 * @arg showQuestsMenuButton
 * @type boolean
 * @default true
 * @text Show Quests?
 * @desc True or False
 * 
 * @command set
 * @text Set Quest
 * @desc Sets the name of the quest.
 * 
 * @arg name
 * @type string
 * @text Quest Name
 * @desc Text to set as a Quest Name
 * 
 * @arg text
 * @type multiline_string
 * @text Quest Text
 * @desc Text to set as the Quest Text in the Quest Menu.
 * 
 * @command remove
 * @text Remove Quest
 * @desc Removes the Quest from the Quests menu.
 * 
 * @arg name
 * @type string
 * @text Quest Name
 * @desc The name of the Quest to remove. This must match the name of an existing quest.
 */

( () => {
    /**
     * Variables.
     */
    var quests = [];
    var showQuestsMenuButton = 'true';
    const pluginName = "HPDS_Quest_Menu";
    let questText = "";
    var HPDS_Quest_Menu = {};
    HPDS_Quest_Menu.parameters = PluginManager.parameters(pluginName);

    /**
     * Plugin Commands
     */


    PluginManager.registerCommand(pluginName, 'show', args => {
        showQuestsMenuButton = (args.showQuestsMenuButton);
        // Scene_Map.createButtons();
    });

     PluginManager.registerCommand(pluginName, "set", args => {
        //  questText = String(args.text);
         quests.push({name: String(args.name), text: String(args.text)})
     });

     PluginManager.registerCommand(pluginName, 'remove', args => {
         let i = quests.findIndex(element => element.name === args.name);
        if(i > -1) quests.splice(i, 1);
     })

    /**
     * Alias Scene_Map_createButtons in order to call Scene_Map.prototype.createQuestsMenuButton().
     */
    _alias_Scene_Map_createButtons = Scene_Map.prototype.createButtons;
    Scene_Map.prototype.createButtons = function() {
        _alias_Scene_Map_createButtons.call(this);
        if (ConfigManager.touchUI) {
            // Determine if the QuestsMenuButton should be visible.
            if (showQuestsMenuButton === 'true' || showQuestsMenuButton === true) this.createQuestsMenuButton();
        }
    }

    /**
     * Alias Scene_Map.prototype.update to update the Quests menu in real time.
     */
    _alias_HPDS_Quest_Menu_Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _alias_HPDS_Quest_Menu_Scene_Map_update.call(this);
        if (showQuestsMenuButton === 'true' || showQuestsMenuButton === true) this.createQuestsMenuButton();
    }

    /**
     * Creates and adds the button on the map that opens the Quests menu. 
     */
    Scene_Map.prototype.createQuestsMenuButton = function() {
        // Creates this._questMenuButton. Sets the X, Y, and Visibility of the button.
        this._questMenuButton = new Sprite_Button("pagedown");
        this._questMenuButton.x = Graphics.boxWidth - this._questMenuButton.width - 60;
        this._questMenuButton.y = this.buttonY();
        this._questMenuButton.visible = true;

        // Sets the click handler for this._questMenuButton.
        this._questMenuButton.setClickHandler(() => {
            SoundManager.playOk();
            SceneManager.push(HPDS_Quest_Scene_MenuBase);
            Window_MenuCommand.initCommandPosition();
            $gameTemp.clearDestination();
            this._mapNameWindow.hide();
            this._waitCount = 2;
        });

        this.addWindow(this._questMenuButton);
    }

    // This is an example of how to call a scene.
    // Scene_Map.prototype.callMenu = function() {
    //     SoundManager.playOk();
    //     SceneManager.push(Scene_Menu);
    //     Window_MenuCommand.initCommandPosition();
    //     $gameTemp.clearDestination();
    //     this._mapNameWindow.hide();
    //     this._waitCount = 2;
    // };


     /**
      * HPDS_Quest_Scene_MenuBase constructor.
      * @class
      * @extends Scene_MenuBase
      */
     function HPDS_Quest_Scene_MenuBase() {
         this.initialize(...arguments);
     }

     HPDS_Quest_Scene_MenuBase.prototype = Object.create(Scene_MenuBase.prototype);
     HPDS_Quest_Scene_MenuBase.prototype.constructor = HPDS_Quest_Scene_MenuBase;

     HPDS_Quest_Scene_MenuBase.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    /**
     * Creates the HPDS_Quest_Scene_MenuBase cancel button. This sets the _cancelButton click handler to call SceneManager.pop().
     */
    HPDS_Quest_Scene_MenuBase.prototype.createCancelButton = function() {
        Scene_MenuBase.prototype.createCancelButton.call(this);
        this._cancelButton.setClickHandler(() => {
            SceneManager.pop();
            SoundManager.playCancel();
        })
    };

    HPDS_Quest_Scene_MenuBase.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createQuestLabel();
        this.createQuestWindowSelectable();
        this.createQuestHelp();
    }

    HPDS_Quest_Scene_MenuBase.prototype.createQuestHelp = function() {
        const rect = new Rectangle(350, 75, 416, 500);
        this._questHelp = new Window_Help(rect);
        this._questHelp.refresh();
        this.addWindow(this._questHelp);
    }

    HPDS_Quest_Scene_MenuBase.prototype.createQuestLabel = function() {
        const rect = new Rectangle(50, 0, 300, 75);
        this._questLabel = new Window_Help(rect);
        this.addWindow(this._questLabel);
        this._questLabel.setText(HPDS_Quest_Menu.parameters["questLabel"]);
    }

    HPDS_Quest_Scene_MenuBase.prototype.createQuestWindowSelectable = function() {
        const rect = new Rectangle(50, 75, 300, 500);
        this._questWindowSelectable = new HPDS_Quest_Window_Selectable(rect);
        this._questWindowSelectable.activate();
        this._questWindowSelectable.refresh();
        this._questWindowSelectable.select(0);

        this.addWindow(this._questWindowSelectable);
    }

    HPDS_Quest_Scene_MenuBase.prototype.update = function() {
        Scene_MenuBase.prototype.update.call(this);
        if (quests.length > 0) this._questHelp.setText(quests[this._questWindowSelectable.index()].text);

    }
    
    function HPDS_Quest_Window_Selectable() {
        this.initialize(...arguments);
    }

    HPDS_Quest_Window_Selectable.prototype = Object.create(Window_Selectable.prototype);
    HPDS_Quest_Window_Selectable.prototype.constructor = HPDS_Quest_Window_Selectable;

    HPDS_Quest_Window_Selectable.prototype.initialize = function(rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
    }

    HPDS_Quest_Window_Selectable.prototype.drawAllItems = function() {
        if (quests.length > 0) Window_Selectable.prototype.drawAllItems.call(this);
    }

    HPDS_Quest_Window_Selectable.prototype.drawItem = function(index) {
        var itemRect = this.itemRect(index);
        this.drawText(quests[index].name, itemRect.x, itemRect.y, itemRect.width / 2, itemRect.height / 2, 'center');
        // this.drawText("text", itemRect.x, itemRect.y, itemRect.width / 2, itemRect.height / 2, 'center');
        // this.drawTextEx("saddsa", 0, 0);
        // this.drawFace("Actor2", 1 + index, itemRect.x, itemRect.y, itemRect.width / 2, itemRect.height / 2);
    }

    // HPDS_Quest_Window_Selectable.prototype.maxPageRows = function() {
    //     return 5;
    // }

    HPDS_Quest_Window_Selectable.prototype.maxItems = function() {
        return quests.length;
    }

})();