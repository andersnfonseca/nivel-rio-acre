const express = require('express');
const axios = require('axios');
const { parseString } = require('xml2js');
const app = express();
require('dotenv').config();
const cors = require('cors');
const { getToday, getYersteday } = require('./utils/getDate');
const today = getToday();
const yersteday = getYersteday();
app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.get('/v1/api', async (req, res) => {
  try {
    const response = await axios.get(process.env.API_URL + `&dataInicio=${yersteday}&dataFim=${today}`);
    parseString(response.data, (err, result) => {
      if (err) {
        throw err;
      }

      if (result && result.DataTable && result.DataTable['diffgr:diffgram'] && result.DataTable['diffgr:diffgram'][0].DocumentElement && result.DataTable['diffgr:diffgram'][0].DocumentElement[0].DadosHidrometereologicos) {
        const dados = result.DataTable['diffgr:diffgram'][0].DocumentElement[0].DadosHidrometereologicos.map(dado => ({
          Horario: dado.DataHora[0],
          Nivel: dado.Nivel[0]
        }));

        let ultimoNivel = null;
        let horarioUltimoNivel = null;
        for (let i = dados.length - 1; i >= 0; i--) {
          if (dados[i].Nivel !== "") {
            ultimoNivel = dados[i].Nivel;
            horarioUltimoNivel = dados[i].Horario;
            break;
          }
        }

        // Log do nível encontrado
        console.log('Último nível encontrado:', ultimoNivel);

        if (ultimoNivel !== null) {
          res.json({ Horario: horarioUltimoNivel, Nivel: ultimoNivel });
        } else {
          res.status(404).json({ error: 'Nenhum dado com nível encontrado' });
        }
      } else {
        res.status(404).json({ error: 'Dados não encontrados ou em formato inválido' });
      }
    });

  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: 'Erro ao processar a requisição' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
