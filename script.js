class PinLogin {
    constructor({element,loginEndpoint,redirectTo,maximumNumbers = Infinity}){
        this.element = {
            main: element,
            numberPad: element.querySelector('.pin-login__numberPad'),
            textDisplay: element.querySelector('.pin-login__text'),
        };
        this.loginEndpoint = loginEndpoint;
        this.redirectTo = redirectTo;
        this.maximumNumbers = maximumNumbers;
        this.value = "";
        this._generatePad();
    }
    _generatePad(){
        const padLayout = [
            "1","2","3",
            "4","5","6",
            "7","8","9",
            "backspace","0","done"
        ];
        padLayout.forEach(key => {
            const insertBreak = key.search(/[369]/) !== -1;
            const div = document.createElement('div');
            div.classList.add('pin-login__key');
            div.classList.toggle('material-icons',isNaN(key));
            div.textContent = key;
            div.addEventListener('click',() => {
                this._handleKeyPress(key);
            });
            this.element.numberPad.appendChild(div);
            if(insertBreak){
                this.element.numberPad.appendChild(document.createElement('br'));
            }
        });
    }
    _handleKeyPress(key){
        switch(key){
            case "backspace":
                this.value = this.value.substring(0,this.value.length - 1);
                break;
            case "done":
                this._attemptLogin();
                break;
            default:
                if(this.value.length < this.maximumNumbers && !isNaN(key)){
                    this.value += key;
                }
                break;
        }
        this._updateValueText();
    }
    _updateValueText(){
        this.element.textDisplay.value = '_'.repeat(this.value.length);
        this.element.textDisplay.classList.remove('pin-login__text--error');
    }
    _attemptLogin(){
        if(this.value.length > 0){
            fetch(this.loginEndpoint,{
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `pincode=${this.value}`
            }).then(response => {
                if(response.status === 200){
                    window.location.href = this.redirectTo;
                }else{
                    this.element.textDisplay.classList.add('pin-login__text--error');
                }
            });
        }
    }
}
new PinLogin({
    element: document.getElementById('mainPinLogin'),
    loginEndpoint: 'login.php',
    redirectTo: 'dashboard.html',
});