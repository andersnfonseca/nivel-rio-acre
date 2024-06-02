const nivel = document.getElementById('nivel');
const horario = document.getElementById('horario');
const title = document.getElementById('title');
const loading = document.querySelector('.loading');

const API_URL = 'https://nivelrioacreapi.vercel.app/';

const getNivelAndHour = async () => {
    try {
        const response = await fetch(`${API_URL}v1/api`);
        const data = await response.json();
         if (!data.Nivel) {
            throw new Error('Nível do rio não encontrado.');
        }
        nivel.textContent = (data.Nivel / 100).toFixed(2) + 'm';
        title.textContent = 'Nível do Rio Acre:';
        
        const horarioData = new Date(data.Horario);
        horarioData.setHours(horarioData.getHours() - 2);
        const dia = String(horarioData.getDate()).padStart(2, '0');
        const mes = String(horarioData.getMonth() + 1).padStart(2, '0');
        const ano = horarioData.getFullYear();
        const hora = String(horarioData.getHours()).padStart(2, '0');
        const minutos = String(horarioData.getMinutes()).padStart(2, '0');

        const horarioFormatado = `Última atualização em ${dia}/${mes}/${ano} às ${hora}:${minutos}h`;

        horario.textContent = horarioFormatado;
        loading.style.display = 'none'; 
        main.style.display = 'block'; 
    } catch (error) {
        console.error('Erro ao obter dados da API:', error);
        loading.innerHTML = 'Erro ao carregar os dados.'; 
    }
}

getNivelAndHour();
