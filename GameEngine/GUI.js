//The GUI enforces a singleton pattern. It features a series of pages that can be
//loaded/hidden with the provided functions, along with their elements
class GUI {

    static previousPage;

    //Singleton getter for the GUI instance
    static getGUI() {
        if(!GUI.instance)
        {
            GUI.instance = {};
            GUI.instance = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI();

            //Initialize menu sound
            GUI.menuClickSound = new BABYLON.Sound("victory", "Sounds/menuClick.wav", GameEngine.scene);
            GUI.countDownTickSound = new BABYLON.Sound("victory", "Sounds/countDownTick.wav", GameEngine.scene);
            GUI.nextLevelSound = new BABYLON.Sound("victory", "Sounds/levelStart.wav", GameEngine.scene);
        }
        return GUI.instance
    }

    //Object launch charging progress bar
    static objectLaunchForceProgressBar;
    static getObjectLaunchForceProgressBar() {
        if(GUI.objectLaunchForceProgressBar) return GUI.objectLaunchForceProgressBar
        var progressBar;

        progressBar = new BABYLON.GUI.Rectangle();
        progressBar.width = 0.5;
        progressBar.height = "2.5%";
        progressBar.verticalAlignment = 1;
        progressBar.top = "-10%";
        progressBar.isVisible = false;
        progressBar.background = new BABYLON.Color3(0,0,0);
        GUI.getGUI().addControl( progressBar );
    
        progressBar.inner = new BABYLON.GUI.Rectangle();
        progressBar.inner.width = 0;
        progressBar.inner.height = "100%"; // progressBar.height - (progressBar.thickness *2 )
        progressBar.inner.thickness = 0;
        progressBar.inner.horizontalAlignment = 0;
        progressBar.inner.isVisible = true;
        progressBar.inner.background = "red";
        progressBar.addControl( progressBar.inner );
    
        //Set a value for the bar
        progressBar.setValue = function(progress = 0, maxProgress, minProgress) {
            if(minProgress)
            {
                progress-=minProgress
                maxProgress-=minProgress
            }
            progressBar.inner.width = progress/maxProgress;
        };
    
        progressBar.show = function(progress, maxProgress, minProgress) {
            if(progress) { progressBar.setValue(progress, maxProgress, minProgress) }
            progressBar.isVisible = true;
        };
    
        progressBar.hide = function() {
            progressBar.isVisible = false;
        };
    
        GUI.objectLaunchForceProgressBar = progressBar
        return progressBar
    }
    
    //Overlay that shows the current score at the top of the screen
    static scoreOverlay;
    static getScoreOverlay(caption, scoreObjective)
    {
        if(caption && scoreObjective) 
        {
            if(GUI.scoreOverlay) GUI.scoreOverlay.dispose()

            var scoreOverlay = new BABYLON.GUI.TextBlock();
            scoreOverlay.text = caption + "0/" + scoreObjective;
            scoreOverlay.color = "white";
            scoreOverlay.outlineWidth = 1
            scoreOverlay.outlineColor = "black"
            scoreOverlay.fontSize = 25;
            scoreOverlay.left = "0%";
            scoreOverlay.top = "-45%";
            scoreOverlay.width = "30%"
            scoreOverlay.height = "8%"
            scoreOverlay.isVisible = false;
            GUI.getGUI().addControl(scoreOverlay);

            scoreOverlay.setValue = function(score) {
                scoreOverlay.text = caption + score + "/" + scoreObjective
                scoreOverlay.isVisible = true;
            };
        
            scoreOverlay.hide = function() {
                scoreOverlay.isVisible = false;
            };
            
            GUI.scoreOverlay = scoreOverlay
            return scoreOverlay
        }
        else return GUI.scoreOverlay

    }

