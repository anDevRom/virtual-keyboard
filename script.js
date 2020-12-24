const textArea = document.querySelector("#textarea")

// Rec
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;                            
let recognition = null;
const arrOfRec = []

// Sounds
const soundBack = document.querySelector("#sound-back")
const soundCaps = document.querySelector("#sound-caps")
const soundEng = document.querySelector("#sound-eng")
const soundEnter = document.querySelector("#sound-enter")
const soundRu = document.querySelector("#sound-ru")
const soundShift = document.querySelector("#sound-shift")

const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onlose: null,
    }, 

    properties: {
        value: "",
        capsLock: false,
        shift: false,
        recOn: false,
        sound: false
    },

    keyLayouts: {
        defaultENG: [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "Backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
            "CapsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", "Enter",
            "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?", "Shift",
            "Rec", "Sound", "ArrowLeft", "Space", "ArrowRight", "_LANG"
        ],
        alternativeENG: [
            "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "Backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
            "CapsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", "Enter",
            "done", "z", "x", "c", "v", "b", "n", "m", "<", ">", "/", "Shift",
            "Rec", "Sound", "ArrowLeft", "Space", "ArrowRight", "_LANG"
        ],
        defaultRU: [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "Backspace",
            "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
            "CapsLock", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "Enter",
            "done", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю",".", "Shift",
            "Rec", "Sound", "ArrowLeft", "Space", "ArrowRight", "_LANG"
        ],
        alternativeRU: [
            "!", "@", "№", ";", "%", ":", "?", "*", "(", ")", "Backspace",
            "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
            "CapsLock", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "Enter",
            "done", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ",", "Shift",
            "Rec", "Sound", "ArrowLeft", "Space", "ArrowRight", "_LANG"
        ]
    },

    keyLayoutsVersion: "default",

    keyLayoutsLang: "eng",

    positionCursor: 0,
    
    testVar: "_test_",

    init() {
        this.elements.main = document.createElement("div")
        this.elements.keysContainer = document.createElement("div")

        this.elements.main.classList.add("keyboard", "keyboard_hidden")
        this.elements.keysContainer.classList.add("keyboard__keys")
        this.elements.keysContainer.appendChild(this._createKeys())

        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
        this.elements.main.appendChild(this.elements.keysContainer)
        document.body.appendChild(this.elements.main)

        document.querySelectorAll("#textarea").forEach(element => {
            element.addEventListener("focus", () => {
              this.open(element.value, currentValue => {
                element.value = currentValue;
              });
            });
          });
    },

    _changeKeyboardLang() {
        switch (this.keyLayoutsLang) {
            case "eng":
                this.keyLayoutsLang = "ru"
                break
            case "ru":
                this.keyLayoutsLang = "eng"
                break
        }
    },

    _chahgeKeyboardVersion() {
        switch (this.keyLayoutsVersion) {
            case "default":
                this.keyLayoutsVersion = "alternative"
                break
            case "alternative":
                this.keyLayoutsVersion = "default"
                break
        }
    },

    _rerenderKeyboard() {
        this.elements.keysContainer.innerHTML = ""
        this.elements.keysContainer.appendChild(this._createKeys())
        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
    },

    _createKeys() {
        const fragment = document.createDocumentFragment();
        let keyLayout = null

        switch (this.keyLayoutsLang) {
            case "eng":
                switch (this.keyLayoutsVersion) {
                    case "default":
                        keyLayout = this.keyLayouts.defaultENG
                        break;
                    case "alternative":
                        keyLayout = this.keyLayouts.alternativeENG
                        break;
                }
                break;
            case "ru":
                switch (this.keyLayoutsVersion) {
                    case "default":
                        keyLayout = this.keyLayouts.defaultRU
                        break;
                    case "alternative":
                        keyLayout = this.keyLayouts.alternativeRU
                        break;
                }
                break;
        }

        keyLayout.forEach((key) => {
            const keyElement = document.createElement("div")
            keyElement.id = `button-${key}`
            const insertLineBreak = ["Backspace", "p", "ъ", "Enter", "Shift"].indexOf(key) !== -1

            keyElement.setAttribute("type", "button")
            keyElement.classList.add("keyboard__key")

            keyElement.addEventListener("click", () => {
                textArea.focus()
                textArea.selectionStart = this.positionCursor
                textArea.selectionEnd = textArea.selectionStart
            })

            switch (key) {
                case "Backspace":
                    keyElement.classList.add("keyboard__key_wide");
                    keyElement.innerHTML = "<<"
        
                    keyElement.addEventListener("click", () => {
                        playAudio(soundBack)
                        let outputArr = this.properties.value.split("")
                        outputArr.splice(textArea.selectionStart - 1, 1)
                        
                        this.properties.value = outputArr.join("")
                        this.positionCursor = textArea.selectionStart - 1
                        setTimeout(() => {
                            textArea.selectionStart = this.positionCursor
                            textArea.selectionEnd = textArea.selectionStart
                        }, 0)

                        this._triggerEvent("oninput");
                    });
        
                    break;
        
                case "CapsLock":
                    keyElement.classList.add("keyboard__key_wide", "keyboard__key_activatable");
                    keyElement.innerHTML = "Caps"
                    keyElement.id = "button-caps"
                    
                    if (this.properties.capsLock) {
                        keyElement.classList.add("keyboard__key_active");
                    }

                    keyElement.addEventListener("click", () => {
                        playAudio(soundCaps)
                        this._toggleCapsLock();
                        this._rerenderKeyboard()
                    });
                    
                    break;
        
                case "Enter":
                    keyElement.classList.add("keyboard__key_wide");
                    keyElement.innerHTML = "Enter"
            
                    keyElement.addEventListener("click", () => {
                        playAudio(soundEnter)
                        let outputArr = this.properties.value.split("")
                        outputArr.splice(textArea.selectionStart, 0, "\n")
                        
                        this.properties.value = outputArr.join("")
                        this.positionCursor = textArea.selectionStart + 1
                        setTimeout(() => {
                            textArea.selectionStart = this.positionCursor
                            textArea.selectionEnd = textArea.selectionStart
                        }, 0)

                        this._triggerEvent("oninput");
                    });
            
                    break;
            
                case "Space":
                    keyElement.classList.add("keyboard__key_extra-wide");
                    keyElement.innerHTML = "Space"
            
                    keyElement.addEventListener("click", () => {                        
                        if (this.keyLayoutsLang === "ru") {
                            playAudio(soundRu)
                        } else {
                            playAudio(soundEng)
                        }
                        let outputArr = this.properties.value.split("")
                        outputArr.splice(textArea.selectionStart, 0, " ")
                        
                        this.properties.value = outputArr.join("")
                        this.positionCursor = textArea.selectionStart + 1
                        setTimeout(() => {
                            textArea.selectionStart = this.positionCursor
                            textArea.selectionEnd = textArea.selectionStart
                        }, 0)
                        this._triggerEvent("oninput");
                    });
            
                    break;
        
                case "done":
                    keyElement.classList.add("keyboard__key_wide", "keyboard__key_dark");
                    keyElement.innerHTML = "Done"
            
                    keyElement.addEventListener("click", () => {
                        if (this.keyLayoutsLang === "ru") {
                            playAudio(soundRu)
                        } else {
                            playAudio(soundEng)
                        }
                        this.close();
                        this._triggerEvent("onclose");
                    });
            
                    break;
                    
                case "Shift":
                    keyElement.classList.add("keyboard__key_wide", "keyboard__key_activatable");
                    keyElement.innerHTML = "Shift"
                    keyElement.id = "button-shift"
                    if (this.properties.shift) {
                        keyElement.classList.add("keyboard__key_active");
                    }
            
                    keyElement.addEventListener("click", () => {
                        playAudio(soundShift)
                        this._toggleShift();
                        this._toggleCapsLock();
                        this._chahgeKeyboardVersion()
                        this._rerenderKeyboard()
                    });
            
                    break;

                case "Rec":
                    keyElement.classList.add("keyboard__key_wide", "keyboard__key_activatable");
                    keyElement.innerHTML = "rec"
                    keyElement.id = "button-rec"
            
                    keyElement.addEventListener("click", startRec);
                    keyElement.addEventListener("click", () => {
                        if (this.keyLayoutsLang === "ru") {
                            playAudio(soundRu)
                        } else {
                            playAudio(soundEng)
                        }
                    })
            
                    break;

                case "ArrowLeft":
                    keyElement.innerHTML = "<"

                    keyElement.addEventListener("click", () => {
                        if (this.keyLayoutsLang === "ru") {
                            playAudio(soundRu)
                        } else {
                            playAudio(soundEng)
                        }
                        setTimeout(() => {
                            textArea.selectionStart = textArea.selectionStart - 1
                            textArea.selectionEnd = textArea.selectionStart
                            this.positionCursor = textArea.selectionStart
                        }, 0)
                    })

                    break;

                case "ArrowRight":
                    keyElement.innerHTML = ">"
    
                    keyElement.addEventListener("click", () => {
                        if (this.keyLayoutsLang === "ru") {
                            playAudio(soundRu)
                        } else {
                            playAudio(soundEng)
                        }
                        setTimeout(() => {
                            textArea.selectionStart = textArea.selectionStart + 1
                            textArea.selectionEnd = textArea.selectionStart
                            this.positionCursor = textArea.selectionStart
                        }, 0)
                    })
    
                    break;

                case "_LANG":
                    keyElement.classList.add("keyboard__key_wide", "keyboard__key_activatable")
                    switch (this.keyLayoutsLang) {
                        case "eng":
                            keyElement.innerHTML = "ENG"
                            break
                        case "ru":
                            keyElement.innerHTML = "RU"
                            break
                    }
        
                    keyElement.addEventListener("click", () => {
                        if (this.keyLayoutsLang === "ru") {
                            playAudio(soundRu)
                        } else {
                            playAudio(soundEng)
                        }
                        this._changeKeyboardLang()
                        this._rerenderKeyboard()
                    })
        
                    break;

                case "Sound":
                    keyElement.classList.add("keyboard__key_wide", "keyboard__key_activatable")
                    keyElement.innerHTML = "Sound"
                    keyElement.addEventListener("click", () => {
                        if (this.keyLayoutsLang === "ru") {
                            playAudio(soundRu)
                        } else {
                            playAudio(soundEng)
                        }
                        this.properties.sound = !this.properties.sound
                        keyElement.classList.toggle("keyboard__key_active")
                    })
                    break;

                default:
                    keyElement.textContent = key.toLowerCase();
                    if (this.properties.capsLock) {
                        keyElement.textContent = key.toUpperCase()
                    }
            
                    keyElement.addEventListener("click", () => {
                        if (this.keyLayoutsLang === "ru") {
                            playAudio(soundRu)
                        } else {
                            playAudio(soundEng)
                        }
                        let outputArr = this.properties.value.split("")
                        outputArr.splice(textArea.selectionStart, 0, this.properties.capsLock ? key.toUpperCase() : key.toLowerCase())
                        
                        this.properties.value = outputArr.join("")
                        this.positionCursor = textArea.selectionStart + 1
                        setTimeout(() => {
                            textArea.selectionStart = this.positionCursor
                            textArea.selectionEnd = textArea.selectionStart
                        }, 0)
                        this._triggerEvent("oninput");
                    });
            
                    break;
            }

            document.addEventListener("keydown", (event) => {
                if (event.key.toLowerCase() === key.toLowerCase() || event.code.toLowerCase() === key.toLowerCase()) {
                    keyElement.style.backgroundColor = "rgb(114, 72, 9)"
                    keyElement.style.color = "blanchedalmond"
                }
            })

            document.addEventListener("keyup", (event) => {
                if (event.key.toLowerCase() === key.toLowerCase() || event.code.toLowerCase() === key.toLowerCase()) {
                    keyElement.style.backgroundColor = ""
                    keyElement.style.color = ""
                }
            })

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        })

        return fragment
    },

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleShift() {
        this.properties.shift = !this.properties.shift
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard_hidden");
        textArea.focus()
        
    },

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard_hidden");
        textArea.blur()
    }
}

