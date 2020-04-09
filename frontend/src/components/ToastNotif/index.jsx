import { store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

function ToastNotif(props) {

  store.addNotification({
    title: props.title,
    message: props.message,
    type:  props.type,
    insert: "bottom",
    container: "bottom-right",
    animationIn: ["animated", "fadeIn"],
    animationOut: ["animated", "fadeOut"],
    dismiss: {
      duration: 3500,
      onScreen: true,
    },
  });
}
export default ToastNotif;
