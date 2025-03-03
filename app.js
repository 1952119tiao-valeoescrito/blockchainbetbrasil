const contractAddress = 'ENDERECO_DO_CONTRATO';
const contractABI = [
    // ABI do contrato vai aqui (você pode gerar utilizando o compilador do Solidity)
];

document.addEventListener('DOMContentLoaded', () => {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

    const loteriaPrognosticos = new web3.eth.Contract(contractABI, contractAddress);

    document.getElementById('apostaForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const prognosticos = document.getElementById('prognosticos').value.split(',').map(Number);
        const accounts = await web3.eth.getAccounts();

        try {
            await loteriaPrognosticos.methods.apostar(prognosticos).send({
                from: accounts[0],
                value: web3.utils.toWei('0.00033', 'ether')
            });
            showMessage('Aposta realizada com sucesso!');
        } catch (error) {
            showMessage('Erro ao realizar aposta: ' + error.message);
        }
    });

    document.getElementById('realizarSorteio').addEventListener('click', async () => {
        const resultados = [1, 2, 3, 4, 5]; // Substituir pelos resultados reais
        const accounts = await web3.eth.getAccounts();

        try {
            await loteriaPrognosticos.methods.realizarSorteio(resultados).send({ from: accounts[0] });
            showMessage('Sorteio realizado com sucesso!');
        } catch (error) {
            showMessage('Erro ao realizar sorteio: ' + error.message);
        }
    });

    document.getElementById('distribuirPremios').addEventListener('click', async () => {
        const accounts = await web3.eth.getAccounts();

        try {
            await loteriaPrognosticos.methods.distribuirPremios().send({ from: accounts[0] });
            showMessage('Prêmios distribuídos com sucesso!');
        } catch (error) {
            showMessage('Erro ao distribuir prêmios: ' + error.message);
        }
    });

    document.getElementById('reabrirApostas').addEventListener
