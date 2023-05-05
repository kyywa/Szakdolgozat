import "../fleet-modal/Fleet.css";

export default function FleetModal({ title, children, onHide }) {

    return (
        <div>
            <div className="d-flex justify-content-center align-items-center">
                <div className="fleet-modal-container">
                    <div className="fleet-modal-popup">
                        <button className="fleet-close-button" onClick={() => onHide()}>X</button>
                        <div className="fleet-modal-header">
                            <div className="fleet-modal-title">
                                <h3 className="text-white">{title}</h3>
                            </div>
                        </div>
                        <div className="fleet-modal-body mb-3">
                            {children}
                        </div>
                    </div>
                </div>
            </div>  
        </div>
      );
}