window.addEventListener("DOMContentLoaded", () => {
    Keyboard.init();
})

document.addEventListener("keydown", function(event) {
    if (event.key === "CapsLock") {
        const capsButton = document.getElementById("button-caps")
        capsButton.classList.toggle("keyboard__key_active")
        capsButton.style.backgroundColor = "rgb(114, 72, 9)"
        capsButton.style.color = "blanchedalmond"
        setTimeout(() => {
            Keyboard._toggleCapsLock();
            Keyboard._rerenderKeyboard()
        }, 100)
    }
    if (event.key === "Shift") {
        const shiftButton = document.getElementById("button-shift")
        shiftButton.classList.toggle("keyboard__key_active")
        shiftButton.style.backgroundColor = "rgb(114, 72, 9)"
        shiftButton.style.color = "blanchedalmond"
        setTimeout(() => {
            Keyboard._toggleShift();
            Keyboard._toggleCapsLock();
            Keyboard._chahgeKeyboardVersion()
            Keyboard._rerenderKeyboard()
        }, 100)  
    }
    if (event.key === "Backspace") {
        let outputArr = Keyboard.properties.value.split("")
        outputArr.splice(textArea.selectionStart - 1, 1)
                        
        Keyboard.properties.value = outputArr.join("")
        Keyboard.positionCursor = textArea.selectionStart - 1
        setTimeout(() => {
            textArea.selectionStart = Keyboard.positionCursor
            textArea.selectionEnd = textArea.selectionStart
        }, 0)
    }
    if (event.key === "Enter") {
        let outputArr = Keyboard.properties.value.split("")
        outputArr.splice(textArea.selectionStart, 0, "\n")
                        
        Keyboard.properties.value = outputArr.join("")
        Keyboard.positionCursor = textArea.selectionStart + 1
        setTimeout(() => {
            textArea.selectionStart = Keyboard.positionCursor
            textArea.selectionEnd = textArea.selectionStart
        }, 0)
    }
    if (event.key === "ArrowLeft") {
        event.preventDefault()
        setTimeout(() => {
            textArea.selectionStart = textArea.selectionStart - 1
            textArea.selectionEnd = textArea.selectionStart
            Keyboard.positionCursor = textArea.selectionStart
        }, 0)
    }
    if (event.key === "ArrowRight") {
        event.preventDefault()
        setTimeout(() => {
            textArea.selectionStart = textArea.selectionStart + 1
            textArea.selectionEnd = textArea.selectionStart
            Keyboard.positionCursor = textArea.selectionStart
        }, 0)
    }
})

function startRec() {
    const recButton = document.getElementById("button-rec")
    recButton.classList.toggle("keyboard__key_active")
    if (recognition === null) {
        recognition = new SpeechRecognition()
        if (Keyboard.keyLayoutsLang = "eng") {
            recognition.lang = 'en-US'
        } else {
            recognition.lang = 'ru-RU'
        }
        recognition.addEventListener("result", (event) => {
            arrOfRec.push(event.results[0][0].transcript)
            textArea.value = arrOfRec.join(" ")
            Keyboard.properties.value = textArea.value
        })
        recognition.start()
        recognition.addEventListener("end", recognition.start)
    } else if (recognition !== null) {
        recognition.removeEventListener("end", recognition.start)
        recognition.stop()
        recognition = null
    }
}

function playAudio(file) {
    if (Keyboard.properties.sound) {
        file.currentTime = 0
        file.play()
    } 
}