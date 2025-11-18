// Definição dos grupos
      const grupo1Numeros = new Set([15,19,4,21,2,25,17,34,6,27,9,31,14,20,1,33,16,24,5,10
      ]);

      // Configurações do grid
      const MAX_LINHAS = 6;
      const MAX_COLUNAS = 30;

      // Estado da aplicação
      let resultados = [];
      const trackerContainer = document.getElementById('trackerContainer');
      const emptyState = document.getElementById('emptyState');
      const numeroInput = document.getElementById('numeroInput');

      // Event listener para tecla Enter
      numeroInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          adicionarNumero();
        }
      });

      // Função para determinar o tipo do número
      function obterTipo(numero) {

        return grupo1Numeros.has(numero) ? 'grupo-1' : 'grupo-2';
      }

      // Função para adicionar número
      function adicionarNumero() {
        const valor = parseInt(numeroInput.value, 10);

        if (isNaN(valor) || valor < 0 || valor > 36) {
          alert('Por favor, insira um número válido entre 0 e 36.');
          return;
        }

        resultados.push(valor);
        numeroInput.value = '';
        numeroInput.focus();
        renderizar();
      }

      // Função para desfazer última jogada
      function desfazer() {
        if (resultados.length === 0) return;
        resultados.pop();
        renderizar();
      }

      // Função para limpar tudo
      function limpar() {
        if (resultados.length === 0) return;

        if (confirm('Tem certeza que deseja limpar todos os registros?')) {
          resultados = [];
          renderizar();
        }
      }

      // Função principal de renderização
      function renderizar() {
        atualizarEstatisticas();
        renderizarTracker();
      }

      // Atualizar estatísticas
      function atualizarEstatisticas() {
        const total = resultados.length;
        const grupo1Count = resultados.filter(n => grupo1Numeros.has(n)).length;
        const grupo2Count = resultados.filter(n => n !== 0 && !grupo1Numeros.has(n)).length;
        //const zerosCount = resultados.filter(n => n === 0).length;

        document.getElementById('totalJogadas').textContent = total;
        document.getElementById('totalGrupo1').textContent = grupo1Count;
        document.getElementById('totalGrupo2').textContent = grupo2Count;

      }

      // Renderizar o tracker estilo Baccarat
      function renderizarTracker() {
        trackerContainer.innerHTML = '';

        if (resultados.length === 0) {
          emptyState.style.display = 'block';
          trackerContainer.style.display = 'none';
          return;
        }

        emptyState.style.display = 'none';
        trackerContainer.style.display = 'grid';

        trackerContainer.style.overflowX = 'auto';
        trackerContainer.style.overflowY = 'hidden';
        trackerContainer.style.maxWidth = '100%'; // ou valor fixo
        trackerContainer.style.gridTemplateColumns = 'repeat(30, 1fr)';
        trackerContainer.style.gridTemplateRows = 'repeat(6, 1fr)';


        // Inicializa matriz do grid
        const grid = Array(MAX_LINHAS).fill(0).map(() => Array(MAX_COLUNAS).fill(null));
        let colunaAtual = 0;
        let linhaAtual = 0;

        for (let i = 0; i < resultados.length; i++) {
          const numeroAtual = resultados[i];
          const tipoAtual = obterTipo(numeroAtual);

          // Lógica de navegação estilo Baccarat
          if (i > 0) {
            const numeroAnterior = resultados[i - 1];
            const tipoAnterior = obterTipo(numeroAnterior);

            // Se o tipo mudou OU se não há espaço na coluna atual
            if (tipoAtual !== tipoAnterior) {
              colunaAtual++;
              linhaAtual = 0;
            } else {
              // Mesmo tipo: tenta mover para baixo
              let proximaLinha = linhaAtual + 1;

              // Procura próxima linha vazia na coluna atual
              while (proximaLinha < MAX_LINHAS && grid[proximaLinha][colunaAtual] !== null) {
                proximaLinha++;
              }

              if (proximaLinha < MAX_LINHAS) {
                linhaAtual = proximaLinha;
              } else {
                // Sem espaço abaixo: move para direita na última linha
                colunaAtual++;
                linhaAtual = MAX_LINHAS - 1;
              }
            }
          }

          // Adiciona na grid se houver espaço
          if (colunaAtual < MAX_COLUNAS && grid[linhaAtual][colunaAtual] === null) {
            grid[linhaAtual][colunaAtual] = { tipo: tipoAtual, valor: numeroAtual };
          }
        }

        // Renderiza o grid visualmente
        for (let l = 0; l < MAX_LINHAS; l++) {
          for (let c = 0; c < MAX_COLUNAS; c++) {
            const cellData = grid[l][c];
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('cell');

            if (cellData) {
              const ballDiv = document.createElement('div');
              ballDiv.classList.add('ball', `${cellData.tipo}-ball`);
              ballDiv.textContent = cellData.valor;
              cellDiv.appendChild(ballDiv);
            }

            trackerContainer.appendChild(cellDiv);
          }
        }
      }

      // Inicialização
      renderizar();