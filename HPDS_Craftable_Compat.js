//=============================================================================
// RPG Maker MZ - HPDS Craftable
//=============================================================================
/*:
 * @target MZ
 * @plugindesc Craft system for Yanfly compatability
 * @author High Plains Design Studio
 * 
 * @help HPDS_Craftable_Compat.js
 * The HPDS Crafting Menu allows the player to craft items
 * via a menu triggered by a plugin command. The player will
 * then be able to craft items of which the game party has the requirements.
 * In order to set Items, Weapons, and Armors as craftable, 
 * use the following tags in the notes.
 * 
 * <craftable>
 * Sets the item as craftable
 * 
 * <requires: item1, item2, etc>
 * Where item1, item2, and etc are exact names of database items.
 * At least one item is required in this tag.
 * 
 * <requiresCount: 1, 2, 4>
 * Where 1, 2, and 4 are the Number of item1, item2, and etc respectively.
 * Each required item requires a Number within this tag. 
 *  
 * This plugin provides a plugin command:
 * 
 * Call "Show Craftable Menu" to open the Crafting Menu. 
 * Use it from a crafting table like event.
 *
 * @command show
 * @text Show Craftable Menu
 * 
 */

( () => {


    var PluginName = 'HPDS_Craftable_Compat';
    PluginManager.registerCommand(PluginName, 'show', args => {
        SceneManager.push(HPDS_Craftable_Scene_Item);
    });

    

    /**
     * HPDS_Craftable_Scene_Item
     */
    function HPDS_Craftable_Scene_Item() {
        this.initialize(...arguments);
    }

    HPDS_Craftable_Scene_Item.prototype = Object.create(Scene_Item.prototype);
    HPDS_Craftable_Scene_Item.prototype.constructor = HPDS_Craftable_Scene_Item;

    HPDS_Craftable_Scene_Item.prototype.create = function() {
        Scene_Item.prototype.create.call(this);
        // this.createHelpWindow();
        // this.createCategoryWindow();
        // this.createItemWindow();

        // Scene_ItemBase.prototype.create.call(this);
        // this.createHelpWindow();
        // this.createCategoryWindow();
        // this.createItemWindow();
        // this.createActorWindow();

        this._helpWindow.setItem = function(item) {
            let message = "";
            item ? message = item.description + ' Requires: \n': message = '';
            // let message = item.description + ' Requires: \n';
            if (item !== null && item !== undefined) {
                const reqs = HPDS_Craftable_Statics.getItemReqs(item);
                // message += '   '
                reqs[0].forEach((name, i) => {
                    message += `${reqs[1][i]} x ${name}   `;
                });
            }
            this.setText(item ? message : "");
        };

        this._itemWindow.makeItemList = function() {
            // this._data = $gameParty.allItems().filter(item => this.includes(item)); // original line
            // this._data = $dataItems.filter(item => this.includes(item));
            this._data = $dataItems.concat($dataWeapons).concat($dataArmors).filter(item => this.includes(item));
            this._data = this._data.filter(item => Object.keys(item.meta).includes('craftable'));
    
            if (this.includes(null)) {
                this._data.push(null);
            }
        };

        this._itemWindow.isEnabled = function(item) {
            // return $gameParty.canUse(item);
            return this.canCraft(item);
        };

        this._itemWindow.canCraft = function(item) {
            const reqs = HPDS_Craftable_Statics.getItemReqs(item);
            let hasSupplies = [];
    
            // At this point, we have the reqs[] and the reqCount[] that hold Item Ids and the required number of those items.
            // Next, we have to determine if the party has the items.
            // Check if the $gameParty.numItems(item) is more than the required count
            const partyItems = $gameParty.allItems();
            reqs[0].forEach((requiredItem, i) => {
                partyItems.forEach((partyItem) => {
                    if (requiredItem === partyItem.name) {
                        // if the required item is included in the party's items, check if enough required items in party's items
                        if (reqs[1][i] <= $gameParty.numItems(partyItem)) {
                            hasSupplies[i] = true;
                        } else {
                            hasSupplies[i] = false;
                        }
                    } else {
                        hasSupplies[i] ? hasSupplies[i] = true : hasSupplies[i] = false;
                    }
                });
            })
            return !hasSupplies.includes(false);
        };

        this._itemWindow.setHandler("ok", this.onHPDSItemOk.bind(this));

        this._itemWindow.height += 100;
        // this._statusWindow.innerHeight += 100;
        // this._statusWindow.height += 100;
        // this._statusWindow.refresh();
        // this._statusWindow.innerHeight += 100;
        // this._statusWindow.contents.height += 100;
  
        // this.createActorWindow();
    }

    /**
     * HPDS_Craftable_Scene_Item.prototype.createHelpWindow created in order to display the requirements for crafting.
     * The text in the _helpWindow is set in HPDS_Craftable_Window_Help.prototype.setItem
     */
    // HPDS_Craftable_Scene_Item.prototype.createHelpWindow = function() {
    //     const rect = this.helpWindowRect();
    //     this._helpWindow = new HPDS_Craftable_Window_Help(rect);
    //     this.addWindow(this._helpWindow);
    // }

    // HPDS_Craftable_Scene_Item.prototype.createItemWindow = function() {
    //     // Scene_Item.prototype.createItemWindow.call(this);
    //     const rect = this.itemWindowRect();
    //     this._itemWindow = new HPDS_Craftable_Window_ItemList(rect);
    //     this._itemWindow.setHelpWindow(this._helpWindow);
    //     this._itemWindow.setHandler("ok", this.onHPDSItemOk.bind(this));
    //     this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
    //     this.addWindow(this._itemWindow);
    //     this._categoryWindow.setItemWindow(this._itemWindow);
    //     if (!this._categoryWindow.needsSelection()) {
    //         this._itemWindow.y -= this._categoryWindow.height;
    //         this._itemWindow.height += this._categoryWindow.height;
    //         this._categoryWindow.update();
    //         this._categoryWindow.hide();
    //         this._categoryWindow.deactivate();
    //         this.onCategoryOk();
    //     }
    // };

    /**
     * This probably needs to change in order to process crafting.
     */
    HPDS_Craftable_Scene_Item.prototype.onHPDSItemOk = function() {
        $gameParty.setLastItem(this.item());

        this._helpWindow.setText(`Craft ${this.item().name}?`);

        this._helpWindow.createHPDSCancelButton();
        this._helpWindow.createHPDSOkButton();

        // Click handlers for cancel and ok buttons.
        this._helpWindow._cancelButton.setClickHandler(() => {
            this.activateItemWindow();
            this._helpWindow._cancelButton.visible = false;
            this._helpWindow._okButton.visible = false;
        });
        this._helpWindow._okButton.setClickHandler(() => {
            // Consume requirements
            const reqs = HPDS_Craftable_Statics.getItemReqs(this.item());
            let partyItems = $gameParty.allItems();
            reqs[0].forEach((requiredItem, i) => {
                partyItems.forEach(partyItem => {
                    if (requiredItem === partyItem.name) $gameParty.loseItem(partyItem, reqs[1][i], true);
                });
            });
            $gameParty.gainItem(this.item(), 1);

            // Add crafted item to inventory

            // Activates the ItemWindow and removes the buttons.
            this.activateItemWindow();
            this._helpWindow._cancelButton.visible = false;
            this._helpWindow._okButton.visible = false;
        });
    };

    /**
     * HPDS_Craftable_Scene_Item.prototype.helpWindowRect has been commented out for 
     * Yanfly compatability issues.
     */
    // HPDS_Craftable_Scene_Item.prototype.helpWindowRect = function() {
    //     const wx = 0;
    //     const wy = this.helpAreaTop();
    //     const ww = Graphics.boxWidth;
    //     const wh = this.helpAreaHeight() + 100; // Added the 100
    //     return new Rectangle(wx, wy, ww, wh);
    // };

    HPDS_Craftable_Scene_Item.prototype.mainAreaHeight = function() {
        return Graphics.boxHeight - this.buttonAreaHeight() - this.helpAreaHeight() - 100; // subtracted 100 to make the help window bigger.
    };

    // added the next HPDS_Craftable_Scene_Item section in order to debug Yanfly stuff.
    // HPDS_Craftable_Scene_Item.prototype.createBackground = function() {
    //     this._backgroundFilter = new PIXI.filters.BlurFilter();
    //     this._backgroundSprite = new Sprite();
    //     this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    //     this._backgroundSprite.filters = [this._backgroundFilter];
    //     this.addChild(this._backgroundSprite);
    //     this.setBackgroundOpacity(192);
    // };

    // HPDS_Craftable_Scene_Item.prototype.updateActor = function() {
    //     this._actor = $gameParty.menuActor();
    // };

    // HPDS_Craftable_Scene_Item.prototype.createWindowLayer = function() {
    //     this._windowLayer = new WindowLayer();
    //     this._windowLayer.x = (Graphics.width - Graphics.boxWidth) / 2;
    //     this._windowLayer.y = (Graphics.height - Graphics.boxHeight) / 2;
    //     this.addChild(this._windowLayer);
    // };

    // HPDS_Craftable_Scene_Item.prototype.createCategoryWindow = function() {
    //     const rect = this.categoryWindowRect();
    //     this._categoryWindow = new Window_ItemCategory(rect);
    //     this._categoryWindow.setHelpWindow(this._helpWindow);
    //     this._categoryWindow.setHandler("ok", this.onCategoryOk.bind(this));
    //     this._categoryWindow.setHandler("cancel", this.popScene.bind(this));
    //     this.addWindow(this._categoryWindow);
    // };

    // HPDS_Craftable_Scene_Item.prototype.createActorWindow = function() {
    //     const rect = this.actorWindowRect();
    //     this._actorWindow = new Window_MenuActor(rect);
    //     this._actorWindow.setHandler("ok", this.onActorOk.bind(this));
    //     this._actorWindow.setHandler("cancel", this.onActorCancel.bind(this));
    //     this.addWindow(this._actorWindow);
    // };

    // HPDS_Craftable_Scene_Item.prototype.createButtons = function() {
    //     if (ConfigManager.touchUI) {
    //         if (this.needsCancelButton()) {
    //             this.createHPDSCancelButton();
    //         }
    //         if (this.needsPageButtons()) {
    //             this.createHPDSPageButtons();
    //         }
    //     }
    // };

    // HPDS_Craftable_Scene_Item.prototype.createHPDSCancelButton = function() {
    //     this._cancelButton = new Sprite_Button("cancel");
    //     this._cancelButton.x = Graphics.boxWidth - this._cancelButton.width - 4;
    //     this._cancelButton.y = this.buttonY();
    //     this.addWindow(this._cancelButton);
    // };

    // HPDS_Craftable_Scene_Item.prototype.createHPDSPageButtons = function() {
    //     this._pageupButton = new Sprite_Button("pageup");
    //     this._pageupButton.x = 4;
    //     this._pageupButton.y = this.buttonY();
    //     const pageupRight = this._pageupButton.x + this._pageupButton.width;
    //     this._pagedownButton = new Sprite_Button("pagedown");
    //     this._pagedownButton.x = pageupRight + 4;
    //     this._pagedownButton.y = this.buttonY();
    //     this.addWindow(this._pageupButton);
    //     this.addWindow(this._pagedownButton);
    //     this._pageupButton.setClickHandler(this.previousActor.bind(this));
    //     this._pagedownButton.setClickHandler(this.nextActor.bind(this));
    // };

    // HPDS_Craftable_Scene_Item.prototype.categoryWindowRect = function() {
    //     const wx = 0;
    //     const wy = this.mainAreaTop();
    //     const ww = Graphics.boxWidth;
    //     const wh = this.calcWindowHeight(1, true);
    //     return new Rectangle(wx, wy, ww, wh);
    // };

    // HPDS_Craftable_Scene_Item.prototype.mainAreaTop = function() {
    //     if (!this.isBottomHelpMode()) {
    //         return this.helpAreaBottom();
    //     } else if (this.isBottomButtonMode()) {
    //         return 0;
    //     } else {
    //         return this.buttonAreaBottom();
    //     }
    // };

    // HPDS_Craftable_Scene_Item.prototype.isBottomHelpMode = function() {
    //     return true;
    // };

    // HPDS_Craftable_Scene_Item.prototype.isBottomButtonMode = function() {
    //     return false;
    // };

    // HPDS_Craftable_Scene_Item.prototype.buttonAreaHeight = function() {
    //     return 52;
    // };

    // HPDS_Craftable_Scene_Item.prototype.itemWindowRect = function() {
    //     const wx = 0;
    //     const wy = this._categoryWindow.y + this._categoryWindow.height;
    //     const ww = Graphics.boxWidth;
    //     const wh = this.mainAreaBottom() - wy;
    //     return new Rectangle(wx, wy, ww, wh);
    // };

    
    /**
     * HPDS_Craftable_Window_ItemList
     */
    function HPDS_Craftable_Window_ItemList() {
        this.initialize(...arguments);
    }

    HPDS_Craftable_Window_ItemList.prototype = Object.create(Window_ItemList.prototype);
    HPDS_Craftable_Window_ItemList.prototype.constructor = HPDS_Craftable_Window_ItemList;

    // HPDS_Craftable_Window_ItemList.prototype.makeItemList = function() {
    //     // this._data = $gameParty.allItems().filter(item => this.includes(item)); // original line
    //     // this._data = $dataItems.filter(item => this.includes(item));
    //     this._data = $dataItems.concat($dataWeapons).concat($dataArmors).filter(item => this.includes(item));
    //     this._data = this._data.filter(item => Object.keys(item.meta).includes('craftable'));

    //     if (this.includes(null)) {
    //         this._data.push(null);
    //     }
    // };
    // Window_ItemList.prototype.makeItemList = function() {
    //     // this._data = $gameParty.allItems().filter(item => this.includes(item)); // original line
    //     // this._data = $dataItems.filter(item => this.includes(item));
    //     this._data = $dataItems.concat($dataWeapons).concat($dataArmors).filter(item => this.includes(item));
    //     this._data = this._data.filter(item => Object.keys(item.meta).includes('craftable'));

    //     if (this.includes(null)) {
    //         this._data.push(null);
    //     }
    // };

    /**
     * HPDS_Craftable_Window_ItemList.prototype.isEnabled determines if the item is lit up in the craftable menu.
     * It is called from Window_ItemList.prototype.drawItem(item);
     * @param {*} item 
     * @returns 
     */
    HPDS_Craftable_Window_ItemList.prototype.isEnabled = function(item) {
        // return $gameParty.canUse(item);
        return this.canCraft(item);
    };

    HPDS_Craftable_Window_ItemList.prototype.canCraft = function(item) {
        const reqs = HPDS_Craftable_Statics.getItemReqs(item);
        let hasSupplies = [];

        // At this point, we have the reqs[] and the reqCount[] that hold Item Ids and the required number of those items.
        // Next, we have to determine if the party has the items.
        // Check if the $gameParty.numItems(item) is more than the required count
        const partyItems = $gameParty.allItems();
        reqs[0].forEach((requiredItem, i) => {
            partyItems.forEach((partyItem) => {
                if (requiredItem === partyItem.name) {
                    // if the required item is included in the party's items, check if enough required items in party's items
                    if (reqs[1][i] <= $gameParty.numItems(partyItem)) {
                        hasSupplies[i] = true;
                    } else {
                        hasSupplies[i] = false;
                    }
                } else {
                    hasSupplies[i] ? hasSupplies[i] = true : hasSupplies[i] = false;
                }
            });
        })
        return !hasSupplies.includes(false);
    };

    // Yanfly compatability
    // HPDS_Craftable_Window_ItemList.prototype.fittingHeight = function(numLines) {
    //     return numLines * this.itemHeight() + $gameSystem.windowPadding() * 2;
    // };

    // HPDS_Craftable_Window_ItemList.prototype.itemHeight = function() {
    //     return this.lineHeight();
    // };

    // Window_ItemList.prototype.includes = function(item) {
    //     switch (this._category) {
    //         case "item":
    //             return DataManager.isItem(item) && item.itypeId === 1;
    //         case "weapon":
    //             return DataManager.isWeapon(item);
    //         case "armor":
    //             return DataManager.isArmor(item);
    //         case "keyItem":
    //             return DataManager.isItem(item) && item.itypeId === 2;
    //         default:
    //             return false;
    //     }
    // };
    
    /**
     * HPDS_Craftable_Window_Help
     */
    function HPDS_Craftable_Window_Help() {
        this.initialize(...arguments);
    }

    HPDS_Craftable_Window_Help.prototype = Object.create(Window_Help.prototype);
    HPDS_Craftable_Window_Help.prototype.constructor = HPDS_Craftable_Window_Help;

    HPDS_Craftable_Window_Help.prototype.setItem = function(item) {
        let message = "";
        if (item !== null) {
            const reqs = HPDS_Craftable_Statics.getItemReqs(item);
            message = '| '
            reqs[0].forEach((name, i) => {
                message += `${reqs[1][i]} x ${name} | `;
            });
        }
        this.setText(item ? message : "");
    };

    // HPDS_Craftable_Window_Help.prototype.createHPDSCancelButton = function() {
    //     if (ConfigManager.touchUI) {
    //         this._cancelButton = new Sprite_Button("cancel");
    //         this._cancelButton.visible = true;
    //         // TODO: Need to reposition the _cancelButton.
    //         this._cancelButton.move(this._cancelButton.x + 15, this._cancelButton.y + 143);
    //         this.addChild(this._cancelButton);
    //     }
    // };

    /**
     * Window_Help.prototype.createHPDSCancelButton added for Yanfly compatability.
     * It replaces HPDS_Craftable_Window.Help.prototype.createHPDSCancelButton
     */
    Window_Help.prototype.createHPDSCancelButton = function() {
        if (ConfigManager.touchUI) {
            this._cancelButton = new Sprite_Button("cancel");
            this._cancelButton.visible = true;
            // TODO: Need to reposition the _cancelButton.
            this._cancelButton.move(this._cancelButton.x + 250, this._cancelButton.y + 25);
            this.addChild(this._cancelButton);
        }
    };

    // HPDS_Craftable_Window_Help.prototype.createOkButton = function() {
    //     if (ConfigManager.touchUI) {
    //         this._okButton = new Sprite_Button("ok");
    //         this._okButton.visible = true;
    //         // TODO: Need to reposition the _cancelButton.
    //         this._okButton.move(this._okButton.x + 300, this._okButton.y + 143);
    //         this.addChild(this._okButton);
    //     }
    // };

    Window_Help.prototype.createHPDSOkButton = function() {
        if (ConfigManager.touchUI) {
            this._okButton = new Sprite_Button("ok");
            this._okButton.visible = true;
            // TODO: Need to reposition the _cancelButton.
            this._okButton.move(this._okButton.x + 400, this._okButton.y + 25);
            this.addChild(this._okButton);
        }
    };

    /**
     * HPDS_Craftable_Window_Message
     */
    function HPDS_Craftable_Window_Message() {
        this.initialize(...arguments);
    }

    HPDS_Craftable_Window_Message.prototype = Object.create(Window_Message.prototype);
    HPDS_Craftable_Window_Message.prototype.constructor = HPDS_Craftable_Window_Message;

    HPDS_Craftable_Window_Message.prototype.startMessage = function() {
        const text = $gameMessage.allText();
        const textState = this.createTextState(text, 0, 0, 0);
        textState.x = this.newLineX(textState);
        textState.startX = textState.x;
        this._textState = textState;
        this.newPage(this._textState);
        this.updatePlacement();
        this.updateBackground();
        this.open();
        this._choiceListWindow.start();
        // this._nameBoxWindow.start();
    };

    HPDS_Craftable_Window_Message.prototype.newPage = function(textState) {
        this.contents.clear();
        this.resetFontSettings();
        this.clearFlags();
        this.updateSpeakerName();
        this.loadMessageFace();
        textState.x = textState.startX;
        textState.y = 0;
        textState.height = this.calcTextHeight(textState);
    };

    HPDS_Craftable_Window_Message.prototype.update = function() {
        this.checkToNotClose();
        Window_Base.prototype.update.call(this);
        this.synchronizeNameBox();
        while (!this.isOpening() && !this.isClosing()) {
            if (this.updateWait()) {
                return;
            } else if (this.updateLoading()) {
                return;
            } else if (this.updateInput()) {
                return;
            } else if (this.updateMessage()) {
                return;
            } else if (this.canStart()) {
                this.startMessage();
            } else {
                this.startInput();
                return;
            }
        }
    };

    _alias_Window_ShopStatus_initialize = Window_ShopStatus.prototype.initialize;
    Window_ShopStatus.prototype.initialize = function(rect) {
        // Window_StatusBase.prototype.initialize.call(this, rect);
        // this._item = null;
        // this._pageIndex = 0;
        // this.refresh();
        rect = new Rectangle(456,216,352,400);
        _alias_Window_ShopStatus_initialize.call(this, rect)
    };

    /**
     * Static methods, currently only used for one thing and should probably be rewritten for scalability in the future.
     */
    class HPDS_Craftable_Statics {
        static getItemReqs(item) {
            let reqs = item.meta.requires.split(',');
            let reqCount = item.meta.requiresCount.split(',');
            reqs.forEach((name, index) => {
                reqs[index] = name.trim();
            });
            reqCount.forEach((count, index) => {
                reqCount[index] = parseInt(count.trim());
            });
            return [reqs, reqCount];
        }
    }
})();