import React from 'react';
import './Modal.css'; // Make sure to create a corresponding CSS file for styling
//
const Modal = ({ show, onClose, onSave, children }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-body">
                    {children}
                </div>
                <div className="modal-footer">
                    <button onClick={onClose} className="btn btn-secondary">Cancel</button>
                    <button onClick={onSave} className="btn btn-primary">Save</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