    static crosshair;
    static getCrosshair()
    {
        if(GUI.crosshair) return GUI.crosshair;
        var crosshair = new BABYLON.GUI.Image("but", "Materials/textures/crosshair/epicross2.png");
        crosshair.width = "2%";
        crosshair.height = "3%";
        GUI.getGUI().addControl(crosshair);
        GUI.crosshair = crosshair

        crosshair.show = function() {
            crosshair.isVisible = true
        }

        crosshair.hide = function() {
            crosshair.isVisible = false
        }
        return GUI.crosshair
    }

    //Overlay that shows a message on the bottom of the scren to help the player pick up objects
    static ballPickUpHelper;
    static getHelper(caption)
    {
        if(caption) 
        {
            if(GUI.helper) GUI.helper.dispose()

            var helper = new BABYLON.GUI.TextBlock();
            helper.text = caption;
            helper.color = "white";
            helper.outlineWidth = 1
            helper.outlineColor = "black"
            helper.fontSize = 20;
            helper.left = "0%";
            helper.top = "45%";
            helper.width = "80%"
            helper.height = "8%"
            helper.isVisible = true;
            GUI.getGUI().addControl(helper);
        
            helper.hide = function() {
                helper.isVisible = false;
            };
            
            GUI.helper = helper
            return helper
        }
        else return GUI.helper

    }

    //Options page (currently contains only checkboxes to show some debug features)
    static createMenuOptionsPage() {
        var option_page_buttons = []

        var checkbox_show_bounding_boxes = new BABYLON.GUI.Checkbox();
        checkbox_show_bounding_boxes.width = "3%";
        checkbox_show_bounding_boxes.height = "3%";
        checkbox_show_bounding_boxes.top = "-12%";
        checkbox_show_bounding_boxes.left = "-25%";
        checkbox_show_bounding_boxes.isChecked = false;
        checkbox_show_bounding_boxes.isVisible = false;
        checkbox_show_bounding_boxes.color = "white";
        checkbox_show_bounding_boxes.onIsCheckedChangedObservable.add(function(value) {
            Settings.showBoundingBox = value
            GUI.menuClickSound.play()
        });
        GUI.getGUI().addControl(checkbox_show_bounding_boxes);   

        var header_show_bounding_boxes = new BABYLON.GUI.TextBlock();
        header_show_bounding_boxes.text = "Show colliders";
        header_show_bounding_boxes.color = "white";
        header_show_bounding_boxes.outlineWidth = 1
        header_show_bounding_boxes.outlineColor = "black"
        header_show_bounding_boxes.fontSize = 20;
        header_show_bounding_boxes.left = "-18.5%";
        header_show_bounding_boxes.top = "-12%";
        header_show_bounding_boxes.width = "10%";
        header_show_bounding_boxes.height = "5%";
        header_show_bounding_boxes.isVisible = false;
        GUI.getGUI().addControl(header_show_bounding_boxes);

        var checkbox_show_physics_impostors = new BABYLON.GUI.Checkbox();
        checkbox_show_physics_impostors.width = "3%";
        checkbox_show_physics_impostors.height = "3%";
        checkbox_show_physics_impostors.top = "-5%";
        checkbox_show_physics_impostors.left = "-25%";
        checkbox_show_physics_impostors.isChecked = false;
        checkbox_show_physics_impostors.isVisible = false;
        checkbox_show_physics_impostors.color = "white";
        checkbox_show_physics_impostors.onIsCheckedChangedObservable.add(function(value) {
            Settings.showPhysics = value
            Physics.viewer()
            GUI.menuClickSound.play()
        });
        GUI.getGUI().addControl(checkbox_show_physics_impostors);   

        var header_show_physics_impostors = new BABYLON.GUI.TextBlock();
        header_show_physics_impostors.text = "Show physics impostors";
        header_show_physics_impostors.color = "white";
        header_show_physics_impostors.outlineWidth = 1
        header_show_physics_impostors.outlineColor = "black"
        header_show_physics_impostors.fontSize = 20;
        header_show_physics_impostors.left = "-16%";
        header_show_physics_impostors.top = "-5%";
        header_show_physics_impostors.width = "13%";
        header_show_physics_impostors.height = "5%";
        header_show_physics_impostors.isVisible = false;
        GUI.getGUI().addControl(header_show_physics_impostors);

        var back_button = BABYLON.GUI.Button.CreateSimpleButton("back_button", "Back");
        back_button.width = "10%"
        back_button.height = "5%";
        back_button.top = "40%"
        //back_button.color = new BABYLON.Color3(1,1,1);
        back_button.color = "white";
        back_button.cornerRadius = 10;
        //back_button.background = new BABYLON.Color3(0,0,1);
        back_button.background = "green";
        back_button.isVisible = false
        GUI.getGUI().addControl(back_button);

        back_button.onPointerUpObservable.add(function() {
            GUI.MainMenu.changePage(GUI.previousPage)
            GUI.menuClickSound.play()
        })

        var header_debug_options = new BABYLON.GUI.TextBlock();
        header_debug_options.text = "Debug options";
        header_debug_options.color = "white";
        header_debug_options.outlineWidth = 1
        header_debug_options.outlineColor = "black"
        header_debug_options.fontSize = 25;
        header_debug_options.left = "-20%";
        header_debug_options.top = "-20%";
        header_debug_options.width = "12%";
        header_debug_options.height = "4%";
        header_debug_options.isVisible = false;
        GUI.getGUI().addControl(header_debug_options);


        var option_page_buttons = [back_button, checkbox_show_physics_impostors, checkbox_show_bounding_boxes]
        var option_page_text = [header_show_bounding_boxes, header_show_physics_impostors, header_debug_options]
        return {buttons: option_page_buttons, text: option_page_text}
    }

