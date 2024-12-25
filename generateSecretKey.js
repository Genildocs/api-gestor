const fs = require('fs');
const crypto = require('crypto');

//caminho para o arquivo env
const envFile = '.env';

// Função para gerar a chave secreta
function generateSecretKey() {
  return crypto.randomBytes(64).toString('base64');
}

// Adicionar ou atualizar a chave no arquivo .env
function ensureSecretKeyInEnv() {
  let envContent = '';

  if (fs.existsSync(envFile)) {
    envContent = fs.readFileSync(envFile, 'utf8');
  }

  // Verifica se já existe uma SECRET_KEY no arquivo
  if (envContent.includes('SECRET_KEY=')) {
    console.log('SECRET_KEY já existe no arquivo .env.');
    return;
  }

  const secretKey = generateSecretKey();
  envContent += `SECRET_KEY=${secretKey}\n`;
  fs.writeFileSync(envFile, envContent);

  console.log(`SECRET_KEY gerada e salva no arquivo .env: ${secretKey}`);
}

ensureSecretKeyInEnv();
