import { RouterOSClient } from 'routeros-client';

export async function getV6DhcpLeases(req, res) {
    const {host, user, password} = req.body; 
    const api = new RouterOSClient({
        host: host,
        user: user,
        password: password,
        port: 8728, 
        keepalive: true 
    });
    try {
        
        const client = await api.connect();

        
        const identityMenu = client.menu('/system identity');
        const identityResult = await identityMenu.get();

        
        const systemName = identityResult.length > 0 ? identityResult[0].name : 'Router Desconhecido';
        
        
        const dhcpMenu = client.menu('/ip dhcp-server lease');
        
        
        const leases = await dhcpMenu.get();

        let result = [];
        leases.forEach(lease => {
            
            const mac = lease['activeMacAddress'] || lease['mac-address'];
            const hostName = lease['hostName'] || 'Hostname não reportado';
            const ip = lease['activeAddress'] || lease['address'];
            
            
            if (lease.status === 'bound') {
                result.push({ mac, hostName, ip });
            }
        });

        res.json({
            identity: systemName,
            leases: result
        });

    } catch (error) {
        res.status(500).json({ error: 'Falha ao conectar via API v6: ' + error.message });
        console.error('Falha ao conectar via API v6:', error.message);
    } finally {
        
        api.close();
    }
}

async function getIpAddresses() {
    try {
        
        const client = await api.connect();
        
        
        const ipMenu = client.menu('/ip address');
        
        
        const addresses = await ipMenu.get();




        addresses.forEach(address => {
            
            const ip = address['address'];
            const ifa = address['interface'];
            const network = address['network'];
    
        });

    } catch (error) {
        console.error('Falha ao conectar via API v6:', error.message);
    } finally {
        
        api.close();
    }
}

export async function blockMacAddress(req, res) {
    const { host, user, password, macToBlock } = req.body;

    if (!host || !user || !password || !macToBlock) {
        return res.status(400).json({ error: 'Dados de conexão e o MAC são obrigatórios.' });
    }

    const api = new RouterOSClient({ host, user, password, port: 8728 });

    try {
        const client = await api.connect();
        
        
        const firewallMenu = client.menu('/ip firewall filter');
        await firewallMenu.add({
            chain: 'forward',
            'src-mac-address': macToBlock,
            action: 'drop',
            comment: `Bloqueado via App Node.js - ${new Date().toLocaleString('pt-BR')}`
        });

        
        const dhcpMenu = client.menu('/ip dhcp-server lease');
        const leases = await dhcpMenu.get(); 
        
        
        const leaseToRemove = leases.find(lease => 
            lease['macAddress'] === macToBlock || 
            lease['activeMacAddress'] === macToBlock
        );

        
        if (leaseToRemove && leaseToRemove['id']) {
            await dhcpMenu.remove(leaseToRemove['id']);
    
        }

        res.json({ success: true, message: `MAC ${macToBlock} bloqueado e removido do DHCP!` });

    } catch (error) {
        console.error('Falha na operação:', error.message);
        res.status(500).json({ error: 'Falha ao aplicar alterações no MikroTik: ' + error.message });
    } finally {
        api.close();
    }
}

export async function getBlockedMacs(req, res) {
    const { host, user, password } = req.body;

    if (!host || !user || !password) {
        return res.status(400).json({ error: 'Dados de conexão obrigatórios.' });
    }

    const api = new RouterOSClient({ host, user, password, port: 8728 });

    try {
        const client = await api.connect();
        const firewallMenu = client.menu('/ip firewall filter');
        
        
        const rules = await firewallMenu.get();

        
        const blocked = rules
            .filter(rule => rule['srcMacAddress'] && rule.action === 'drop')
            .map(rule => ({
                id: rule['id'], 
                mac: rule['srcMacAddress'],
                comment: rule.comment || 'Sem comentário'
            }));

        res.json(blocked);

    } catch (error) {
        console.error('Erro ao listar bloqueados:', error.message);
        res.status(500).json({ error: 'Falha ao buscar bloqueios.' });
    } finally {
        api.close();
    }
}

export async function unblockMacAddress(req, res) {
    const { host, user, password, ruleId } = req.body;

    if (!host || !user || !password || !ruleId) {
        return res.status(400).json({ error: 'Dados de conexão e o ID da regra são obrigatórios.' });
    }

    const api = new RouterOSClient({ host, user, password, port: 8728 });

    try {
        const client = await api.connect();
        const firewallMenu = client.menu('/ip firewall filter');
        
        
        await firewallMenu.remove(ruleId);

        res.json({ success: true, message: 'Dispositivo desbloqueado com sucesso!' });

    } catch (error) {
        console.error('Erro ao desbloquear MAC:', error.message);
        res.status(500).json({ error: 'Falha ao remover bloqueio no MikroTik.' });
    } finally {
        api.close();
    }
}