    //This menu is shown when m is pressed while in-game
    static createMenuLevelPage() {

        var resume_game_button = BABYLON.GUI.Button.CreateSimpleButton("resum_game_button", "Resume game");
        resume_game_button.width = "10%"
        resume_game_button.height = "5%";
        resume_game_button.top = "10%"
        resume_game_button.left = "0%";
        //resume_game_button.color = new BABYLON.Color3(1,1,1);
        resume_game_button.color = "white";
        resume_game_button.cornerRadius = 10;
        //resume_game_button.background = new BABYLON.Color3(0,0,1);
        resume_game_button.background = "green";
        resume_game_button.isVisible = false
        GUI.getGUI().addControl(resume_game_button);

        resume_game_button.onPointerUpObservable.add(function() {
            GUI.MainMenu.hide()
            GameEngine.resumeGame()
            GUI.menuClickSound.play()
        })

        var tutorial_button = BABYLON.GUI.Button.CreateSimpleButton("tutorial_button", "Tutorial");
        tutorial_button.width = "10%"
        tutorial_button.height = "5%";
        tutorial_button.left = "0%";
        tutorial_button.top = "20%";
        //tutorial_button.color = new BABYLON.Color3(1,1,1);
        tutorial_button.color = "white";
        tutorial_button.cornerRadius = 10;
        //tutorial_button.background = new BABYLON.Color3(0,0,1);
        tutorial_button.background = "green";
        tutorial_button.isVisible = false
        GUI.getGUI().addControl(tutorial_button);

        tutorial_button.onPointerUpObservable.add(function() {
            GUI.MainMenu.changePage("tutorial")
            GUI.menuClickSound.play()
        })

        var next_minigame_button = BABYLON.GUI.Button.CreateSimpleButton("next_minigame_button", "Next level");
        next_minigame_button.width = "10%"
        next_minigame_button.height = "5%";
        next_minigame_button.left = "0%";
        next_minigame_button.top = "30%";
        //next_minigame_button.color = new BABYLON.Color3(1,1,1);
        next_minigame_button.color = "white";
        next_minigame_button.cornerRadius = 10;
        //next_minigame_button.background = new BABYLON.Color3(0,0,1);
        next_minigame_button.background = "green";
        next_minigame_button.isVisible = false
        GUI.getGUI().addControl(next_minigame_button);

        next_minigame_button.onPointerUpObservable.add(function() {
            GUI.getScoreOverlay().hide()
            GameEngine.levelVictory()
            GUI.menuClickSound.play()
        })
        var level_page_buttons = [resume_game_button, tutorial_button, /*options_button,*/ next_minigame_button]

        return {buttons: level_page_buttons, text: []}
    }

