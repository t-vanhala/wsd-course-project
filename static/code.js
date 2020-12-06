const selectFunction = () => {
    // Check which one report is chosen
    if (document.querySelector('#morning').checked) {
        return true;
    } else {
        return false;
    }
}