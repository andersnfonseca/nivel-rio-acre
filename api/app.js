const express = require('express');
const axios = require('axios');
const { parseString } = require('xml2js');
const getDate = require('./utils/getDate');
const today = getDate();
const app = express();
const initalDate = '24/02/2024'
require('dotenv').config();

app.get('/api', async (req, res) => {
  try {

    const response = await axios.get(process.env.API_URL + `&dataInicio=${initalDate}&dataFim=${today}`);

    parseString(response.data, (err, result) => {
      if (err) {
        throw err;
      }

      res.json(result);
    });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: 'Erro ao processar a requisição' });
  }
});

app.get('/api/nivel', async (req, res) => {
    try {

      const response = await axios.get(process.env.API_URL + `&dataInicio=${today}&dataFim=${today}`);
      console.log(process.env.API_URL + `&dataInicio=${today}&dataFim=${today}`)

        parseString(response.data, (err, result) => {
        if (err) {
          throw err;
        }
  
        if (result && result.DataTable && result.DataTable['diffgr:diffgram'] && result.DataTable['diffgr:diffgram'][0].DocumentElement && result.DataTable['diffgr:diffgram'][0].DocumentElement[0].DadosHidrometereologicos) {
          const dados = result.DataTable['diffgr:diffgram'][0].DocumentElement[0].DadosHidrometereologicos.map(dado => ({
            Horario: dado.DataHora[0],
            Nivel: dado.Nivel[0]
          }));  
          res.json(dados);
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
