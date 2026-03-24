# Gerenciador MikroTik MVP

Uma aplicação web leve construída com Node.js e Express para gerenciar dispositivos em uma rede local via MikroTik (RouterOS v6). Permite listar leases DHCP ativos (com a identidade do equipamento), aplicar bloqueios de MAC address no Firewall e remover bloqueios dinamicamente.

## 🚀 Funcionalidades

- **Identificação do Equipamento:** Busca e exibe o *System Identity* do MikroTik conectado.
- **Listagem de Leases:** Exibe os dispositivos atualmente conectados e com IP atribuído pelo servidor DHCP.
- **Bloqueio de MAC:** Cria uma regra de `drop` no Firewall (chain forward) e derruba o lease atual do dispositivo no DHCP, forçando a desconexão imediata.
- **Gerenciamento de Bloqueios:** Lista todos os MACs bloqueados no Firewall e permite o desbloqueio (remoção da regra) com um clique.

## 📋 Pré-requisitos

1. **Node.js** instalado na máquina (versão 14 ou superior).
2. **Git** instalado para clonar o repositório.
3. **MikroTik RouterOS v6** acessível pela rede.
4. **API Habilitada no MikroTik:**
   - No Winbox, vá em `IP` > `Services`.
   - Certifique-se de que o serviço `api` (porta 8728) está habilitado.

## 🛠️ Instalação

1. Clone este repositório para a sua máquina local:
   ```bash
   git clone [https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git](https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git)
   ```

2. Acesse a pasta do projeto:
   ```bash
   cd nome-da-pasta-do-projeto
   ```

3. Instale todas as dependências (Express e routeros-client):
   ```bash
   npm install
   ```

## ⚙️ Como Executar

1. No terminal, dentro da pasta do projeto, inicie o servidor:
   ```bash
   node server.js
   ```

2. Abra o seu navegador e acesse:
   ```text
   http://localhost:3000
   ```

3. Na interface web, insira o IP do seu MikroTik, usuário e senha para iniciar o gerenciamento.

## ⚠️ Observações de Segurança

- As credenciais de acesso são trafegadas do front-end para o back-end em texto plano neste MVP. Em um ambiente de produção real, é recomendado o uso de HTTPS.
- Certifique-se de que a porta 8728 do roteador não está exposta para a internet (WAN), permitindo acesso apenas da rede local (LAN).