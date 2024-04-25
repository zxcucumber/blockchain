let web3 = new Web3(new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545'));
const addressContract = "0xB30460085b650d2CA0D875C210D37Ca295503971";
const abi = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "canselTransaction",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_codeWord",
				"type": "string"
			}
		],
		"name": "getMoney",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_recipient",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_codeWord",
				"type": "string"
			}
		],
		"name": "sendMoney",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTransfers",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "sender",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "recipient",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "codeWord",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "sum",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "status",
						"type": "bool"
					}
				],
				"internalType": "struct Transfer.transferMoney[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "transferList",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "codeWord",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "sum",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "status",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
const myContract = new web3.eth.Contract(abi, addressContract);
const account = localStorage.getItem('account')

async function welcomeHome() {
    let welcome = document.getElementById('welcome');
    let balanceText = document.getElementById('balance');

    welcome.textContent = `Добро пожаловать, ${account}!`;

    let balance = await web3.eth.getBalance(account);
    correctBalance = await web3.utils.fromWei(balance, 'ether')
    
    balanceText.textContent = `Ваш баланс: ${correctBalance} ETH`
}
document.addEventListener('DOMContentLoaded', welcomeHome());
let select = document.getElementById('select');

async function createTransfer() {
    let sendForm = document.querySelector('.sendMoney');
    sendForm.classList.add('sendMoney1')
    
    let accounts = await web3.eth.getAccounts();
    for (const acc of accounts) {
        let option = document.createElement('option');
        option.textContent = acc;
        select.append(option)
        if (acc === account) {
            select.remove(option)
        }
    }

}

async function sendMoney() {
    let sum = document.getElementById('sum').value;
    let codeword = document.getElementById('codeWord').value;
    let sumInWei = await web3.utils.toWei(sum, 'ether');
    await myContract.methods.sendMoney(select.value, codeword).send(
        {
            from: account,
            value: sumInWei,
            gas: 200000
        }
    )
}

async function getMoney() {
    let buttonConsole = document.createElement('button');
    let arr = await myContract.methods.getTransfers().call();
    console.log(arr.length);
    let codeWord = document.getElementById('codeWord').value;
    let ul = document.querySelector(".getMoney__list")
    for (let i of arr) {
        if (localStorage.getItem("account") == i.recipient && i.status == true) {
            let li = document.createElement('li');
            let div = document.createElement('div');
            let inputCodeWord = document.createElement('input');
            let buttonGet = document.createElement('button');
            buttonGet.textContent = 'получить'
            div.textContent = i.sender
            let sum = i.sum
            ul.append(li, buttonConsole)
            li.append(div, sum, inputCodeWord, buttonGet);
            buttonGet.addEventListener('click', async function () {
                if (inputCodeWord.value === i.codeWord) {
                    await myContract.methods.getMoney(i.id, inputCodeWord.value).send({
                        from: account,
                        gas: 200000
                    });
                }
                ul.remove(li)
            })    
        }
    }
    console.log(arr)
}

// async function historyOfTransactions() {
//     let arr = await myContract.methods.getTransfers().call();
//     let ul = document.createElement('ul')
//     for (const i of arr) {
//         document.createElement('div');
//         div.textContent = i
//         ul.append(div)
//     }
//     document.body.append(ul)
// }
// let historyButton = document.getElementById('history');
// historyButton.addEventListener('click', historyOfTransactions)

let sendButton = document.getElementById('send');
sendButton.addEventListener('click', function () {
    createTransfer()
    sendButton.disabled = true
})

let exitButton = document.getElementById('exit');
exitButton.addEventListener('click', function () {
    window.location.href = "registration.html"
    localStorage.removeItem('account')
})

let goSend = document.getElementById('goSend');
goSend.addEventListener('click', function () {
    sendMoney()
})
let getButton = document.getElementById('get');
getButton.addEventListener('click', function () {
    let getMon = document.querySelector('.getMoney');
    getMon.classList.add('getMoney1')
    getMoney()
})
