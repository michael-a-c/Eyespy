import React, { Component, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function PasswordModal(props) {
      return (
    <>
      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Password confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>To perform this operation, please enter your password</Modal.Body>
        <Modal.Footer>
          
          <Button variant="primary" onClick={props.handleClose}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PasswordModal