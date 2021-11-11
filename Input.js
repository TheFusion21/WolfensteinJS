var KeyCode = {
    Backspace: 8,
    Delete: 46,
    Tab: 9,
    Clear: 12,
    Return: 13,
    Pause: 0,
    Escape: 27,
    Space: 32,
    Keypad0: 96,
    Keypad1: 97,
    Keypad2: 98,
    Keypad3: 99,
    Keypad4: 100,
    Keypad5: 101,
    Keypad6: 102,
    Keypad7: 103,
    Keypad8: 104,
    Keypad9: 105,
    KeypadPeriod: 110,
    KeypadDivide: 111,
    KeypadMultiply: 106,
    KeypadMinus: 109,
    KeypadPlus: 107,
    KeypadEnter: 0,
    KeypadEquals: 0,
    UpArrow: 38,
    DwnArrow: 40,
    RgtArrow: 39,
    LftArrow: 37,
    Insert: 45,
    Home: 36,
    End: 35,
    PageUp: 33,
    PageDown: 34,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    F13: 124,
    F14: 125,
    F15: 126,
    Exclaim: 0,
    DoubleQuote: 0,
    Hash: 0,
    Dollar: 0,
    Ampersand: 0,
    Quote: 0,
    LeftParen: 0,
    RightParen: 0,
    Asterisk: 0,
    Plus: 0,
    Comma: 188,
    Minus: 189,
    Period: 190,
    Slash: 191,
    Colon: 0,
    Semicolon: 0,
    Less: 0,
    Equals: 187,
    Greater: 0,
    Question: 0,
    At: 0,
    LeftBracket: 0,
    Backslash: 220,
    RightBracket: 211,
    Caret: 0,
    Underscore: 0,
    BackQuote: 0,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    Numlock: 144,
    CapsLock: 20,
    ScrollLock: 145,
    RightShift: 16,
    LeftShift: 16,
    RCtrl: 17,
    LCtrl: 17,
    RightAlt: 0,
    LeftAlt: 18,
    LeftCommand: 91,
    LeftApple: 0,
    LeftWindows: 91,
    RightCommand: 0,
    RightApple: 0,
    RightWindows: 92,
    AltGr: 0,
    Help: 0,
    Print: 0,
    SysReq: 0,
    Break: 0,
    Menu: 93,
    N0:48,
    N1:49,
    N2:50,
    N3:51,
    N4:52,
    N5:53,
    N6:54,
    N7:55,
    N8:56,
    N9:57,
};

var GPKeyCodes = {
    A:0,
    B:1,
    X:2,
    Y:3,
    LB:4,
    RB:5,
    LT:6,
    RT:7,
    RESET:8,
    START:9,
    LA:10,
    RA:11,
    DPADUP:12,
    DPADDOWN:13,
    DPADLEFT:14,
    DPADRIGHT:15,
    B16:16,
    B17:17,
    B18:18,
    B19:19
};

var Controls = {
    Lwrd: [
        {kc: KeyCode.A, d: "kb"},
        {kc: "GP Axis 0", d: "gpa", dir: -1}
    ],
    Rwrd: [
        {kc: KeyCode.D, d: "kb"},
        {kc: "GP Axis 0", d: "gpa", dir: 1}
    ],
    Fwrd: [
        {kc: KeyCode.W, d: "kb"},
        {kc: "GP Axis 1", d: "gpa", dir: -1}
    ],
    Bkwrd: [
        {kc: KeyCode.S, d: "kb"},
        {kc: "GP Axis 1", d: "gpa", dir: 1}
    ],
    Left: [
        {kc: KeyCode.LftArrow, d: "kb"},
        {kc: "GP Axis 2", d: "gpa", dir: -1}
    ],
    Right: [
        {kc: KeyCode.RgtArrow, d: "kb"},
        {kc: "GP Axis 2", d: "gpa", dir: 1}
    ],
    Open: [
        {kc: KeyCode.Space, d: "kb"},
        {kc: GPKeyCodes.A, d: "gp"}
    ],
    Fire: [
        {kc: KeyCode.LCtrl, d: "kb"},
        {kc: GPKeyCodes.RB, d: "gp"}
    ],
    Wpn1: [
        {kc: KeyCode.N1, d: "kb"},
        {kc: null, d: "gp"}
    ],
    Wpn2: [
        {kc: KeyCode.N2, d: "kb"},
        {kc: null, d: "gp"}
    ],
    Wpn3: [
        {kc: KeyCode.N3, d: "kb"},
        {kc: null, d: "gp"}
    ],
    Wpn4: [
        {kc: KeyCode.N4, d: "kb"},
        {kc: null, d: "gp"}
    ],
    NxtWpn: [
        {kc: null, d: "kb"},
        {kc: GPKeyCodes.DPADRIGHT, d: "gp"}
    ],
    PrevWpn: [
        {kc: null, d: "kb"},
        {kc: GPKeyCodes.DPADLEFT, d: "gp"}
    ],
};

