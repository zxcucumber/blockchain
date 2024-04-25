let web3 = new Web3(new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545'));
let selectAccount = document.getElementById('accounts');
let enterButton = document.getElementById('enter');
let acc = '';

async function getAccount() {
    let accounts = await web3.eth.getAccounts();
    for (const account of accounts) {
        let option = document.createElement('option');
        option.textContent = account;
        selectAccount.append(option)
    }
    return selectAccount;
}
getAccount();

enterButton.addEventListener('click', function () {
    window.location.href = 'home.html';
    localStorage.setItem('account', selectAccount.value);
});