import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import MainModal from '../containers/main-modal/Main';
import FleetModal from '../containers/fleet-modal/Fleet';
import ShipModal from '../containers/ship-modal/Ship';
import swal from 'sweetalert';

export function PlanetPage() {
  const [showMainModal, setShowMainModal] = useState(false);
  const [showFleetModal, setShowFleetModal] = useState(false);
  const [showShipModal, setShowShipModal] = useState(false);
  const [userPlanet, setUserPlanet] = useState(null);
  const [userResources, setUserResources] = useState(null);
  const [userFleet, setUserFleet] = useState(null);
  const [shipClass, setShipClass] = useState(0);
  const [shipWeapon, setShipWeapon] = useState(0);
  const [shipDefense, setShipDefense] = useState(0);
  const [shipPropulsion, setShipPropulsion] = useState(0);
  const [userShips, setUserShips] = useState(null);
  const navigate = useNavigate();
  const handleClick = () => {
    window.location.reload();
  }
  function handleUpgradeAndClick(resourceName) {
    handleUpgradeResources(resourceName);
    handleClick();
  }
  function handleUpgradeAndClick2(buildingName) {
    handleUpgradeBuildings(buildingName);
    handleClick();
  }


const authToken = Cookies.get('authToken');


axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;


  useEffect(() => {
    axios.get('https://localhost:7172/api/Planet/GetPlayerPlanet', {})
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Failed to show planet");
        }
        setUserPlanet(response.data);
      })
      .catch((error) => {
        console.error(error);
        navigate('/createplanet');
      });

    axios.get('https://localhost:7172/api/Resource/GetPlayerResources', {})
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Failed to show resources");
        }
        setUserResources(response.data);
      })
      .catch((error) => {
        console.error(error);
        navigate('/createplanet');
      });

    axios.get('https://localhost:7172/api/Fleet/GetPlayerFleet', {})
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Failed to show fleet");
        }
        setUserFleet(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios.get('https://localhost:7172/api/Ship/getShipFromIds', {})
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Failed to get ships");
        }
        setUserShips(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleUpgradeResources = (resourceName) => {
    axios.put(`https://localhost:7172/api/Resource/UpgradeResource?resourceZone=${resourceName}`, {})
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Failed to upgrade resource");
        }
        setUserResources(response.data);
      })
      .catch((error) => {
        console.error(error);
        swal ( "Oops" ,  "You don't have enough resources!" ,  "error" )
      });
  };

  const handleUpgradeBuildings = (buildingName) => {
    axios.put(`https://localhost:7172/api/Planet/UpgradeBuilding?building=${buildingName}`, {})
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Failed to upgrade resource");
        }
        setUserPlanet(response.data);
      })
      .catch((error) => {
        console.error(error);
        swal ( "Oops" ,  "You don't have enough resources!" ,  "error" )
      });
  };

  const handleAddShip = (event) => {
    event.preventDefault();
    axios.post("https://localhost:7172/api/Shipyardqueue/AddShipToQueue", {
      classId: Number(shipClass),
      weapontype:Number(shipWeapon),
      defensetype:Number(shipDefense),
      propulsiontype:Number(shipPropulsion)
      }
      )
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Failed to add ship");
        }
        console.log(response)
      })
      .catch((error) => {
        console.error(error);
        swal ( "Oops" ,  "You don't have enough resources!" ,  "error" )
      });
  };
 
  const shieldPaths = {
    200: "../images/sprites/shield/alloyarmor.png",
    201: "../images/sprites/shield/reactivearmor.png",
    202: "../images/sprites/shield/shield.png"
  };
  const propulsionPaths = {
    300: "../images/sprites/propulsion/utilitarian.png",
    301: "../images/sprites/propulsion/balanced.png",
    302: "../images/sprites/propulsion/mobilityfocused.png"
  };
  const weaponPaths = {
    100: "../images/sprites/weapon/kinetic.png",
    101: "../images/sprites/weapon/chemical.png",
    102: "../images/sprites/weapon/energy.png"
  };
  const shipPaths = {
    1: "../images/sprites/ship/frigate.png",
    2: "../images/sprites/ship/destroyer.png",
    3: "../images/sprites/ship/cruiser.png",
    4: "../images/sprites/ship/battlecruiser.png",
    5: "../images/sprites/ship/battleship.png",
    6: "../images/sprites/ship/carrier.png"
  };
  const shipNames = {
    1: "Frigate",
    2: "Destroyer",
    3: "Cruiser",
    4: "Battle cruiser",
    5: "Battleship",
    6: "Carrier"
  };

  return (
<div>
      <div className='resource-box'>
        {userResources ? (
          <>
            <div className='resource-box-div d-flex justify-content-center align-items-center'>
              <img alt="Érme" title="Érme" src="../images/steel_bg3.png"></img>
              <div className='resource-box-text'>
                <h4 className='pls'>{userResources.steelcount} ({userResources.steellvl})</h4>
              </div>
              <div className='resource-box-btn-place'>
                  <button className='resource-btn' onClick={() => handleUpgradeAndClick("Steel")}>Upgrade</button>
              </div>
            </div>
            <div className='resource-box-div d-flex justify-content-center align-items-center'>
              <img alt="Érme" title="Érme" src="../images/uranium_bg3.png"></img>
              <div className='resource-box-text'>
                <h4>{userResources.uraniumcount} ({userResources.uraniumlvl})</h4>
              </div>
              <div className='resource-box-btn-place'>
                  <button className='resource-btn' onClick={() => handleUpgradeAndClick("Uranium")}>Upgrade</button>
              </div>
            </div>
            <div className='resource-box-div d-flex justify-content-center align-items-center'>
              <img alt="Érme" title="Érme" src="../images/carbon_bg3.png"></img>
              <div className='resource-box-text'>
                <h4>{userResources.carboncount} ({userResources.carbonlvl})</h4>
              </div>
              <div className='resource-box-btn-place'>
                  <button className='resource-btn' onClick={() => handleUpgradeAndClick("Carbon")}>Upgrade</button>
              </div>
            </div>
            <div className='resource-box-div d-flex justify-content-center align-items-center'>
              <img alt="Érme" title="Érme" src="../images/gas_bg3.png"></img>
              <div className='resource-box-text'>
                <h4>{userResources.gascount} ({userResources.gaslvl})</h4>
              </div>
              <div className='resource-box-btn-place'>
                  <button className='resource-btn' onClick={() => handleUpgradeAndClick("Gas")}>Upgrade</button>
              </div>
            </div>
                   
          </>
        ) : (
          <p>Loading resource data...</p>
        )}
      </div>
      
 {userPlanet ? (     
      <div className='page-container d-flex align-items-center justify-content-center'  style={{ backgroundImage: `url(../images/${userPlanet.type}_type.gif)` }}> 
      {showMainModal ? (
        <div>
        <MainModal
            title="Planet Info"
            onHide={() => setShowMainModal(false)}
              >
            <div>
              <div className='Planetbox'>
                <h1 className='text2'>{userPlanet.name}</h1>
                <div className='info-row'>
                  <span>Type:</span>
                  <span>{userPlanet.type}</span>
                </div>
                <div className='info-row'>
                  <span>HQ level:</span>
                  <span>{userPlanet.hqlvl}</span>
                  <button className='upgrade-btn' onClick={() => handleUpgradeAndClick2("HQ")}>Upgrade</button>
                </div>
                <div className='info-row'>
                  <span>Shipyard level:</span>
                  <span>{userPlanet.shipyardlvl}</span>
                  <button className='upgrade-btn' onClick={() => handleUpgradeAndClick2("Shipyard")}>Upgrade</button>
                </div>
                <div className='info-row'>
                  <span>Refinery level:</span>
                  <span>{userPlanet.refinerylvl}</span>
                  <button className='upgrade-btn' onClick={() => handleUpgradeAndClick2("Refinery")}>Upgrade</button>
                </div>
            </div>

            </div>
        </MainModal>
        </div>   
        ) : null}

        <div className='button-container'>
              <div className=''>
                <button className='planet-left-btn' onClick={()=>setShowMainModal(true)}>Base show</button>
              </div>
            
              <div className=''>
                <button className='planet-middle-btn' onClick={()=>setShowFleetModal(true)}>Fleet show</button>
              </div>

              <div className=''>
                <button className='planet-right-btn' onClick={()=>setShowShipModal(true)}>Ship show</button>
              </div>
        </div>
      </div>
        
      ) : (
        <p>Loading planet data...</p>
     )}
    {showShipModal ? (
        <div>
        <ShipModal
            title="Create a ship"
            onHide={() => setShowShipModal(false)}
              >
            <form onSubmit={handleAddShip} className="Planetbox text">
            <label htmlFor="shipClass">Shipclass Id:</label>
            <select
              value={shipClass}
              onChange={(e) => setShipClass(e.target.value)}
            >
              <option value="">Select a ship class</option>
              <option value="1">Frigate</option>
              <option value="2">Destroyer</option>
              <option value="3">Cruiser</option>
              <option value="4">Battlecruiser</option>
              <option value="5">Battleship</option>
              <option value="6">Carrier</option>
            </select>

            <label htmlFor="shipWeapon">Weapon type:</label>
            <select
              value={shipWeapon}
              onChange={(e) => setShipWeapon(e.target.value)}
            >
              <option value="">Select a ship weapon type</option>
              <option value="100">Kinetic</option>
              <option value="101">Chemical</option>
              <option value="102">Energy</option>
            </select>
               
            <label htmlFor="shipDefense">Defense type</label>
            <select
              value={shipDefense}
              onChange={(e) => setShipDefense(e.target.value)}
            >
              <option value="">Select a ship defense type</option>
              <option value="200">Alloy Armor</option>
              <option value="201">Reactive Armor</option>
              <option value="202">Shield</option>
            </select>

            <label htmlFor="shipPropulsion">Ship propulsiontype:</label>
            <select
              value={shipPropulsion}
              onChange={(e) => setShipPropulsion(e.target.value)}
            >
              <option value="">Select a ship propulsion type</option>
              <option value="300">Utilitarian</option>
              <option value="301">Balanced</option>
              <option value="302">Mobility Focused</option>
            </select>

                <button type="submit" className='upgrade-btn m-3'>Add ship</button>
              </form>
        </ShipModal>
        </div>
          ) : null}
  
  {showFleetModal ? (
      <div>
        <FleetModal
            title="Player fleet"
            onHide={() => setShowFleetModal(false)}
              >
            <div className='fleet-container'>
                {userFleet ? (
                  <div className='fleet-container'>                   
                    {userFleet.map(ship => (
                      <div>
                          <div className='ship-card-container'>
                              <div className='ship-card-header'>
                                <span>{shipNames[ship.classId]}</span>
                              </div>
                              <div className='d-flex'>
                                <div className='ship-card-spaceship'>
                                    <img src={shipPaths[ship.classId]} title='Ship' alt='Ship'></img>
                                </div>
                                <div className='ship-card-types flex-row'>
                                  <div>
                                    <img src={weaponPaths[ship.weaponId]} title='Weapon' alt='Weapon'></img>
                                  </div>
                                  <div>
                                    <img src={shieldPaths[ship.defenseId]} title='Shield' alt='Shield'></img>
                                  </div>
                                  <div>
                                    <img src={propulsionPaths[ship.propulsionId]} title='Propulsion' alt='Propulsion'></img>
                                  </div>
                                </div>
                              </div>
                              <div className='ship-card-stats'>
                                <p>Type: {ship.classId === 1||2||3 ? "Screen" :
                                          ship.classId === 4||5||6 ? "Capital" : "N/A"}</p>
                                <p>Count:{ship.count}</p>
                              </div>
                          </div>
                        </div>
                    ))}         
                  </div>
                ) : null}
            </div>
        </FleetModal>
      </div>   
      ) : null}
</div>
  );

}

export default PlanetPage;