var Input = {
    MouseButtons: [],
    MouseButtonsDown: [],
    MouseButtonsUp: [],
    Keys: [],
    KeysDown: [],
    KeysUp: [],
    Gamepads: [],
    GamepadButtons: [],
    GamepadButtonsDown: [],
    GamepadButtonsUp: [],
    LastGamepadButtonsDown: [],
    LastGamepadButtonsUp: [],
    Axes: {
        "Mouse ScrollWheel": 0,
        "GP Axis 0": 0,
        "GP Axis 1": 0,
        "GP Axis 2": 0,
        "GP Axis 3": 0
    },
    CollectMouseButtons: [],
    CollectMouseButtonsDown: [],
    CollectMouseButtonsUp: [],
    CollectKeys: [],
    CollectKeysDown: [],
    CollectKeysUp: [],
    LastMouseButtonsDown: [],
    LastMouseButtonsUp: [],
    LastKeysDown: [],
    LastKeysUp: [],
    mousePosition: {
        x:0,
        y:0
    },
    mouseTarget: null,
    GamepadThreshold: 0.2,
    ignoreInput: false,
    FoundKey: {
        kc: -1,
        d: ""
    },
    ReplaceKey: {
        kc: -1,
        d: ""
    }
};

Input.Init = function()
{
    //KEYBOARD
    document.addEventListener("keydown",  function(e)
    {
        if(Input.Keys[e.which] == true)return;
        if(Input.ignoreInput == true && Input.FoundKey.kc == -1)
        {
            if(e.which != KeyCode.Escape)
            {
                Input.FoundKey.kc = e.which;
                Input.FoundKey.d = "kb";
                Input.ignoreInput = false;
                Cookies.setCookie("Controls", Controls);
            }
            else
            {
                Input.FoundKey.kc = Input.ReplaceKey.kc;
                Input.FoundKey.d = Input.ReplaceKey.d;
                Input.ignoreInput = false;
            }
        }
        else
        {
            Input.CollectKeys[e.which] = true;
            Input.CollectKeysDown[e.which] = true;
        }
        
        if(e.ctrlKey && (e.which == 83))
            e.preventDefault();
    }, false);
    document.addEventListener("keyup", function(e)
    {
        Input.CollectKeys[e.which] = false;
        Input.CollectKeysUp[e.which] = true;
    }, false);
    //MOUSE
    //  BUTTONS
    document.addEventListener("mousewheel", function(e)
    {
        Input.Axes["Mouse ScrollWheel"] = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        e.preventDefault();
    }, false);
    document.addEventListener("DOMMouseScroll", function(e)
    {
        Input.Axes["Mouse ScrollWheel"] = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        e.preventDefault();
    }, false);
    document.addEventListener("mousedown", function(e)
    {
        Input.mouseTarget = e.target;
        Input.CollectMouseButtons[e.button] = true;
        Input.CollectMouseButtonsDown[e.button] = true;
        e.preventDefault();
    }, false);
    document.addEventListener("mouseup", function(e)
    {   
        Input.CollectMouseButtons[e.button] = false;
        Input.CollectMouseButtonsUp[e.button] = true;

    }, false);
    document.addEventListener("contextmenu", function(e) {
        //e.preventDefault();
    }, false);
    //  MOVE
    document.addEventListener("mousemove", function(e)
    {
        Input.mousePosition.x = e.clientX;
        Input.mousePosition.y = e.clientY;
    }, false);
    window.addEventListener("gamepadconnected", function(e) {
        
        Input.Gamepads[e.gamepad.index] = e.gamepad;
    }, false);
    console.log("Initiated Inputs");
}

