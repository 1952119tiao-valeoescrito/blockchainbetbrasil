// Importando Web3
const Web3 = require('web3');

// Conectando ao provedor da rede (neste caso, usando Infura)
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');

// Endereço do contrato inteligente
const contractAddress = '0x...'; // Substitua pelo endereço do seu contrato

// ABI do contrato (Application Binary Interface)
const abi = [
    // Coloque o ABI do seu contrato aqui
];

// Criando uma instância do contrato
const contract = new web3.eth.Contract(abi, contractAddress);

// Função para chamar uma função do contrato
async function callContractFunction() {
    try {
        const result = await contract.methods.yourFunction().call();
        console.log('Resultado da chamada do contrato:', result);
    } catch (error) {
        console.error('Erro ao chamar a função do contrato:', error);
    }
}

// Executando a função
callContractFunction();
