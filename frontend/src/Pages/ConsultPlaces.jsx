import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ConsultarLugar = () => {
  const { lugarId } = useParams();
  const [lugar, setLugar] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLugar = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/lugares/${lugarId}`);
        setLugar(response.data);
      } catch (err) {
        setError(err.response.data.error);
      }
    };

    fetchLugar();
  }, [lugarId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!lugar) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h1>{lugar.nombre_lugar}</h1>
      <p>Tipo de lugar: {lugar.tipo_lugar}</p>
      <p>Dirección: {lugar.direccion}</p>
      <p>Horario: {lugar.hora_aper} - {lugar.hora_cierra}</p>
      <p>Precios: {lugar.precios}</p>
    </div>
  );
};

export default ConsultarLugar;
