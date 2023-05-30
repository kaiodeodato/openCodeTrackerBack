const root = document.documentElement;

// Change the values of CSS variables
function handleColors() {
  const rootStyles = getComputedStyle(document.documentElement);
  const mainColor = rootStyles.getPropertyValue('--main-color');
  const supportColor1 = rootStyles.getPropertyValue('--support-color-1');

  // Check if the colors are default
  if (mainColor === '#01161e' && supportColor1 === '#124559') {
    // Generate random colors
    const randomMainColor = generateRandomColor();
    const randomSupportColor1 = generateRandomColor();
    const randomSupportColor2 = generateRandomColor();
    const randomSupportColor3 = generateRandomColor();
    const randomSupportColor4 = generateRandomColor();
    const randomTextColor1 = generateRandomColor();
    const randomTextColor2 = generateRandomColor();

    // Save the generated colors in local storage
    localStorage.setItem('--main-color', randomMainColor);
    localStorage.setItem('--support-color-1', randomSupportColor1);
    localStorage.setItem('--support-color-2', randomSupportColor2);
    localStorage.setItem('--support-color-3', randomSupportColor3);
    localStorage.setItem('--support-color-4', randomSupportColor4);
    localStorage.setItem('--text-color-1', randomTextColor1);
    localStorage.setItem('--text-color-2', randomTextColor2);

    // Set the CSS variables with the generated colors
    root.style.setProperty('--main-color', randomMainColor);
    root.style.setProperty('--support-color-1', randomSupportColor1);
    root.style.setProperty('--support-color-2', randomSupportColor2);
    root.style.setProperty('--support-color-3', randomSupportColor3);
    root.style.setProperty('--support-color-4', randomSupportColor4);
    root.style.setProperty('--text-color-1', randomTextColor1);
    root.style.setProperty('--text-color-2', randomTextColor2);
  } else {
    // Reset to default colors
    root.style.setProperty('--main-color', '#01161e');
    root.style.setProperty('--support-color-1', '#124559');
    root.style.setProperty('--support-color-2', '#598392');
    root.style.setProperty('--support-color-3', '#aec3b0');
    root.style.setProperty('--support-color-4', '#79a27d');
    root.style.setProperty('--text-color-1', '#01161e');
    root.style.setProperty('--text-color-2', '#eff6e0');

    // Remove the generated colors from local storage
    localStorage.removeItem('--main-color');
    localStorage.removeItem('--support-color-1');
    localStorage.removeItem('--support-color-2');
    localStorage.removeItem('--support-color-3');
    localStorage.removeItem('--support-color-4');
    localStorage.removeItem('--text-color-1');
    localStorage.removeItem('--text-color-2');
  }
}

function generateRandomColor() {
  const randomColor = Math.floor(Math.random() * 16777215);
  const hexColor = '#' + randomColor.toString(16).padStart(6, '0');
  return hexColor;
}

function setColorsFromLocalStorage() {
  const mainColor = localStorage.getItem('--main-color');
  const supportColor1 = localStorage.getItem('--support-color-1');
  const supportColor2 = localStorage.getItem('--support-color-2');
  const supportColor3 = localStorage.getItem('--support-color-3');
  const supportColor4 = localStorage.getItem('--support-color-4');
  const textColor1 = localStorage.getItem('--text-color-1');
  const textColor2 = localStorage.getItem('--text-color-2');

  if (mainColor && supportColor1 && supportColor2 && supportColor3 && supportColor4 && textColor1 && textColor2) {
    root.style.setProperty('--main-color', mainColor);
    root.style.setProperty('--support-color-1', supportColor1);
    root.style.setProperty('--support-color-2', supportColor2);
    root.style.setProperty('--support-color-3', supportColor3);
    root.style.setProperty('--support-color-4', supportColor4);
    root.style.setProperty('--text-color-1', textColor1);
    root.style.setProperty('--text-color-2', textColor2);
  }
}

setColorsFromLocalStorage();


function handleDisplay(){
    let display = document.getElementById('display')
    const computedStyle = getComputedStyle(display)
    console.log(display.style.height)
    if (computedStyle.height == '0px'){
        display.style.height = '500px'
    }else{
        display.style.height = '0px'
    }
}