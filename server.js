import express from 'express';
import { getV6DhcpLeases, blockMacAddress, getBlockedMacs, unblockMacAddress } from './index.js';

const app = express();
const port = 3000;

// Diz ao Express para servir os arquivos da pasta 'public'
app.use(express.json()); // Para interpretar JSON no corpo das requisições
app.use(express.static('public'));

// Rota que o frontend vai chamar para pegar os dados
app.post('/api/leases', getV6DhcpLeases);
app.post('/api/block', blockMacAddress);
app.post('/api/blocked', getBlockedMacs);
app.post('/api/unblock', unblockMacAddress);

app.listen(port, () => {
    console.log(`Servidor rodando! Acesse: http://localhost:${port}`);
});