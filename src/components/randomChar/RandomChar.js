import {Component} from 'react';
import MarvelService from '../../services/MarvelService';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

// Компонент, который отображает случайного персонажа
class RandomChar extends Component {
  constructor(props) { // метод класса, который вызывается при создании экземпляра класса (компонента) для инициализации state и привязки методов
    super(props); // вызываем конструктор родительского класса (Component), чтобы получить доступ к this.props
    this.updateChar(); // вызываем метод updateChar, чтобы получить случайного персонажа при загрузке компонента
  }
  // state - объект, который хранит данные компонента
  state = {
    char: {},
    // в итоге получается, что char: {} становится char: {name: '...', description: '...', thumbnail: '...', homepage: '...', wiki: '...'}

    // // изначально будет null, чтобы не было ошибки при рендере и не пытался отобразить несуществующие данные
    // name: null,
    // description: null, // описание персонажа
    // thumbnail: null, // картинка персонажа
    // homepage: null, // ссылка на главную страницу персонажа
    // wiki: null // ссылка на вики персонажа
  }

  // новое свойство класса RandomChar
  // почему просто marvelService, а не this.marvelService или class?
  // потому что это не метод класса, а свойство класса и его не нужно вызывать через this, чтобы получить доступ к нему
  marvelService = new MarvelService(); // создаем экземпляр класса MarvelService
  // он нужен, чтобы обращаться к методам класса MarvelService и получать данные с API

  // в char приходит объект с данными персонажа
  onCharLoaded = (char) => { // метод класса, который обновляет state компонента
    this.setState({char}) // обновляем state компонента RandomChar
    // this.setState - метод, который обновляет state компонента и вызывает перерисовку компонента
    // {char} - сокращенная запись {char: char}, где первый char - имя свойства, а второй char - значение свойства (параметр функции)
    // аргумент подставляется в значение свойства
  }

  updateChar = () => {
    const id = Math.floor(Math.random() * (20 - 1) + 1);
    this.marvelService
      .getCharacter(id) // вызываем метод getCharacter из класса MarvelService
      .then(this.onCharLoaded) // когда промис выполнится, вызываем метод onCharLoaded и передаем в него данные персонажа
      // пример данных: {name: '...', description: '...', thumbnail: '...', homepage: '...', wiki: '...'}
      // в this аргумент автоматически подставляется результат выполнения промиса (данные персонажа)
  }

  render() {
    const {char: {name, description, thumbnail, homepage, wiki}} = this.state; // деструктуризация объекта state
    console.log(this.state.char);
    // из this.state берем свойство char, которое является объектом
    // из объекта char берем свойства name, description, thumbnail, homepage, wiki
    // вместо this.state.char.name можно просто name
    // вместо this.state.char.description можно просто description и т.д.
    // в переменную const записываается значение свойства, например name: 'Spider
    return (
      <div className="randomchar">
        <div className="randomchar__block">
          <img src={thumbnail} alt="Random character" className="randomchar__img"/>
          <div className="randomchar__info">
            <p className="randomchar__name">{name}</p>
            <p className="randomchar__descr">
              {description}
            </p>
            <div className="randomchar__btns">
              <a href={homepage} className="button button__main">
                  <div className="inner">homepage</div>
              </a>
              <a href={wiki} className="button button__secondary">
                  <div className="inner">Wiki</div>
              </a>
            </div>
          </div>
        </div>
        <div className="randomchar__static">
          <p className="randomchar__title">
            Random character for today!<br/>
            Do you want to get to know him better?
          </p>
          <p className="randomchar__title">
            Or choose another one
          </p>
          <button className="button button__main">
            <div className="inner">try it</div>
          </button>
          <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
        </div>
      </div>
    )
  }
}

export default RandomChar; // экспортируем компонент, чтобы использовать его в других файлах
