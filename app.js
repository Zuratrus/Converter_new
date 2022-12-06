const MAX_PERCENTAGE = 100;

const BarSize = {
    MAX_HEIGHT: 100,
    WIDTH: 20
};

const BarCoordinate = {
    INITIAL_X: 30,
    INITIAL_Y: 230
}

const Font = {
    SIZE: `18px`,
};

const LabelCoordinate = {
    INITIAL_X: 20,
    INITIAL_Y: 20
}

const Gap = {
    HORIZONTAL: 60,
    VERTICAL: 10
}

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');


const getData = (unit, coef) => {

    let data = []
    for (var i = 0; i < unit.length; i++) {
        var obj = {};
        obj.name = unit[i];
        obj.coef = coef[i];
        data.push(obj)
    }
    console.log(data)
    return data;
};

const renderChart = (items) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let currentLabelY = LabelCoordinate.INITIAL_Y;
    let currentBarX = BarCoordinate.INITIAL_X;
    const gapBetweenBars = BarSize.WIDTH + Gap.HORIZONTAL;

    for (const item of items) {
        const barHeight = (item.coef * BarSize.MAX_HEIGHT) / MAX_PERCENTAGE;
        console.log('barHeight', barHeight)
        ctx.fillStyle = '#2a1045';
        ctx.save();
        ctx.translate(0, canvas.height);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(`${item.name.toUpperCase()} ${item.coef}`, LabelCoordinate.INITIAL_X, currentLabelY);
        ctx.restore();
        ctx.fillStyle = '#daa7f0';
        ctx.fillRect(currentBarX, BarCoordinate.INITIAL_Y, BarSize.WIDTH, -barHeight);

        currentBarX += gapBetweenBars;
        currentLabelY += gapBetweenBars;
    }
};


let property = new Array(); 
let unit = new Array(); 
let coef = new Array(); 

property[0] = "Длина";
unit[0] = new Array("Метр (м)", "Сантиметр (см)", "Километр (км)", "Миллиметр (мм)");
coef[0] = new Array(1, .01, 1000, .001);

property[1] = "Валюта";
unit[1] = new Array("Рубль", "Доллар", "Евро", "Южноафриканские рэнды", "Армянские драмы");
coef[1] = new Array(1, 61.6175, 60.9216, 3.38084, 0.1570690);


let A = document.form_A.unit_menu;
let B = document.form_B.unit_menu;
let Add = document.form_new;


function FillMenu(menu, myArray) {
    let i;
    menu.length = myArray.length;
    for (i = 0; i < myArray.length; i++) {
        menu.options[i].text = myArray[i];
    }
}

function UpdateUnitMenu(propMenu, unitMenu) {
    let i = propMenu.selectedIndex;
    FillMenu(unitMenu, unit[i]);
    renderChart(getData(unit[i], coef[i]));
}


function CalculateUnit(sourceForm, targetForm) {
    let sourceValue = sourceForm.unit_input.value;
    sourceValue = parseFloat(sourceValue);
    if (!isNaN(sourceValue) || sourceValue == 0) {
        sourceForm.unit_input.value = sourceValue;
        ConvertFromTo(sourceForm, targetForm);
    }
}


function ConvertFromTo(sourceForm, targetForm) {
    console.log('sourceForm', sourceForm)
    console.log('targetForm', targetForm)
    console.group('Вычисление')
    let propIndex = document.property_form.property_menu.selectedIndex;
    console.log('propIndex', propIndex)
    let sourceIndex = sourceForm.unit_menu.selectedIndex;
    console.log('sourceIndex', sourceIndex)
    let sourceFactor = coef[propIndex][sourceIndex];
    console.log('sourceFactor', sourceFactor)
    let targetIndex = targetForm.unit_menu.selectedIndex;
    console.log('targetIndex', targetIndex)
    let targetFactor = coef[propIndex][targetIndex];
    console.log('targetFactor', targetFactor)
    let result = sourceForm.unit_input.value;
    console.log('result', result)
    result = result * sourceFactor;
    console.log('result', result)
    result = result / targetFactor;
    console.log('result', result)
    targetForm.unit_input.value = result;
    console.groupEnd();
}


function PushUnitMenu(sendForm) {
    let i = document.property_form.property_menu.selectedIndex;
    unit[i].push(sendForm.newUnitName_input.value)
    coef[i].push(sendForm.newUnitCoef_input.value)
    UpdateUnitMenu(document.property_form.property_menu, A);
    UpdateUnitMenu(document.property_form.property_menu, B)
}

document.addEventListener('DOMContentLoaded', ()=>{
    FillMenu(document.property_form.property_menu, property);
    UpdateUnitMenu(document.property_form.property_menu, A);
    UpdateUnitMenu(document.property_form.property_menu, B)
    renderChart(getData(unit[0], coef[0]));
})

