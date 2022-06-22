
var numberInputs = {};

function addNumberInput(numbInp) {
    numberInputs[numbInp.id] = numbInp;
}

function removeNumberInput(id) {
    if (id in numberInputs) {
        delete numberInputs[id];
    }
}

function getNumberInput(id) {
    if (typeof id == "string") {
        if (id in numberInputs) {
            return numberInputs[id];
        }
        return null;
    }
    return numberInputs[id.id];
}

function checkExisting() {
    let keyArray = Object.keys(numberInputs);
    for (let i = 0; i < keyArray.length; i++) {
        let key = keyArray[i];
        if (!numberInputs[key].checkExisting()) {
            removeNumberInput(key);
        }
    }
}

class NumberInput {
    constructor(id, value=0, minValue=null, maxValue=null, subString=null) {
        this.id = id;
        this.value = value;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.changeFnc = null;
        this.subString = subString;

        let cls = "numberInputDiv";
        let txt = this.value;
        if (this.subString != null) {
            txt = this.subString;
            cls = "numberInputCenterDiv";
        }

        this.element = createElement("div", null, "", [
            {"name": "id", "value": id},
            {"name": "class", "value": cls}
        ]);

        createElement("button", this.element, "-", [
            {"name": "id", "value": `subButt${id}`},
            {"name": "onclick", "value": `getNumberInput(${id}).sub()`}
        ]);
        createElement("label", this.element, txt, [
            {"name": "id", "value": `lbl${id}`}
        ]);
        createElement("button", this.element, "+", [
            {"name": "id", "value": `addButt${id}`},
            {"name": "onclick", "value": `getNumberInput(${id}).add()`}
        ]);
        
        this.element.addEventListener("onremove", this.remove);
    }

    setMinimum(minValue) {
        this.minValue = minValue;
    }

    setMaximum(maxValue) {
        this.maxValue = maxValue;
    }

    add(value=1) {
        if (this.maxValue != null && this.maxValue < this.value+value) {
            this.value = this.maxValue;
        }
        else if (this.minValue != null && this.minValue > this.value+value) {
            this.value = this.minValue;
        }
        else {
            this.value += value;
        }
        this.change();
    }

    sub(value=1) {
        this.add(value*-1);
    }

    getValue() {
        return this.value;
    }

    getLabel() {
        return document.getElementById(`lbl${this.id}`);
    }

    getElement() {
        return document.getElementById(this.id);
    }

    getElementOuterHtml() {
        return this.element.outerHTML;
    }

    setChange(fnc) {
        this.changeFnc = fnc;
    }

    change() {
        if (this.subString != null) {
            this.getLabel().innerHTML = this.subString;
        }
        else {
            this.getLabel().innerHTML = this.value;
            if (this.maxValue == this.value) {
                document.getElementById(`addButt${this.id}`).classList.add("noMoreButton");
            } else {
                document.getElementById(`addButt${this.id}`).classList.remove("noMoreButton");
            }
            if (this.minValue == this.value) {
                document.getElementById(`subButt${this.id}`).classList.add("noMoreButton");
            } else {
                document.getElementById(`subButt${this.id}`).classList.remove("noMoreButton");
            }
        }
        this.changeFnc();
    }

    remove() {
        removeNumberInput(this.id);
    }

    addEventListener(name, fnc) {
        this.getElement().addEventListener(name, fnc);
    }

    checkExisting() {
        if (this.getElement() == null) return false;
        return true;
    }
}