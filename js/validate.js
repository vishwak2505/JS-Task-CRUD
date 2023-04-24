let wrongInput = 'wrong-input';

function validateInput(tag) {

    let value = document.getElementsByClassName(tag)[0].value;
    if (value == '') {
        document.getElementsByClassName(tag)[0].classList.add(wrongInput);
    } else {
        document.getElementsByClassName(tag)[0].classList.remove(wrongInput);
    }
}
