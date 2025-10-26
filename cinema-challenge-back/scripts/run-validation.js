/**
 * Script para executar a validação da API
 */
const path = require('path');
const colors = require('colors');
const { spawn } = require('child_process');

console.log(colors.cyan('=== Cinema App API Validator ==='));
console.log(colors.yellow('Verificando se o servidor está em execução...'));

// Verifica se o servidor está em execução fazendo uma chamada simples
const axios = require('axios');

axios.get('http://localhost:3000/api/v1/movies')
  .then(() => {
    console.log(colors.green('✓ Servidor está em execução.'));
    runValidationScript();
  })
  .catch(err => {
    console.log(colors.red('✗ Servidor não está em execução ou não está respondendo.'));
    console.log(colors.yellow('Por favor, inicie o servidor antes de executar este script.'));
    console.log(colors.yellow('Comando: npm run start'));
  });

function runValidationScript() {
  const validationScriptPath = path.join(__dirname, 'validate-api.js');
  console.log(colors.yellow(`Executando ${validationScriptPath}`));
  
  const proc = spawn('node', [validationScriptPath], {
    stdio: 'inherit'
  });
  
  proc.on('close', (code) => {
    if (code !== 0) {
      console.log(colors.red(`Processo encerrado com código ${code}`));
    }
  });
}
