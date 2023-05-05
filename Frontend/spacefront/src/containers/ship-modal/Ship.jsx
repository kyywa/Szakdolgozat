import "../ship-modal/Ship.css";

export default function ShipModal({ title, children, onHide }) {

    return (
        <div>
            <div className="d-flex justify-content-center align-items-center">
                <div className="ship-modal-container">
                    <div className="ship-modal-popup">
                        <button className="ship-close-button" onClick={() => onHide()}>X</button>
                        <div className="ship-modal-header">
                            <div className="ship-modal-title">
                                <h3 className="text-white">{title}</h3>
                            </div>
                        </div>
                        <div className="ship-modal-body mb-3">
                            {children}
                        </div>
                    </div>
                </div>
            </div>  
        </div>
      );
}