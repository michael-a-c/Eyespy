import React, { Component, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./styles.scss";

function PasswordModal(props) {
  const [password, setPassword] = useState("");

  return (
    <>
      <Modal
        show={props.show}
        onHide={() => {
          setPassword("");
          props.handleClose(password);
        }}
      >
        <Modal.Header closeButton={false}>
          <Modal.Title>Password confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          To perform this operation, please enter your password
        </Modal.Body>
        <Form>
          <Form.Group
            controlId="formBasicPassord"
            className={"password-modal-form"}
          >
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter Password"
            />
          </Form.Group>
          <Modal.Footer>
            {props.error ? <div className="error-text">{props.error}</div> : ""}

            <Button
              variant="primary"
              disabled={password === ""}
              onClick={() => {
                props.handleClose(password);
              }}
            >
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default PasswordModal;
