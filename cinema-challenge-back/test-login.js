const axios = require('axios');

const API_URL = 'http://localhost:5000/api/v1';

async function testLogin() {
  try {
    console.log('🧪 Testando login no sistema...\n');

    // Credenciais do seed
    const credentials = {
      email: 'user@example.com',
      password: 'password123'
    };

    console.log('📧 Tentando login com:', credentials.email);

    const response = await axios.post(`${API_URL}/auth/login`, credentials);

    if (response.data.success && response.data.data.token) {
      console.log('✅ LOGIN FUNCIONANDO!');
      console.log('\nResposta:', JSON.stringify(response.data, null, 2));
      console.log('\n🔑 Token gerado:', response.data.data.token.substring(0, 50) + '...');
      
      // Testar endpoint protegido
      console.log('\n🔒 Testando endpoint protegido /auth/me...');
      const meResponse = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${response.data.data.token}`
        }
      });
      
      console.log('✅ Endpoint protegido funcionando!');
      console.log('Dados do usuário:', JSON.stringify(meResponse.data, null, 2));
      
      return true;
    } else {
      console.log('❌ Login falhou - Token não foi gerado');
      console.log('Resposta:', JSON.stringify(response.data, null, 2));
      return false;
    }
  } catch (error) {
    if (error.response) {
      console.log(`❌ Erro ${error.response.status}:`, error.response.data);
      
      if (error.response.status === 401) {
        console.log('\n⚠️  PROBLEMA: Credenciais inválidas ou usuário não existe');
        console.log('   Solução: Execute "npm run seed" para criar usuários de teste');
      }
    } else if (error.code === 'ECONNREFUSED') {
      console.log('❌ ERRO: Servidor não está rodando!');
      console.log('   Solução: Execute "npm start" ou "npm run dev" em outro terminal');
    } else {
      console.log('❌ Erro:', error.message);
    }
    return false;
  }
}

// Executar teste
testLogin().then(success => {
  process.exit(success ? 0 : 1);
});
