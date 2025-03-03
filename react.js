import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import LoteriaPrognosticosABI from './LoteriaPrognosticos.json'; // Importe o ABI do seu contrato
import './App.css'; // Importe seu arquivo CSS

const contractAddress = 'SEU_ENDEREÇO_DO_CONTRATO'; // Substitua pelo endereço do seu contrato

function App() {
    const [account, setAccount] = useState(null);
    const [provedor, setProvedor] = useState(null);
    const [contrato, setContrato] = useState(null);
    const [taxaAposta, setTaxaAposta] = useState(0);
    const [prognosticos, setPrognosticos] = useState([]);
    const [prognosticosSelecionados, setPrognosticosSelecionados] = useState([]);
    const [mensagem, setMensagem] = useState('');
    const [novosPrognosticos, setNovosPrognosticos] = useState('');
    const [administrador, setAdministrador] = useState(false);

    useEffect(() => {
        conectarCarteira();
    }, []);

    async function conectarCarteira() {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(contractAddress, LoteriaPrognosticosABI.abi, signer);

                setAccount(accounts[0]);
                setProvedor(provider);
                setContrato(contract);
                await verificarAdministrador(accounts[0], contract);
                await carregarTaxaDeAposta(contract);
                await carregarPrognosticos(contract);

                console.log("Carteira conectada:", accounts[0]);
            } catch (error) {
                console.error("Erro ao conectar a carteira:", error);
                setMensagem(`Erro ao conectar a carteira: ${error.message}`);
            }
        } else {
            setMensagem("Por favor, instale o MetaMask!");
        }
    }

    async function verificarAdministrador(conta, contrato) {
        try {
            const dono = await contrato.dono();
            setAdministrador(conta.toLowerCase() === dono.toLowerCase());
        } catch (error) {
            console.error("Erro ao verificar o administrador:", error);
        }
    }

    async function carregarTaxaDeAposta(contrato) {
        try {
            const taxa = await contrato.taxaAposta();
            setTaxaAposta(ethers.utils.formatEther(taxa));
        } catch (error) {
            console.error("Erro ao carregar a taxa de aposta:", error);
        }
    }

    async function carregarPrognosticos(contrato) {
        try {
            const proximoId = await contrato.proximoIdPrognostico();
            const prognosticosCarregados = [];

            for (let i = 1; i < proximoId; i++) {
                try {
                    const descricao = await contrato.obterPrognostico(i);
                    prognosticosCarregados.push({ id: i, descricao: descricao });
                } catch (error) {
                    console.error(`Erro ao carregar o prognóstico ${i}:`, error);
                    setMensagem(`Erro ao carregar o prognóstico ${i}: ${error.message}`);
                }
            }

            setPrognosticos(prognosticosCarregados);
        } catch (error) {
            console.error("Erro ao carregar os prognósticos:", error);
            setMensagem(`Erro ao carregar os prognósticos: ${error.message}`);
        }
    }

    const handlePrognosticoClick = (id) => {
        if (prognosticosSelecionados.includes(id)) {
            setPrognosticosSelecionados(prognosticosSelecionados.filter((prognosticoId) => prognosticoId !== id));
        } else {
            if (prognosticosSelecionados.length < 5) {
                setPrognosticosSelecionados([...prognosticosSelecionados, id]);
            } else {
                setMensagem("Você pode selecionar no máximo 5 prognósticos.");
            }
        }
    };

    async function apostar() {
        if (!account) {
            setMensagem("Por favor, conecte sua carteira!");
            return;
        }

        if (prognosticosSelecionados.length !== 5) {
            setMensagem("Por favor, selecione 5 prognósticos!");
            return;
        }

        try {
            const prognosticosParaAposta = prognosticosSelecionados.map(Number);
            const valorAposta = ethers.utils.parseEther(String(taxaAposta));

            const transaction = await contrato.apostar(prognosticosParaAposta, {
                value: valorAposta
            });

            setMensagem("Aposta realizada. Aguardando confirmação...");
            await transaction.wait();
            setMensagem("Aposta confirmada com sucesso!");
            setPrognosticosSelecionados([]); // Limpa a seleção
        } catch (error) {
            console.error("Erro ao apostar:", error);
            setMensagem(`Erro ao realizar a aposta: ${error.message}`);
        }
    }

    async function adicionarPrognostico() {
        if (!account || !administrador) {
            setMensagem("Você não tem permissão para adicionar prognósticos!");
            return;
        }

        if (!novosPrognosticos.trim()) {
            setMensagem("A descrição do prognóstico não pode estar vazia.");
            return;
        }

        try {
            const transaction = await contrato.adicionarPrognostico(novosPrognosticos);
            setMensagem("Adicionando prognóstico. Aguardando confirmação...");
            await transaction.wait();
            setMensagem("Prognóstico adicionado com sucesso!");
            setNovosPrognosticos(''); // Limpa o input
            await carregarPrognosticos(contrato); // Recarrega os prognósticos
        } catch (error) {
            console.error("Erro ao adicionar prognóstico:", error);
            setMensagem(`Erro ao adicionar prognóstico: ${error.message}`);
        }
    }

    return (
        <div className="app-container">
            <h1>Loteria de Prognósticos</h1>
            {mensagem && <div className="message">{mensagem}</div>}
            {!account ? (
                <button onClick={conectarCarteira} className="connect-button">Conectar Carteira</button>
            ) : (
                <>
                    <p>Carteira Conectada: {account}</p>
                    <p>Taxa de Aposta: {taxaAposta} ETH</p>

                    <div className="prognosticos-container">
                        <h2>Selecione seus Prognósticos (5):</h2>
                        <ul className="prognosticos-list">
                            {prognosticos.map((prognostico) => (
                                <li
                                    key={prognostico.id}
                                    className={`prognostico-item ${prognosticosSelecionados.includes(prognostico.id) ? 'selecionado' : ''}`}
                                    onClick={() => handlePrognosticoClick(prognostico.id)}
                                >
                                    {prognostico.id}: {prognostico.descricao}
                                </li>
                            ))}
                        </ul>
                        {prognosticosSelecionados.length > 0 && (
                            <div className="selecionados-container">
                                <h3>Prognósticos Selecionados:</h3>
                                <ul className="selecionados-list">
                                    {prognosticosSelecionados.map((id) => {
                                        const prognostico = prognosticos.find((p) => p.id === id);
                                        return (
                                            <li key={id}>
                                                {prognostico ? `${prognostico.id}: ${prognostico.descricao}` : "Prognóstico não encontrado"}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}

                        <button onClick={apostar} className="apostar-button" disabled={prognosticosSelecionados.length !== 5}>
                            Apostar
                        </button>
                    </div>

                    {administrador && (
                        <div className="admin-section">
                            <h2>Admin Section</h2>
                            <div className="add-prognostico">
                                <input
                                    type="text"
                                    value={novosPrognosticos}
                                    onChange={(e) => setNovosPrognosticos(e.target.value)}
                                    placeholder="Descrição do novo prognóstico"
                                />
                                <button onClick={adicionarPrognostico}>Adicionar Prognóstico</button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default App;
