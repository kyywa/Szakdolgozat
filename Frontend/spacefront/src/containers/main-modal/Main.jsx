import "../main-modal/Main.css";

export default function MainModal({ title, children, onHide }) {

    return (
        <div>
            <div className="d-flex justify-content-center align-items-center">
                <div className="main-modal-container">
                    <div className="main-modal-popup">
                        <button className="close-button" onClick={() => onHide()}>X</button>
                        <div className="main-modal-header">
                            <div className="main-modal-title">
                                <h3 className="text-white">{title}</h3>
                            </div>
                        </div>
                        <div className="main-modal-body mb-3">
                            {children}
                        </div>
                    </div>
                </div>
            </div>  
        </div>
      );
}