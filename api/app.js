const express = require('express');
const axios = require('axios');
const { parseString } = require('xml2js');
const getDate = require('./utils/getDate');
const today = getDate();
const app = express();
const initalDate = '24/02/2024'
require('dotenv').config();
const cors = require('cors')

app.use(cors())

app.get('/', async (req, res) => {
  res.setHeader('Cache Control', 'no-cache', 'no-store', 'must-revalidate');
  try {

    const response = await axios.get(process.env.API_URL + `&dataInicio=${initalDate}&dataFim=${today}`);
      parseString(response.data, (err, result) => {
      if (err) {
        throw err;
      }

      if (result && result.DataTable && result.DataTable['diffgr:diffgram'] && result.DataTable['diffgr:diffgram'][0].DocumentElement && result.DataTable['diffgr:diffgram'][0].DocumentElement[0].DadosHidrometereologicos) {
        const dados = result.DataTable['diffgr:diffgram'][0].DocumentElement[0].DadosHidrometereologicos.map(dado => ({
          Horario: dado.DataHora[0],
          Nivel: dado.Nivel[0]
        }));  
        res.json(dados[0]);
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
