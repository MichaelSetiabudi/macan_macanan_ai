import { useNavigate } from "react-router-dom";
const PopUp = ({ showPopUp, setShowPopUp, name, sentence }) => {
  const navigate = useNavigate();

  if (!showPopUp) {
    return null;
  }

  return (
    <div 
      className="modal show" 
      tabIndex="-1" 
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div 
            style={{ backgroundColor: "#16bff2" }} 
            className="modal-header"
          >
            <h5 className="modal-title">{name}</h5>
            <button 
              type="button" 
              className="btn-close" 
              data-bs-dismiss="modal" 
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <p>{sentence}</p>
          </div>
          <div className="modal-footer">
            <button 
              onClick={() => {
                navigate("/");
                setShowPopUp(false);
              }} 
              type="submit" 
              className="btn" 
              style={{ backgroundColor: "#13fc03" }}
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PopUp };