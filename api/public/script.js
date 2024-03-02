const nivel = document.getElementById('nivel');
const horario = document.getElementById('horario');
const API_URL = window.location.href;

const getNivelAndHour = async () => {

    const response = await fetch(`${API_URL}v1/api`);
    const data = await response.json();
    nivel.innerHTML = (data.Nivel / 100).toFixed(2) + 'm';

    const horario = new Date(data.Horario);
    const dia = String(horario.getDate()).padStart(2, '0');
    const mes = String(horario.getMonth() + 1).padStart(2, '0');
    const ano = horario.getFullYear();
    const hora = String(horario.getHours()).padStart(2, '0');
    const minutos = String(horario.getMinutes()).padStart(2, '0');

    const horarioFormatado = `Última atualização em ${dia}/${mes}/${ano} às ${hora}:${minutos}h`;

    document.getElementById('horario').innerHTML = horarioFormatado;
}
getNivelAndHour();
