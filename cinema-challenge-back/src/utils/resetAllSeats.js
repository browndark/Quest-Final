const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Session } = require('../models');
const connectDB = require('../config/db');

// Load environment variables
dotenv.config();

// Função para resetar o status de todos os assentos para "available"
const resetAllSeats = async () => {
  try {
    // Conectar ao banco de dados
    await connectDB();
    
    console.log('Conectado ao banco de dados. Iniciando reset dos assentos...');
    
    // Encontrar todas as sessões e atualizar o status dos assentos
    const sessions = await Session.find();
    
    let updatedCount = 0;
    
    for (const session of sessions) {
      // Atualizar todos os assentos para "available"
      session.seats = session.seats.map(seat => ({
        ...seat,
        status: 'available'
      }));
      
      // Salvar a sessão atualizada
      await session.save();
      updatedCount++;
      
      // Log de progresso a cada 10 sessões atualizadas
      if (updatedCount % 10 === 0) {
        console.log(`${updatedCount} de ${sessions.length} sessões processadas...`);
      }
    }
    
    console.log(`Concluído! ${updatedCount} sessões atualizadas com sucesso.`);
    console.log('Todos os assentos estão agora com status "available".');
    
    process.exit(0);
  } catch (error) {
    console.error('Erro ao resetar assentos:', error);
    process.exit(1);
  }
};

// Executar função
resetAllSeats();
