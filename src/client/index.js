import { handleSubmit } from './js/formHandler.js'
import { updateUi } from './js/uiControl.js'
import './styles/index.scss'

export {
    handleSubmit
}

window.addEventListener("load", async() => {
    await updateUi();
});