Input.Update = function()
{
    Input.MouseButtons = Input.CollectMouseButtons;
    Input.MouseButtonsDown = Input.CollectMouseButtonsDown;
    Input.MouseButtonsUp = Input.CollectMouseButtonsUp;
    Input.Keys = Input.CollectKeys;
    Input.KeysDown = Input.CollectKeysDown;
    Input.KeysUp = Input.CollectKeysUp;

    //GAMEPAD
    /*TODO:
    NEU MACHEN DAMIT ES NUR AUF ÄNDERUNGEN DURCH DOWN ODER UP FUNKTIONIERT
    */
    Input.Gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
    for(var i = 0;i<Input.Gamepads.length;i++)
    {
        if(Input.Gamepads[i] == null)continue;
        for(var ax = 0;ax<Input.Gamepads[i].axes.length;ax++)
        {
            Input.Axes["GP Axis " + ax] = Input.Gamepads[i].axes[ax] * 1;
            if(Input.ignoreInput == true && Input.FoundKey.kc == -1)
            {
                if(Input.Gamepads[i].axes[ax] * 1 > 1-Input.GamepadThreshold || Input.Gamepads[i].axes[ax] * 1 < -1+Input.GamepadThreshold)
                {
                    Input.FoundKey.kc = "GP Axis " + ax;
                    Input.FoundKey.d = "gpa";
                    Input.FoundKey.dir = Input.Gamepads[i].axes[ax] * 1 > 0 ? 1 : -1;
                    Input.ignoreInput = false;
                    Cookies.setCookie("Controls", Controls);
                }
            }
        }
        for(var key = 0;key<Input.Gamepads[i].buttons.length;key++)
        {
            if(Input.GamepadButtons[key] == undefined)
            {
                Input.GamepadButtons[key] = false;
            }
            else if(Input.GamepadButtons[key] != Input.GamepadButtonPressed(Input.Gamepads[i].buttons[key]))
            {
                
                if(Input.GamepadButtonPressed(Input.Gamepads[i].buttons[key]))
                {
                    if(Input.ignoreInput == true && Input.FoundKey.kc == -1)
                    {
                        if(key != GPKeyCodes.B)
                        {
                            Input.FoundKey.kc = key;
                            Input.FoundKey.d = "gp";
                            Input.ignoreInput = false;
                            Cookies.setCookie("Controls", Controls);
                        }
                        else
                        {
                            Input.FoundKey.kc = Input.ReplaceKey.kc;
                            Input.FoundKey.d = Input.ReplaceKey.d;
                            Input.ignoreInput = false;
                        }
                        Input.GamepadButtons[key] = true;
                    }
                    else
                    {
                        Input.GamepadButtonsDown[key] = true;
                        Input.GamepadButtons[key] = true;
                    }
                }
                else
                {
                    Input.GamepadButtonsUp[key] = true;
                    Input.GamepadButtons[key] = false;
                }
            }
        }
    }
    //GAMEPAD
    for(var i = 0;i<Input.GamepadButtonsDown.length;i++)
    {
        if(Input.LastGamepadButtonsDown[i] == true)
        {
            Input.GamepadButtonsDown[i] = false;
        }
        Input.LastGamepadButtonsDown[i] = Input.GamepadButtonsDown[i];
    }
    for(var i = 0;i<Input.GamepadButtonsUp.length;i++)
    {
        if(Input.LastGamepadButtonsUp[i] == true)
        {
            Input.GamepadButtonsUp[i] = false;
        }
        Input.LastGamepadButtonsUp[i] = Input.GamepadButtonsUp[i];
    }
    //MOUSE
    for(var i = 0;i<Input.MouseButtonsDown.length;i++)
    {
        if(Input.LastMouseButtonsDown[i] == true)
        {
            Input.MouseButtonsDown[i] = false;
        }
        Input.LastMouseButtonsDown[i] = Input.MouseButtonsDown[i];
    }
    for(var i = 0;i<Input.MouseButtonsUp.length;i++)
    {
        if(Input.LastMouseButtonsUp[i] == true)
        {
            Input.MouseButtonsUp[i] = false;
        }
        Input.LastMouseButtonsUp[i] = Input.MouseButtonsUp[i];
    }
    //BUTTONS
    for(var i = 0;i<Input.KeysDown.length;i++)
    {
        if(Input.LastKeysDown[i] == true)
        {
            Input.KeysDown[i] = false;
        }
        Input.LastKeysDown[i] = Input.KeysDown[i];
    }
    for(var i = 0;i<Input.KeysUp.length;i++)
    {
        if(Input.LastKeysUp[i] == true)
        {
            Input.KeysUp[i] = false;
        }
        Input.LastKeysUp[i] = Input.KeysUp[i];
    }
}

Input.GetMouseButton = function(index)
{
    if(Input.ignoreInput)return false;
    return Input.MouseButtons[index] == true;
}

Input.GetMouseButtonDown = function(index)
{
    if(Input.ignoreInput)return false;
    return Input.MouseButtonsDown[index] == true;
}

Input.GetMouseButtonUp = function(index)
{
    if(Input.ignoreInput)return false;
    return Input.MouseButtonsUp[index] == true;
}

Input.GetKey = function(kc)
{
    if(Input.ignoreInput)return false;
    return Input.Keys[kc] == true;
}

Input.GetKeyDown = function(kc)
{
    if(Input.ignoreInput)return false;
    return Input.KeysDown[kc] == true;
}

Input.GetKeyUp = function(kc)
{
    if(Input.ignoreInput)return false;
    return Input.KeysUp[kc] == true;
}