    //This menu is shown when a level is won or skipped and it displays a countdown to the next level
    static createMenuLevelChangePage() {

        var level_change_page = {countDownStart: 3}
        level_change_page.count = level_change_page.countDownStart

        var level_change_page_buttons = []

        var next_level_in = new BABYLON.GUI.TextBlock();
        next_level_in.text = "Next minigame in:";
        next_level_in.color = "white";
        next_level_in.outlineWidth = 1
        next_level_in.outlineColor = "black"
        next_level_in.fontSize = 40;
        next_level_in.left = "0%";
        next_level_in.top = "-5%";
        next_level_in.isVisible = false
        GUI.getGUI().addControl(next_level_in);

        var countdown = new BABYLON.GUI.TextBlock();
        countdown.text = ""+level_change_page.countDownStart;
        countdown.color = "white";
        countdown.outlineWidth = 1
        countdown.outlineColor = "black"
        countdown.fontSize = 40;
        countdown.left = "0%";
        countdown.top = "5%";
        countdown.isVisible = false
        GUI.getGUI().addControl(countdown);

        level_change_page.startCountdown = function() { 
            level_change_page.count = level_change_page.countDownStart
            countdown.text = new String(level_change_page.count)
            var timer = setInterval(() => {
                level_change_page.count -= 1
                if(level_change_page.count>0) GUI.countDownTickSound.play()
                countdown.text = new String(level_change_page.count)
                if (level_change_page.count == 0) {
                    clearInterval(timer);
                    GameEngine.loadNextLevel()
                }
            }, level_change_page.countDownStart * 500)
        };


        var level_change_page_text = [next_level_in, countdown]

        level_change_page.text = level_change_page_text
        level_change_page.buttons = level_change_page_buttons

        return level_change_page
    }

