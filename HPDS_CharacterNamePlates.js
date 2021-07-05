/*:
 * @plugindesc HPDS_CharacterNamePlate places name plates above events.
 * @help HPDS_CharacterNamePlates.js
 * 
 * @author High Plains Design Studio
 * @target MZ
 * 
 * @command show
 * @text Show Name Plate
 * @desc Show the name plate.
 * 
 * @arg eventId
 * @type number
 * @desc the id of the event to receive a name plate.
 * 
 * @arg name
 * @type string
 * @desc The name to display above the event
 */

(() => {
    pluginName = 'HPDS_CharacterNamePlates'
    PluginManager.registerCommand(pluginName, 'show', args => {
        let id = args.eventId;
        let name = (args.name);
        console.log($gameMap.event(id).screenX());
    });
    /**
     * Variables
     */
    let namedEvents = []
    let nameWindows = [];


    /**
     * Alias Scene_Map.prototype.createDisplayObjects to create initial nameplates
     */
    _alias_HPDS_CharacterNamePlates_Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function() {
        // this.createSpriteset();
        // this.createWindowLayer();
        // this.createAllWindows();
        // this.createButtons();
        _alias_HPDS_CharacterNamePlates_Scene_Map_createDisplayObjects.call(this);
        namedEvents = $dataMap.events.filter(item => {
            if (item === null) return false;
            return Object.keys(item.meta).includes('named');
        });

        namedEvents.forEach((namedEvent, i) => {
            const rect = new Rectangle((namedEvent.x - 1) * 48, (namedEvent.y - 1) * 48, 3 * 48, 1 * 48);
            nameWindows[i] = new HPDS_CharacterNamePlates_Window_Base(rect);

            let backgroundType = '';
            if (namedEvent.meta.named === true) backgroundType = '0';
            if (namedEvent.meta.named !== true) backgroundType = namedEvent.meta.named.trim();
            switch(backgroundType) {
                case '1':
                    nameWindows[i].setBackgroundType(1);
                break;
                case '2':
                    nameWindows[i].setBackgroundType(2);
                break;
                default: nameWindows[i].setBackgroundType(0);
            }
            

            let textSize = nameWindows[i].textSizeEx(namedEvent.name);
            nameWindows[i].drawTextEx(namedEvent.name, (rect.width - textSize.width) / 2 - 12, (rect.height - textSize.height) / 2 - 12);
            // nameWindows[i].drawTextEx(namedEvent.name, rect.x, rect.y, 3*48);
            nameWindows[i].activate;
            this.addWindow(nameWindows[i]);
        });
    };

    _alias_HPDS_CharacterNamePlates_Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _alias_HPDS_CharacterNamePlates_Scene_Map_update.call(this);
        nameWindows.forEach((nameWindow, i) => {
            // nameWindow.move(namedEvents[i].realX - 25, namedEvents[i].realY - 25, nameWindow.width, nameWindow.height);
            // nameWindow.move((namedEvents[i].x - 1) * 48, (namedEvents[i].y - 1) * 48, 3 * 48, 1 * 48);
            nameWindow.move( ($gameMap.event(namedEvents[i].id)._realX - 1) * 48, ($gameMap.event(namedEvents[i].id)._realY - 1) * 48, 3 * 48, 1 *48);
        });
    }

    /**
     * HPDS_CharacterNamePlates_Window_Base
     */
    function HPDS_CharacterNamePlates_Window_Base () {
        this.initialize(...arguments);
    }

    HPDS_CharacterNamePlates_Window_Base.prototype = Object.create(Window_Base.prototype);
    HPDS_CharacterNamePlates_Window_Base.prototype.constructor = HPDS_CharacterNamePlates_Window_Base;

    // HPDS_CharacterNamePlates_Window_Base.prototype.lineHeight = function() {
    //     return 16;
    // };

    // HPDS_CharacterNamePlates_Window_Base.prototype.itemPadding = function() {
    //     return 2;
    // };

    // HPDS_CharacterNamePlates_Window_Base.prototype.drawTextEx = function(text, x, y, width) {
    //     this.resetFontSettings();
    //     this.contents.fontSize = 20;
    //     const textState = this.createTextState(text, x, y, width);
    //     this.processAllText(textState);
    //     return textState.outputWidth;
    // };

    HPDS_CharacterNamePlates_Window_Base.prototype.resetFontSettings = function() {
        this.contents.fontFace = $gameSystem.mainFontFace();
        // this.contents.fontSize = $gameSystem.mainFontSize();
        this.contents.fontSize = 20;
        this.resetTextColor();
    };

})();