Input.GetJoystickKey = function(kc)
{
    if(Input.ignoreInput)return false;
    return Input["GamepadButtons"][kc] == true;
}

Input.GetJoystickKeyDown = function(kc)
{
    if(Input.ignoreInput)return false;
    return Input["GamepadButtonsDown"][kc] == true;
}

Input.GetJoystickKeyUp = function(kc)
{
    if(Input.ignoreInput)return false;
    return Input["GamepadButtonsUp"][kc] == true;
}

Input.GetAxes = function(str)
{
    if(Input.ignoreInput)return 0;
    return Input.Axes[str];
}

Input.GetControls = function(name)
{
    if(Controls[name] == undefined || Controls[name] == null)
        return false;
    for(var i = 0;i<2;i++)
    {
        if(Controls[name][i].d == "kb")
        {
            if(Input.GetKey(Controls[name][i].kc))
                return true;
        }
        else if(Controls[name][i].d == "gp")
        {
            if(Input.GetJoystickKey(Controls[name][i].kc))
                return true;
        }
        else if(Controls[name][i].d == "gpa")
        {
            if(Controls[name][i].dir == -1)
            {
                if(Input.GetAxes(Controls[name][i].kc) < -Input.GamepadThreshold)
                    return true;
            }
            else if(Controls[name][i].dir == 1)
            {
                if(Input.GetAxes(Controls[name][i].kc) > Input.GamepadThreshold)
                    return true;
            }
        }
    }
    
    return false;
}

Input.GetControlsDown = function(name)
{
    if(Controls[name] == undefined || Controls[name] == null)
        return false;
    for(var i = 0;i<2;i++)
    {
        if(Controls[name][i].d == "kb")
        {
            if(Input.GetKeyDown(Controls[name][i].kc))
                return true;
        }
        else if(Controls[name][i].d == "gp")
        {
            if(Input.GetJoystickKeyDown(Controls[name][i].kc))
                return true;
        }
        else if(Controls[name][i].d == "gpa")
        {
            if(Controls[name][i].dir == -1)
            {
                if(Input.GetAxes(Controls[name][i].kc) < -1+Input.GamepadThreshold)
                    return true;
            }
            else if(Controls[name][i].dir == 1)
            {
                if(Input.GetAxes(Controls[name][i].kc) > 1-Input.GamepadThreshold)
                    return true;
            }
        }
    }
    
    return false;
}

Input.GetControlsValue = function(name)
{
    if(Controls[name] == undefined || Controls[name] == null)
        return false;
    for(var i = 0;i<2;i++)
    {
        if(Controls[name][i].d == "kb")
        {
            if(Input.GetKey(Controls[name][i].kc))
                return 1;
        }
        else if(Controls[name][i].d == "gp")
        {
            if(Input.GetJoystickKey(Controls[name][i].kc))
                return 1;
        }
        else if(Controls[name][i].d == "gpa")
        {
            if(Controls[name][i].dir == -1)
            {
                if(Input.GetAxes(Controls[name][i].kc) < -Input.GamepadThreshold)
                    return Input.GetAxes(Controls[name][i].kc);
            }
            else if(Controls[name][i].dir == 1)
            {
                if(Input.GetAxes(Controls[name][i].kc) > Input.GamepadThreshold)
                    return Input.GetAxes(Controls[name][i].kc);
            }
        }
    }
    return 0;
}

Input.GamepadButtonPressed = function(b)
{
  if (typeof(b) == "object") {
    return b.pressed;
  }
  return b >= 1-Input.GamepadThreshold;
}

Input.getKeyCodeByVal = function(val)
{
    
    if(val.kc == null || val.d == null)return " None ";
    if(val.kc == -1)return "Waiting";
    if(val.d == "kb")
    {
        for(var key in KeyCode)
        {
            if(KeyCode[key] == val.kc)
            {
                return "" + key;
            }
        }
        return "";
    }
    else if(val.d == "gp")
    {
        for(var key in GPKeyCodes)
        {
            if(GPKeyCodes[key] == val.kc)
            {
                return "GP " + key[0].toUpperCase() + key.toLowerCase().substr(1);
            }
        }
        return "";
    }
    else if(val.d == "gpa")
    {
        var suffix = (val.dir != null || val.dir != undefined) ? (val.dir > 0 ? " +" : " -") : "";
        return val.kc + suffix;
    }
    return "error";
}

Input.WaitForInput = function(keyToSet)
{
    Input.ignoreInput = true;
    Input.ReplaceKey.d = keyToSet.d;
    Input.ReplaceKey.kc = keyToSet.kc;
    
    Input.FoundKey = keyToSet;
    Input.FoundKey.d = "";
    Input.FoundKey.kc = -1;
}