    //This menu contains two tutorial pages
    static createMenuTutorialPage() {
        
        var tutorial_text = [
            "The game consists in a series of several mini-games, each one with its own objective.\n\nCurrently two mini-games are implemented, but thanks to the modularity of the game, more can (and will) be added.\n\nAt first, all minigames will be played in sequence. Then already played minigames will be shuffled randomly and objectives will be randomized.",
            "In each mini-game you will be allowed to pick up objects and move freely on the game platform.\n\nThe player can move using the usual W A S D keys and it can jump by pressing SPACEBAR.\n\nObjects that have an highlight when looking at them can be picked up by looking at them and pressing F. They can be dropped with the same key.\n\nPress R to change to a third person view. If changing to third-person view objects will be dropped, as object can not be picked up in such view.\n Press M to access the menu."
        ]

        var tutorial_page = {currentPage: 0, totalPages: 2}

        var tutorial = new BABYLON.GUI.TextBlock();
        tutorial.text = tutorial_text[tutorial_page.currentPage];
        tutorial.textWrapping = true
        tutorial.color = "white";
        tutorial.outlineWidth = 1
        tutorial.outlineColor = "black"
        tutorial.fontSize = 20;
        tutorial.left = "0%";
        tutorial.top = "-20%";
        tutorial.width = "70%";
        tutorial.height = "50%";
        tutorial.isVisible = false
        GUI.getGUI().addControl(tutorial);

        var tutorial_page_buttons = []
        var previous_button = BABYLON.GUI.Button.CreateSimpleButton("previous_button", "Previous");
        previous_button.width = "10%"
        previous_button.height = "5%";
        previous_button.top = "30%"
        previous_button.left = "-10%"
        //previous_button.color = new BABYLON.Color3(1,1,1);
        previous_button.color = "white";
        previous_button.cornerRadius = 10;
        //previous_button.background = new BABYLON.Color3(0,0,1);
        previous_button.background = "green";
        previous_button.isVisible = false
        GUI.getGUI().addControl(previous_button);
        previous_button.onPointerUpObservable.add(function() {
            if(tutorial_page.currentPage>0) 
            {
                tutorial_page.currentPage-=1
                tutorial.text = tutorial_text[tutorial_page.currentPage]
                GUI.menuClickSound.play()
            }
        })

        var next_button = BABYLON.GUI.Button.CreateSimpleButton("next_button", "Next");
        next_button.width = "10%"
        next_button.height = "5%";
        next_button.top = "30%"
        next_button.left = "10%"
        //next_button.color = new BABYLON.Color3(1,1,1);
        next_button.color = "white";
        next_button.cornerRadius = 10;
        //next_button.background = new BABYLON.Color3(0,0,1);
        next_button.background = "green";
        next_button.isVisible = false
        GUI.getGUI().addControl(next_button);
        next_button.onPointerUpObservable.add(function() {
            if(tutorial_page.currentPage<tutorial_page.totalPages-1) 
            {
                tutorial_page.currentPage+=1
                tutorial.text = tutorial_text[tutorial_page.currentPage]
                GUI.menuClickSound.play()
            }
        })

        var back_button = BABYLON.GUI.Button.CreateSimpleButton("back_button", "Back");
        back_button.width = "10%"
        back_button.height = "5%";
        back_button.top = "40%"
        //back_button.color = new BABYLON.Color3(1,1,1);
        back_button.color = "white";
        back_button.cornerRadius = 10;
        //back_button.background = new BABYLON.Color3(0,0,1);
        back_button.background = "green";
        back_button.isVisible = false
        GUI.getGUI().addControl(back_button);

        back_button.onPointerUpObservable.add(function() {
            GUI.MainMenu.changePage(GUI.previousPage)
            GUI.menuClickSound.play()
        })

        var tutorial_page_buttons = [previous_button, next_button, back_button]
        var tutorial_page_text = [tutorial]

        tutorial_page.text = tutorial_page_text
        tutorial_page.buttons = tutorial_page_buttons

        return tutorial_page
    }

    //Main menu, contains the title and some buttons
    static createMenuMainPage() {

        var start_game_button = BABYLON.GUI.Button.CreateSimpleButton("start_game_button", "Start game");
        start_game_button.width = "10%"
        start_game_button.height = "5%";
        start_game_button.left = "0%";
        start_game_button.top = "15%";
        //start_game_button.color = new BABYLON.Color3(1,1,1);
        start_game_button.color = "white";
        start_game_button.cornerRadius = 10;
        //start_game_button.background = new BABYLON.Color3(0,0,1);
        start_game_button.background = "green";
        start_game_button.isVisible = false
        GUI.getGUI().addControl(start_game_button);

        start_game_button.onPointerUpObservable.add(function() {
            GUI.MainMenu.hide()
            GameEngine.startGame()
            GUI.menuClickSound.play()
        })

        var tutorial_button = BABYLON.GUI.Button.CreateSimpleButton("tutorial_button", "Tutorial");
        tutorial_button.width = "10%"
        tutorial_button.height = "5%";
        tutorial_button.left = "0%";
        tutorial_button.top = "25%";
        //tutorial_button.color = new BABYLON.Color3(1,1,1);
        tutorial_button.color = "white";
        tutorial_button.cornerRadius = 10;
        //tutorial_button.background = new BABYLON.Color3(0,0,1);
        tutorial_button.background = "green";
        tutorial_button.isVisible = false
        GUI.getGUI().addControl(tutorial_button);

        tutorial_button.onPointerUpObservable.add(function() {
            GUI.MainMenu.changePage("tutorial")
            GUI.menuClickSound.play()
        })

        var options_button = BABYLON.GUI.Button.CreateSimpleButton("options_button", "Options");
        options_button.width = "10%"
        options_button.height = "5%";
        options_button.left = "0%";
        options_button.top = "35%";
        //options_button.color = new BABYLON.Color3(1,1,1);
        options_button.color = "white";
        options_button.cornerRadius = 10;
        //options_button.background = new BABYLON.Color3(0,0,1);
        options_button.background = "green";
        options_button.isVisible = false
        GUI.getGUI().addControl(options_button);

        options_button.onPointerUpObservable.add(function() {
            GUI.MainMenu.changePage("options")
            GUI.menuClickSound.play()
        })
        var main_page_buttons = [start_game_button, tutorial_button, options_button]

        var gameName = new BABYLON.GUI.TextBlock();
        gameName.text = "Minigame.io";
        gameName.color = "white";
        gameName.outlineWidth = 1
        gameName.outlineColor = "black"
        gameName.fontSize = 40;
        gameName.left = "0%";
        gameName.top = "-25%";
        gameName.width = "20%";
        gameName.height = "10%";
        GUI.getGUI().addControl(gameName);

        var main_page_text = [gameName]

        return {buttons: main_page_buttons, text: main_page_text}
    }

