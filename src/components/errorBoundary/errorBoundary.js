import { Component } from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";

// Классовый компонент, который отлавливает ошибки в дочерних компонентах и отображает запасной UI вместо сломавшегося компонента
// В него нужно будет обернуть те компоненты, в которых мы хотим отлавливать ошибки

class ErrorBoundary extends Component {
  state = {
    error: false
  }

  // метод, который обновляет state при возникновении ошибки в дочерних компонентах
  // static getDerivedStateFromError(error) {
  //  error - объект ошибки
  //   return { error: true }
  // }

  // метод жизненного цикла, который вызывается, когда в одном из дочерних компонентов происходит ошибка
  componentDidCatch(error, info) {
    // error - объект ошибки
    // info - объект с информацией о компоненте, в котором произошла ошибка
    console.log(error, info);
    this.setState({ error: true })
  }

  // getDerivedStateFromError - статический метод, который обновляет state при возникновении ошибки
  // componentDidCatch - метод жизненного цикла, который вызывается после возникновения ошибки и может использоваться для логирования ошибки

  render() {
    if (this.state.error) { // если в state есть ошибка, показываем запасной UI
      return <ErrorMessage/>
    }

    return this.props.children // если ошибки нет, рендерим дочерние компоненты
  }
}

export default ErrorBoundary;