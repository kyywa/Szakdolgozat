import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import swal from 'sweetalert';

import "../App.css";


export function BattlePage() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [ships, setShips] = useState([]);
  const [userFleet, setUserFleet] = useState([]);
  const [playerFleet, setPlayerFleet] = useState([]);
  const [targetPlanets, setTargetPlanets] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [quantity2, setQuantity2] = useState(0);
  const [quantity3, setQuantity3] = useState(0);
  const [quantity4, setQuantity4] = useState(0);
  const [quantity5, setQuantity5] = useState(0);
  const [quantity6, setQuantity6] = useState(0);

  const authToken = Cookies.get('authToken');


  axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;


  const handleSelectChange = (event) => {
    setSelectedPlanet(event.target.value);
  };

  useEffect(() => {

    const storedFleet = localStorage.getItem('userFleet');
    if (storedFleet) {
      setUserFleet(JSON.parse(storedFleet));
    }

    axios.get('https://localhost:7172/api/Fleet/GetPlayerFleet', {})
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Failed to show fleet");
        }
        setUserFleet(response.data);
        localStorage.setItem('userFleet', JSON.stringify(response.data));
      })
      .catch((error) => {
        console.error(error);
      });
    axios.get('https://localhost:7172/api/Battle/GetTargetPlanets')
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Failed to show planets");
        }
        setTargetPlanets(response.data);
      })
      .catch((error) => {
        console.error(error);
        setError("Failed to fetch target planets. Please try again later.")
      });
  }, []);

  let count = 0;

  userFleet.forEach(ship => {
    if (ship.classId === 1) {
      count += ship.count;
    }
  });

  let count2 = 0;

  userFleet.forEach(ship => {
    if (ship.classId === 2) {
      count2 += ship.count;
    }
  });

  let count3 = 0;

  userFleet.forEach(ship => {
    if (ship.classId === 3) {
      count3 += ship.count;
    }
  });

  let count4 = 0;

  userFleet.forEach(ship => {
    if (ship.classId === 4) {
      count4 += ship.count;
    }
  });

  let count5 = 0;

  userFleet.forEach(ship => {
    if (ship.classId === 5) {
      count5 += ship.count;
    }
  });

  let count6 = 0;

  userFleet.forEach(ship => {
    if (ship.classId === 6) {
      count6 += ship.count;
    }
  });



  function handleStart() {
    axios.put(`https://localhost:7172/api/Battle/AttackPlanet?targetPlanetId=${selectedPlanet}`, JSON.stringify(playerFleet), {
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then((response) => {
        console.log(JSON.stringify(playerFleet));
        console.log(response.data);
        alert(response.data+"!")
      })
      .catch((error) => {
        setError(error.message);
        swal("Oops", "Battle couldn't start!", "error")
      });
  }

  function incrementQuantity() {
    if (count > quantity) {
      setQuantity(quantity + 1);
      setPlayerFleet(prevplayerFleet => {
        const newplayerFleet = [...prevplayerFleet];
        const classOneShips = newplayerFleet.filter(ship => ship.classId === 1);
        if (classOneShips.length > 0) {
          const randomShipIndex = Math.floor(Math.random() * classOneShips.length);
          classOneShips[randomShipIndex].count += 1;
        } else {
          const classOneShipsToAdd = userFleet.filter(ship => ship.classId === 1)
            .map((ship, index) => ({ ...ship, count: index === 0 ? 1 : 0 }));
          newplayerFleet.push(...classOneShipsToAdd);
        }
        return newplayerFleet;
      });
    } else {
      alert("Nincs több ilyen hajód!");
    }
  }

  function decrementQuantity() {
    if (quantity > 0) {
      setQuantity(quantity - 1);
      setPlayerFleet(prevplayerFleet => {
        const newplayerFleet = [...prevplayerFleet];
        const classOneShips = newplayerFleet.filter(ship => ship.classId === 1);
        if (classOneShips.length > 0) {
          const randomShipIndex = Math.floor(Math.random() * classOneShips.length);
          if (classOneShips[randomShipIndex].count > 1) {
            classOneShips[randomShipIndex].count -= 1;
          } else {
            newplayerFleet.splice(newplayerFleet.indexOf(classOneShips[randomShipIndex]), 1);
          }
        }
        return newplayerFleet;
      });
    } else {
      alert("Nullától kevesebb hajód nem lehet!");
    }
  }

  function incrementQuantity2() {
    if (count2 > quantity2) {
      setQuantity2(quantity2 + 1);
      setPlayerFleet(prevplayerFleet => {
        const newplayerFleet = [...prevplayerFleet];
        const classTwoships = newplayerFleet.filter(ship => ship.classId === 2);
        if (classTwoships.length > 0) {
          const randomShipIndex = Math.floor(Math.random() * classTwoships.length);
          classTwoships[randomShipIndex].count += 1;
        } else {
          const classTwoshipsToAdd = userFleet.filter(ship => ship.classId === 2)
            .map((ship, index) => ({ ...ship, count: index === 0 ? 1 : 0 }));
          newplayerFleet.push(...classTwoshipsToAdd);
        }
        return newplayerFleet;
      });
    } else {
      alert("Nincs több ilyen hajód!");
    }
  }

  function decrementQuantity2() {
    if (quantity2 > 0) {
      setQuantity2(quantity2 - 1);
      setPlayerFleet(prevplayerFleet => {
        const newplayerFleet = [...prevplayerFleet];
        const classTwoShips = newplayerFleet.filter(ship => ship.classId === 2);
        if (classTwoShips.length > 0) {
          const randomShipIndex = Math.floor(Math.random() * classTwoShips.length);
          if (classTwoShips[randomShipIndex].count > 1) {
            classTwoShips[randomShipIndex].count -= 1;
          } else {
            newplayerFleet.splice(newplayerFleet.indexOf(classTwoShips[randomShipIndex]), 1);
          }
        }
        return newplayerFleet;
      });
    } else {
      alert("Nullától kevesebb hajód nem lehet!");
    }
  }

  function incrementQuantity3() {
    if (count3 > quantity3) {
      setQuantity3(quantity3 + 1);
      setPlayerFleet(prevplayerFleet => {
        const newplayerFleet = [...prevplayerFleet];
        const classThreeships = newplayerFleet.filter(ship => ship.classId === 3);
        if (classThreeships.length > 0) {
          const randomShipIndex = Math.floor(Math.random() * classThreeships.length);
          classThreeships[randomShipIndex].count += 1;
        } else {
          const classThreeshipsToAdd = userFleet.filter(ship => ship.classId === 3)
            .map((ship, index) => ({ ...ship, count: index === 0 ? 1 : 0 }));
          newplayerFleet.push(...classThreeshipsToAdd);
        }
        return newplayerFleet;
      });
    } else {
      alert("Nincs több ilyen hajód!");
    }
  }

  function decrementQuantity3() {
    if (quantity3 > 0) {
      setQuantity3(quantity3 - 1);
      setPlayerFleet(prevplayerFleet => {
        const newplayerFleet = [...prevplayerFleet];
        const classThreeShips = newplayerFleet.filter(ship => ship.classId === 3);
        if (classThreeShips.length > 0) {
          const randomShipIndex = Math.floor(Math.random() * classThreeShips.length);
          if (classThreeShips[randomShipIndex].count > 1) {
            classThreeShips[randomShipIndex].count -= 1;
          } else {
            newplayerFleet.splice(newplayerFleet.indexOf(classThreeShips[randomShipIndex]), 1);
          }
        }
        return newplayerFleet;
      });
    } else {
      alert("Nullától kevesebb hajód nem lehet!");
    }
  }

  function incrementQuantity4() {
    if (count4 > quantity4) {
      setQuantity4(quantity4 + 1);
      setPlayerFleet(prevplayerFleet => {
        const newplayerFleet = [...prevplayerFleet];
        const classFourships = newplayerFleet.filter(ship => ship.classId === 4);
        if (classFourships.length > 0) {
          const randomShipIndex = Math.floor(Math.random() * classFourships.length);
          classFourships[randomShipIndex].count += 1;
        } else {
          const classFourshipsToAdd = userFleet.filter(ship => ship.classId === 4)
            .map((ship, index) => ({ ...ship, count: index === 0 ? 1 : 0 }));
          newplayerFleet.push(...classFourshipsToAdd);
        }
        return newplayerFleet;
      });
    } else {
      alert("Nincs több ilyen hajód!");
    }
  }

  function decrementQuantity4() {
    if (quantity4 > 0) {
      setQuantity4(quantity4 - 1);
      setPlayerFleet(prevplayerFleet => {
        const newplayerFleet = [...prevplayerFleet];
        const classFourships = newplayerFleet.filter(ship => ship.classId === 4);
        if (classFourships.length > 0) {
          const randomShipIndex = Math.floor(Math.random() * classFourships.length);
          if (classFourships[randomShipIndex].count > 1) {
            classFourships[randomShipIndex].count -= 1;
          } else {
            newplayerFleet.splice(newplayerFleet.indexOf(classFourships[randomShipIndex]), 1);
          }
        }
        return newplayerFleet;
      });
    } else {
      alert("Nullától kevesebb hajód nem lehet!");
    }
  }


  function incrementQuantity5() {
    if (count5 > quantity5) {
      setQuantity5(quantity5 + 1);
      setPlayerFleet(prevplayerFleet => {
        const newplayerFleet = [...prevplayerFleet];
        const classFiveships = newplayerFleet.filter(ship => ship.classId === 5);
        if (classFiveships.length > 0) {
          const randomShipIndex = Math.floor(Math.random() * classFiveships.length);
          classFiveships[randomShipIndex].count += 1;
        } else {
          const classFiveshipsToAdd = userFleet.filter(ship => ship.classId === 5)
            .map((ship, index) => ({ ...ship, count: index === 0 ? 1 : 0 }));
          newplayerFleet.push(...classFiveshipsToAdd);
        }
        return newplayerFleet;
      });
    } else {
      alert("Nincs több ilyen hajód!");
    }
  }

  function decrementQuantity5() {
    if (quantity5 > 0) {
      setQuantity5(quantity5 - 1);
      setPlayerFleet(prevplayerFleet => {
        const newplayerFleet = [...prevplayerFleet];
        const classFiveships = newplayerFleet.filter(ship => ship.classId === 5);
        if (classFiveships.length > 0) {
          const randomShipIndex = Math.floor(Math.random() * classFiveships.length);
          if (classFiveships[randomShipIndex].count > 1) {
            classFiveships[randomShipIndex].count -= 1;
          } else {
            newplayerFleet.splice(newplayerFleet.indexOf(classFiveships[randomShipIndex]), 1);
          }
        }
        return newplayerFleet;
      });
    } else {
      alert("Nullától kevesebb hajód nem lehet!");
    }
  }


  function incrementQuantity6() {
    if (count6 > quantity6) {
      setQuantity6(quantity6 + 1);
      setPlayerFleet(prevplayerFleet => {
        const newplayerFleet = [...prevplayerFleet];
        const classSixships = newplayerFleet.filter(ship => ship.classId === 6);
        if (classSixships.length > 0) {
          const randomShipIndex = Math.floor(Math.random() * classSixships.length);
          classSixships[randomShipIndex].count += 1;
        } else {
          const classSixshipsToAdd = userFleet.filter(ship => ship.classId === 6)
            .map((ship, index) => ({ ...ship, count: index === 0 ? 1 : 0 }));
          newplayerFleet.push(...classSixshipsToAdd);
        }
        return newplayerFleet;
      });
    } else {
      alert("Nincs több ilyen hajód!");
    }
  }

  function decrementQuantity6() {
    if (quantity6 > 0) {
      setQuantity6(quantity6 - 1);
      setPlayerFleet(prevplayerFleet => {
        const newplayerFleet = [...prevplayerFleet];
        const classSixships = newplayerFleet.filter(ship => ship.classId === 6);
        if (classSixships.length > 0) {
          const randomShipIndex = Math.floor(Math.random() * classSixships.length);
          if (classSixships[randomShipIndex].count > 1) {
            classSixships[randomShipIndex].count -= 1;
          } else {
            newplayerFleet.splice(newplayerFleet.indexOf(classSixships[randomShipIndex]), 1);
          }
        }
        return newplayerFleet;
      });
    } else {
      alert("Nullától kevesebb hajód nem lehet!");
    }
  }



  return (
    <div>
      <div>
        <label htmlFor="selectedPlanet">Select a planet:</label>
        <select id="selectedPlanet" value={selectedPlanet} onChange={handleSelectChange}>
          <option value="">-- Please select a planet --</option>
          {targetPlanets.map((planet) => (
            <option key={planet.pid} value={planet.pid}>
              {planet.planetName}
            </option>
          ))}
        </select>
      </div>





      <div className='fleet-container2'>

        <div className='fleet-container'>

          <div className='ship-card-container2'>
            <div className='ship-card-header'>
              <span>Frigate</span>
            </div>
            <div className='d-flex'>
              <div className='ship-card-spaceship'><img src="../images/sprites/ship/frigate.png" title='Ship' alt='Ship'></img></div>
              <div className='ship-card-types flex-row'>
                <div className='quantity-container'>

                </div>
              </div>
            </div>
            <div className='ship-card-stats'>
              <p>Type:Screen</p>
              <p>{count}</p>
              <button className='quantity-btn1' onClick={incrementQuantity}>+</button>
              <p>{quantity}</p>
              <button className='quantity-btn2' onClick={decrementQuantity}>-</button>
            </div>
          </div>




          <div className='ship-card-container2'>
            <div className='ship-card-header'>
              <span>Destroyer</span>
            </div>
            <div className='d-flex'>
              <div className='ship-card-spaceship'><img src="../images/sprites/ship/destroyer.png" title='Ship' alt='Ship'></img></div>
              <div className='ship-card-types flex-row'>

              </div>
            </div>
            <div className='ship-card-stats'>
              <p>Type:Screen</p>
              <p>{count2}</p>
              <button className='quantity-btn1' onClick={incrementQuantity2}>+</button>
              <p>{quantity2}</p>
              <button className='quantity-btn2' onClick={decrementQuantity2}>-</button>
            </div>
          </div>




          <div className='ship-card-container2'>
            <div className='ship-card-header'>
              <span>Cruiser</span>
            </div>
            <div className='d-flex'>
              <div className='ship-card-spaceship'><img src="../images/sprites/ship/cruiser.png" title='Ship' alt='Ship'></img></div>
              <div className='ship-card-types flex-row'>

              </div>
            </div>
            <div className='ship-card-stats'>
              <p>Type:Screen</p>
              <p>{count3}</p>
              <button className='quantity-btn1' onClick={incrementQuantity3}>+</button>
              <p>{quantity3}</p>
              <button className='quantity-btn2' onClick={decrementQuantity3}>-</button>
            </div>
          </div>




          <div className='ship-card-container2'>
            <div className='ship-card-header'>
              <span>Battle cruiser</span>
            </div>
            <div className='d-flex'>
              <div className='ship-card-spaceship'><img src="../images/sprites/ship/battlecruiser.png" title='Ship' alt='Ship'></img></div>
              <div className='ship-card-types flex-row'>

              </div>
            </div>
            <div className='ship-card-stats'>
              <p>Type:Capital</p>
              <p>{count4}</p>
              <button className='quantity-btn1' onClick={incrementQuantity4}>+</button>
              <p>{quantity4}</p>
              <button className='quantity-btn2' onClick={decrementQuantity4}>-</button>
            </div>
          </div>




          <div className='ship-card-container2'>
            <div className='ship-card-header'>
              <span>Battleship</span>
            </div>
            <div className='d-flex'>
              <div className='ship-card-spaceship'><img src="../images/sprites/ship/battleship.png" title='Ship' alt='Ship'></img></div>
              <div className='ship-card-types flex-row'>

              </div>
            </div>
            <div className='ship-card-stats'>
              <p>Type:Capital</p>
              <p>{count5}</p>
              <button className='quantity-btn1' onClick={incrementQuantity5}>+</button>
              <p>{quantity5}</p>
              <button className='quantity-btn2' onClick={decrementQuantity5}>-</button>
            </div>
          </div>



          <div className='ship-card-container2'>
            <div className='ship-card-header'>
              <span>Carrier</span>
            </div>
            <div className='d-flex'>
              <div className='ship-card-spaceship'><img src="../images/sprites/ship/carrier.png" title='Ship' alt='Ship'></img></div>
              <div className='ship-card-types flex-row'>

              </div>
            </div>
            <div className='ship-card-stats'>
              <p>Type:Capital</p>
              <p>{count6}</p>
              <button className='quantity-btn1' onClick={incrementQuantity6}>+</button>
              <p>{quantity6}</p>
              <button className='quantity-btn2' onClick={decrementQuantity6}>-</button>
            </div>
          </div>

        </div>
      </div>

      <div className='start-button-container'>
        <button className='upgrade-btn m-3' onClick={handleStart}>Start</button>
      </div>
    </div>
  );
}



export default BattlePage;