    //This creates the main menu enforcing a singleton pattern
    static getMainMenu() {

        if(GUI.MainMenu) return GUI.MainMenu[GUI.MainMenu.currentPage]

        var main_page = GUI.createMenuMainPage()
        var options_page = GUI.createMenuOptionsPage()
        var level_page = GUI.createMenuLevelPage()
        var level_change_page = GUI.createMenuLevelChangePage()
        var tutorial_page = GUI.createMenuTutorialPage()

        GUI.MainMenu = {main: main_page, options: options_page, level: level_page, level_change: level_change_page, tutorial: tutorial_page}
        GUI.MainMenu.currentPage = "main"

        GUI.MainMenu.hide = function () {
            for(var textField of GUI.MainMenu[GUI.MainMenu.currentPage].text)
            {
                textField.isVisible = false
            }
            for(var button of GUI.MainMenu[GUI.MainMenu.currentPage].buttons)
            {
                button.isVisible = false
            }
        }

        GUI.MainMenu.showCurrentPage = function() {
            for(var textField of GUI.MainMenu[GUI.MainMenu.currentPage].text)
            {
                textField.isVisible = true
            }
            for(var button of GUI.MainMenu[GUI.MainMenu.currentPage].buttons)
            {
                button.isVisible = true
            }
        }

        GUI.MainMenu.show = function(page) {
            if(!GUI.MainMenu[page]) throw "Menu page doesn't exist!"

            GUI.previousPage = GUI.MainMenu.currentPage
            for(var textField of GUI.MainMenu[page].text)
            {
                textField.isVisible = true
            }
            for(var button of GUI.MainMenu[page].buttons)
            {
                button.isVisible = true
            }
            GUI.MainMenu.currentPage = page
            return GUI.MainMenu[page]
        }

        GUI.MainMenu.changePage = function(page) {
            GUI.previousPage = GUI.MainMenu.currentPage
            GUI.MainMenu.hide()
            GUI.MainMenu.show(page)
        }
        
        return GUI.MainMenu
    }

    static loadMainMenu() {
        var menu = GUI.getMainMenu()
        menu.showCurrentPage()
    }

    
    static createLoadingScreen() {
        function loadingScreen() {
            console.log("Loading screen created");
        }

        loadingScreen.prototype.displayLoadingUI = function () {
            console.log("customLoadingScreen loading");
            loadingScreenDiv.innerHTML = "loading";
        }

        loadingScreen.prototype.hideLoadingUI = function () {
            console.log("customLoadingScreen loading");
            loadingScreenDiv.innerHTML = "loading";
        }

        return loadingScreen;
    }
}