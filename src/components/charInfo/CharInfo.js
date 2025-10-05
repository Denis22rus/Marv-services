import {Component} from 'react';
import PropTypes from 'prop-types';


import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';
import MarvelService from '../../services/MarvelService';

class CharInfo extends Component {

  state = {
    char: null , // объект, который будет хранить информацию о персонаже
    loading: false, // правая часть макета не должна загружаться сразу и загрузка будет только по действию пользователя
    error: false // индикатор ошибки
  }

  marvelService = new MarvelService(); // создаем экземпляр класса MarvelService для получения данных о персонаже

//* ComponentDidMount вызывается один раз сразу после того, как компонент добавлен в DOM (т.е. после первого рендера).

// Монтирование — это процесс создания компонента и добавления его в реальный DOM, включая инициализацию state, вызов render и отображение результата.
// Виртуальный DOM — это абстракция реального DOM, которая позволяет React эффективно обновлять интерфейс, минимизируя изменения в реальном DOM.
// При монтировании React создаёт виртуальный DOM на основе метода render и преобразует его в реальный DOM. Сравнение виртуального и реального DOM происходит при обновлениях компонента, чтобы вносить только необходимые изменения.
// После монтирования компонента componentDidMount вызывается автоматически, позволяя выполнять действия, такие как запросы к API или установка таймеров.
  componentDidMount() {
    this.updateChar();
  }

  componentDidUpdate(prevProps, prevState) {
    // prevProps - предыдущие props (свойства), которые были до обновления компонента
    // prevState - предыдущий state, который был до обновления компонента
    if (this.props.charId !== prevProps.charId) { // если текущий charId не равен предыдущему charId, значит произошло изменение props
      this.updateChar();
    }
  }

  // updateChar - метод, который будет обновлять информацию о персонаже
  // вызывается при изменении props (при клике на персонажа в CharList)
  updateChar = () => {
    const {charId} = this.props; // получаем id персонажа из props (передается из App.js)
    // this.props - объект, который хранит свойства компонента (передаются из родительского компонента)
    if (!charId) {
      return; // если id нет, выходим из функции, чтобы не делать запрос на сервер
    }

    this.oncharLoading(); // показываем спиннер, пока идет загрузка

    // this.marvelService - экземпляр класса MarvelService
    this.marvelService
      .getCharacter(charId) // вызываем метод getCharacter из MarvelService, передавая id персонажа
      .then(this.onCharLoaded) // когда промис resolve, вызываем метод onCharLoaded
      .catch(this.onError) // если промис reject, вызываем метод onError

   }

  // функция, которая обновляет state компонента
  onCharLoaded = (char) => { // метод класса, который обновляет state компонента
    // setstate - метод, который обновляет state компонента и вызывает перерисовку компонента
    this.setState({char, loading: false}) // обновляем state компонента CharInfo
  // * Как только загружаются данные, позиция loading меняется на false и спиннер исчезает
  // в char приходит объект с данными персонажа
  // this.setState - метод, который обновляет state компонента и вызывает перерисовку компонента
  // {char} - сокращенная запись {char: char}, где первый char - имя свойства, а второй char - значение свойства (параметр функции)
  // аргумент подставляется в значение свойства
  }

  oncharLoading = () => {
    this.setState({loading: true}) // при вызове этой функции, loading становится true и показывается спиннер
  }

  // функция, которая обновляет state при ошибке
  onError = () => {
    this.setState({
      loading: false, // если произошла ошибка, значит у нас нет загрузки
      error: true
    })
  }

  render() {
    const {char, loading, error} = this.state;

    // Если уже есть данные о персонаже (char), или идёт загрузка (loading), или произошла ошибка (error), то skeleton будет null (ничего не показывается).
    // Если данных нет, загрузки нет и ошибки нет — показывается компонент <Skeleton/>, который служит "пустым" шаблоном до выбора персонажа.
    const skeleton = char || loading || error ? null : <Skeleton/>;

    const errorMessage = error ? <ErrorMessage/> : null; // если error true, то показываем компонент ErrorMessage, иначе null
    //? 6
    const spinner = loading ? <Spinner/> : null; // если loading true, то показываем компонент Spinner, иначе null
    const content = !(loading || error || !char) ? <View char={char}/> : null; // если нет загрузки, нет ошибки и есть данные о персонаже, то показываем компонент View, иначе null

    return (
      <div className="char__info">
        {/*
        Если уже есть данные о персонаже (char), или идёт загрузка (loading), или произошла ошибка (error), то skeleton будет null (ничего не показывается).
        Если данных нет, загрузки нет и ошибки нет — показывается компонент <Skeleton/>, который служит "пустым" шаблоном до выбора персонажа.
        */}
        {skeleton}
        {errorMessage}
        {spinner}
        {content}
      </div>
    )
  }
}

const View = ({char}) => {
  const {name, description, thumbnail, homepage, wiki, comics} = char; // деструктуризация объекта char
  // от куда берется char? - из props, который передается в CharInfo из App.js
  // данные попадют через метод onCharLoaded, который обновляет state компонента CharInfo
  return (
    // компонент должен возвращать один корневой элемент. Если убрать <>...</>, а оставить несколько элементов на одном уровне, React выдаст ошибку
    <>
      <div className="char__basics">
        <img src={thumbnail} alt={name}/>
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={homepage} className="button button__main">
                <div className="inner">homepage</div>
            </a>
            <a href={wiki} className="button button__secondary">
                <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">
        {description}
      </div>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
        {comics.length > 0 ? null : 'There is no comics with this character'} {/* если нет комиксов, то показываем сообщение */}
        {
          comics.map((item, i) => {
            // eslint-disable-next-line
            if (i > 9) return; // если i больше 10, то выходим из функции, чтобы не показывать больше 10 комиксов
            return (
              // i берется из массива comics, который приходит из API
              <li key={i} className="char__comics-item">
                {/* item - это элемент массива comics, который приходит из API */}
                {item}
              </li>
            )
          })
        }
      </ul>
    </>
  )
}

CharInfo.propTypes = {
  charId: PropTypes.number // charId должен быть числом
  // PropTypes - это библиотека для проверки типов props
}

export default CharInfo;