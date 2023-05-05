import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from "react-bootstrap/Button";

export function PlanetCreationPage() {
  const [PlanetName, setPlanetName] = useState("");
  const [PlanetType, setPlanetType] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  function handleSubmit(event) {
    event.preventDefault();
    setError(null);
  
    axios
      .post("https://localhost:7172/api/Planet/CreatePlanet", {
        PlanetType: PlanetType,
        PlanetName:PlanetName
      }
      )
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Failed to create planet");
        }
        console.log(response)
        navigate('/planet');
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
      });
    
  }

  return (
    <form onSubmit={handleSubmit} className="content-container planet-choosing text">
      <label htmlFor="PlanetName" className='text-warning fs-2'>Planet Name:</label>
      <div>
        <input
          type="text"
          value={PlanetName}
          maxLength={30}
          onChange={(e) => setPlanetName(e.target.value)}
          className='planet-choose-input'
        />
      </div>  
<fieldset>
  <legend className='text-warning'>Type:</legend>
  <label for="earthlike" className='earthlike-bg'>
    <input
      type="radio"
      id="earthlike"
      value="earthlike"
      checked={PlanetType === 'earthlike'}
      onChange={(e) => setPlanetType(e.target.value)}
    />
    <span className='planet-choose-text fs-2'>Earthlike</span>
  </label>

    <label for="icy" className='icy-bg'>
      <input
        type="radio"
        id="icy"
        value="icy"
        checked={PlanetType === 'icy'}
        onChange={(e) => setPlanetType(e.target.value)}
      />
      <span className='planet-choose-text fs-2 mx-2'>Icy</span>
    </label>

  <label for="lava" className='lava-bg'>
    <input
      type="radio"
      id="lava"
      value="lava"
      checked={PlanetType === 'lava'}
      onChange={(e) => setPlanetType(e.target.value)}
    />
    <span className='planet-choose-text fs-2 mx-1'>Lava</span>
  </label>

  <label for="gas" className='gas-bg'>
    <input
      type="radio"
      id="gas"
      value="gas"
      checked={PlanetType === 'gas'}
      onChange={(e) => setPlanetType(e.target.value)}
    />
    <span className='planet-choose-text fs-2 mx-2'>Gas</span>
  </label>

  <label for="other" className='other-bg'>
    <input
      type="radio"
      id="other"
      value="other"
      checked={PlanetType === 'other'}
      onChange={(e) => setPlanetType(e.target.value)}
    />
    <span className='planet-choose-text fs-2 mx-1'>Other</span>
  </label>
</fieldset>
<button className='planet-choose-btn'type="submit">Create Planet</button>
    </form>
  );
}

export default PlanetCreationPage;