# Contrato Inteligente LoteriaPrognosticos

## Descrição
O contrato `Valeoescrito` permite que usuários façam apostas em prognósticos e concorrem a prêmios com base nos resultados de um sorteio.

## Estruturas e Variáveis
- `Aposta`: Estrutura que armazena os prognósticos e o endereço do apostador.
- `dono`: Endereço do dono do contrato.
- `taxaAposta`: Taxa fixa para realizar uma aposta.
- `encerramentoApostas` e `reaberturaApostas`: Timestamps para encerrar e reabrir as apostas.
- `apostas`: Lista de todas as apostas realizadas.
- `resultados`: Lista dos resultados do sorteio.
- `sorteioRealizado`: Indicador se o sorteio foi realizado.
- `premiacao`: Mapeamento do valor da premiação para cada endereço de apostador.

## Funções
- `apostar(uint256[5] memory _prognosticos)`: Permite que um usuário faça uma aposta.
- `validarPrognosticos(uint256[5] memory _prognosticos)`: Valida os prognósticos.
- `realizarSorteio(uint256[] memory _resultados)`: Realiza o sorteio.
- `distribuirPremios()`: Distribui os prêmios para os vencedores.
- `calcularPontos(uint256[5] memory _prognosticos)`: Calcula os pontos de um apostador.
- `reabrirApostas()`: Reabre as apostas após o encerramento e sorteio.
- `tratarErrosUnicode(string memory _entrada)`: Trata erros de codificação Unicode.

## Eventos
- `ApostaRealizada(address indexed apostador, uint256[5] prognosticos)`: Evento emitido quando uma aposta é realizada.
- `SorteioRealizado(uint256[] resultados)`: Evento emitido quando o sorteio é realizado.
- `PremioDistribuido(address indexed apostador, uint256 valor)`: Evento emitido quando um prêmio é distribuído.

## Modificadores
- `apenasDono()`: Restringe a execução de certas funções apenas para o dono do contrato.
- `apostasAbertas()`: Verifica se as apostas estão abertas.
- `apostasFechadas()`: Verifica se as apostas estão encerradas e o sorteio ainda não foi realizado.

## Notas Adicionais
- As apostas são encerradas após um período de 5 dias e reabertas 2 dias após o encerramento.
- Os resultados do sorteio devem conter exatamente 5 números.
- As apostas válidas devem conter números entre 1 e 625.
