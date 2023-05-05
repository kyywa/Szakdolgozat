import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import swal from 'sweetalert';

import "../App.css";



export function ExpeditionPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [probability, setProbability] = useState(0.8);
  const [difficulty, setDifficulty] = useState(1);
  const [tooltip, setTooltip] = useState(true);
  const [fleets, setFleets] = useState([]);
  const [userFleet, setUserFleet] = useState([]);
  const [time, setTime] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [quantity2, setQuantity2] = useState(0);
  const [quantity3, setQuantity3] = useState(0);
  const [quantity4, setQuantity4] = useState(0);
  const [quantity5, setQuantity5] = useState(0);
  const [quantity6, setQuantity6] = useState(0);


  const authToken = Cookies.get('authToken');


  axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;


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

    axios.get('https://localhost:7172/api/Exploration/GetExplorationCooldown', {})
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Failed to show time");
        }
        setTime(response.data);
      })
      .catch((error) => {
        console.error(error);
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
    axios.post("https://localhost:7172/api/Exploration/SendExploration", { fleets, difficulty }, {
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then((response) => {
        console.log(JSON.stringify({ fleets, difficulty }));
        console.log(response.data);
        swal("Good job!", "Expedition successfully started!", "success");
      })
      .catch((error) => {
        setError(error.message);
        swal ( "Oops" ,  "Expedition couldn't start!" ,  "error" )
      });
    navigate('/planet');
  }

  function incrementQuantity() {
    if (count > quantity) {
      setQuantity(quantity + 1);
      setFleets(prevFleets => {
        const newFleets = [...prevFleets];
        const classOneShips = newFleets.filter(ship => ship.classId === 1);
        if (classOneShips.length > 0) {
          const randomShipIndex = Math.floor(Math.random() * classOneShips.length);
          classOneShips[randomShipIndex].count += 1;
        } else {
          const classOneShipsToAdd = userFleet.filter(ship => ship.classId === 1)
            .map((ship, index) => ({ ...ship, count: index === 0 ? 1 : 0 }));
          newFleets.push(...classOneShipsToAdd);
        }
        return newFleets;
      });
    } else {
      alert("Nincs több ilyen hajód!");
    }
  }

  function decrementQuantity() {
    if (quantity > 0) {
      setQuantity(quantity - 1);
      setFleets(prevFleets => {
        const newFleets = [...prevFleets];
        const classOneShips = newFleets.filter(ship => ship.classId === 1);
        if (classOneShips.length > 0) {
          const randomShipIndex = Math.floor(Math.random() * classOneShips.length);
          if (classOneShips[randomShipIndex].count > 1) {
            classOneShips[randomShipIndex].count -= 1;
          } else {
            newFleets.splice(newFleets.indexOf(classOneShips[randomShipIndex]), 1);
          }
        }
        return newFleets;
      });
    } else {
      alert("Nullától kevesebb hajód nem lehet!");
    }
  }

  function incrementQuantity2() {
    if (count2 > quantity2) {
      setQuantity2(quantity2 + 1);
      setFleets(prevFleets => {
        const newFleets = [...prevFleets];
        const classTwoships = newFleets.filter(ship => ship.classId === 2);
        if (classTwoships.length > 0) {
          const randomShipIndex = Math.floor(Math.random() * classTwoships.length);
          classTwoships[randomShipIndex].count += 1;
        } else {
          const classTwoshipsToAdd = userFleet.filter(ship => ship.classId === 2)
            .map((ship, index) => ({ ...ship, count: index === 0 ? 1 : 0 }));
          newFleets.push(...classTwoshipsToAdd);
        }
        return newFleets;
      });
    } else {
      alert("Nincs több ilyen hajód!");
    }
  }

  function decrementQuantity2() {
    if (quantity2 > 0) {
      setQuantity2(quantity2 - 1);
      setFleets(prevFleets => {
        const newFleets = [...prevFleets];
        const classTwoShips = newFleets.filter(ship => ship.classId === 2);
        if (classTwoShips.length > 0) {
          const randomShipIndex = Math.floor(Math.random() * classTwoShips.length);
          if (classTwoShips[randomShipIndex].count > 1) {
            classTwoShips[randomShipIndex].count -= 1;
          } else {
            newFleets.splice(newFleets.indexOf(classTwoShips[randomShipIndex]), 1);
          }
        }
        return newFleets;
      });
    } else {
      alert("Nullától kevesebb hajód nem lehet!");
    }
  }

  function incrementQuantity3() {
    if (count3 > quantity3) {
      setQuantity3(quantity3 + 1);
      setFleets(prevFleets => {
        const newFleets = [...prevFleets];
        const classThreeships = newFleets.filter(ship => ship.classId === 3);
        if (classThreeships.length > 0) {
          const randomShipIndex = Math.floor(Math.random() * classThreeships.length);
          classThreeships[randomShipIndex].count += 1;
        } else {
          const classThreeshipsToAdd = userFleet.filter(ship => ship.classId === 3)
            .map((ship, index) => ({ ...ship, count: index === 0 ? 1 : 0 }));
          newFleets.push(...classThreeshipsToAdd);
        }
        return newFleets;
      });
    } else {
      alert("Nincs több ilyen hajód!");
    }
  }

  function decrementQuantity3() {
    if (quantity3 > 0) {
      setQuantity3(quantity3 - 1);
      setFleets(prevFleets => {
        const newFleets = [...prevFleets];
        const classThreeShips = newFleets.filter(ship => ship.classId === 3);
        if (classThreeShips.length > 0) {
          const randomShipIndex = Math.floor(Math.random() * classThreeShips.length);
          if (classThreeShips[randomShipIndex].count > 1) {
            classThreeShips[randomShipIndex].count -= 1;
          } else {
            newFleets.splice(newFleets.indexOf(classThreeShips[randomShipIndex]), 1);
          }
        }
        return newFleets;
      });
    } else {
      alert("Nullától kevesebb hajód nem lehet!");
    }
  }

  function incrementQuantity4() {
    if (count4 > quantity4) {
      setQuantity4(quantity4 + 1);
      setFleets(prevFleets => {
        const newFleets = [...prevFleets];
        const classFourships = newFleets.filter(ship => ship.classId === 4);
        if (classFourships.length > 0) {
          const randomShipIndex = Math.floor(Math.random() * classFourships.length);
          classFourships[randomShipIndex].count += 1;
        } else {
          const classFourshipsToAdd = userFleet.filter(ship => ship.classId === 4)
            .map((ship, index) => ({ ...ship, count: index === 0 ? 1 : 0 }));
          newFleets.push(...classFourshipsToAdd);
        }
        return newFleets;
      });
    } else {
      alert("Nincs több ilyen hajód!");
    }
  }

  function decrementQuantity4() {
    if (quantity4 > 0) {
      setQuantity4(quantity4 - 1);
      setFleets(prevFleets => {
        const newFleets = [...prevFleets];
        const classFourships = newFleets.filter(ship => ship.classId === 4);
        if (classFourships.length > 0) {
          const randomShipIndex = Math.floor(Math.random() * classFourships.length);
          if (classFourships[randomShipIndex].count > 1) {
            classFourships[randomShipIndex].count -= 1;
          } else {
            newFleets.splice(newFleets.indexOf(classFourships[randomShipIndex]), 1);
          }
        }
        return newFleets;
      });
    } else {
      alert("Nullától kevesebb hajód nem lehet!");
    }
  }


  function incrementQuantity5() {
    if (count5 > quantity5) {
      setQuantity5(quantity5 + 1);
      setFleets(prevFleets => {
        const newFleets = [...prevFleets];
        const classFiveships = newFleets.filter(ship => ship.classId === 5);
        if (classFiveships.length > 0) {
          const randomShipIndex = Math.floor(Math.random() * classFiveships.length);
          classFiveships[randomShipIndex].count += 1;
        } else {
          const classFiveshipsToAdd = userFleet.filter(ship => ship.classId === 5)
            .map((ship, index) => ({ ...ship, count: index === 0 ? 1 : 0 }));
          newFleets.push(...classFiveshipsToAdd);
        }
        return newFleets;
      });
    } else {
      alert("Nincs több ilyen hajód!");
    }
  }

  function decrementQuantity5() {
    if (quantity5 > 0) {
      setQuantity5(quantity5 - 1);
      setFleets(prevFleets => {
        const newFleets = [...prevFleets];
        const classFiveships = newFleets.filter(ship => ship.classId === 5);
        if (classFiveships.length > 0) {
          const randomShipIndex = Math.floor(Math.random() * classFiveships.length);
          if (classFiveships[randomShipIndex].count > 1) {
            classFiveships[randomShipIndex].count -= 1;
          } else {
            newFleets.splice(newFleets.indexOf(classFiveships[randomShipIndex]), 1);
          }
        }
        return newFleets;
      });
    } else {
      alert("Nullától kevesebb hajód nem lehet!");
    }
  }


  function incrementQuantity6() {
    if (count6 > quantity6) {
      setQuantity6(quantity6 + 1);
      setFleets(prevFleets => {
        const newFleets = [...prevFleets];
        const classSixships = newFleets.filter(ship => ship.classId === 6);
        if (classSixships.length > 0) {
          const randomShipIndex = Math.floor(Math.random() * classSixships.length);
          classSixships[randomShipIndex].count += 1;
        } else {
          const classSixshipsToAdd = userFleet.filter(ship => ship.classId === 6)
            .map((ship, index) => ({ ...ship, count: index === 0 ? 1 : 0 }));
          newFleets.push(...classSixshipsToAdd);
        }
        return newFleets;
      });
    } else {
      alert("Nincs több ilyen hajód!");
    }
  }

  function decrementQuantity6() {
    if (quantity6 > 0) {
      setQuantity6(quantity6 - 1);
      setFleets(prevFleets => {
        const newFleets = [...prevFleets];
        const classSixships = newFleets.filter(ship => ship.classId === 6);
        if (classSixships.length > 0) {
          const randomShipIndex = Math.floor(Math.random() * classSixships.length);
          if (classSixships[randomShipIndex].count > 1) {
            classSixships[randomShipIndex].count -= 1;
          } else {
            newFleets.splice(newFleets.indexOf(classSixships[randomShipIndex]), 1);
          }
        }
        return newFleets;
      });
    } else {
      alert("Nullától kevesebb hajód nem lehet!");
    }
  }





  const handleDifficultyChange = (level) => {
    let newProbability;
    switch (level) {
      case '1':
        setDifficulty(1);
        newProbability = 0.8;
        setProbability(newProbability);
        break;
      case '2':
        setDifficulty(2);
        newProbability = 0.5
        setProbability(newProbability);
        break;
      case '3':
        setDifficulty(3);
        newProbability = 0.3
        setProbability(newProbability);
        break;
      case '4':
        setDifficulty(4);
        newProbability = 0.1
        setProbability(newProbability);
        break;
      default:
        break;
    }
  };

  let color = "";
  if (probability < 1 / 3) {
    color = "red";
  } else if (probability < 2 / 3) {
    color = "yellow";
  } else {
    color = "green";
  }

  return (
    <div>
      <div className='expedition'>
        <div
          style={{
            width: "100%",
            height: "10px",
            background: `linear-gradient(to right, red 0%, red ${33.33}%, yellow ${33.33}%, yellow ${66.66}%, green ${66.66}%, green 100%)`,
            borderRadius: "5px",
            position: "relative",
            cursor: "pointer"
          }}
        >
          <div
            style={{
              width: `${probability * 100}%`,
              height: "100%",
              borderRadius: "5px",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
          {tooltip && (
            <div
              style={{
                position: "absolute",
                top: "-30px",
                left: `${probability * 100}%`,
                transform: "translateX(-50%)",
                background: "white",
                color: "black",
                padding: "5px",
                borderRadius: "5px",
                boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)"
              }}
            >
              {difficulty === 1 ? "Easy" :
                difficulty === 2 ? "Normal" :
                  difficulty === 3 ? "Hard" :
                    difficulty === 4 ? "Very hard" :"not good"
              }
            </div>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
          <select onChange={(e) => handleDifficultyChange(e.target.value)} value={difficulty}>
            <option value="1" style={{ backgroundColor: difficulty === '1' ? 'blue' : 'white', color: difficulty === '1' ? 'white' : 'black' }}>Level 1</option>
            <option value="2" style={{ backgroundColor: difficulty === '2' ? 'blue' : 'white', color: difficulty === '2' ? 'white' : 'black' }}>Level 2</option>
            <option value="3" style={{ backgroundColor: difficulty === '3' ? 'blue' : 'white', color: difficulty === '3' ? 'white' : 'black' }}>Level 3</option>
            <option value="4" style={{ backgroundColor: difficulty === '4' ? 'blue' : 'white', color: difficulty === '4' ? 'white' : 'black' }}>Level 4</option>
          </select>
        </div>
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
        {time === null || time === '00:00:00' ? (
          <button className='upgrade-btn m-3' onClick={handleStart}>Start</button>
        ) : (
          <span className='time'>{time}</span>
        )}
      </div>
    </div>
  );
}

export default ExpeditionPage;