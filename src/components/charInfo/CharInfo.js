import {Component} from 'react';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';
import thor from '../../resources/img/thor.jpeg';
import MarvelService from '../../services/MarvelService';

class CharInfo extends Component {

  state = {
    char: {}, // объект, который будет хранить информацию о персонаже
    loading: false, // правая часть макета не должна загружаться сразу и загрузка будет только по действию пользователя
    error: false // индикатор ошибки
  }

  marvelService = new MarvelService(); // создаем экземпляр класса MarvelService для получения данных о персонаже

  // Это нужно для того, чтобы загрузить информацию о персонаже, если его id уже передан через prop в app
  componentDidMount() {
    this.updateChar();
  }

  // updateChar - метод, который будет обновлять информацию о персонаже
  // вызывается при изменении props (при клике на персонажа в CharList)
  updateChar = () => {
    const {charId} = this.props; // получаем id персонажа из props (передается из App.js)
    if (!charId) {
      return; // если id нет, выходим из функции, чтобы не делать запрос на сервер, если id нет
    }

    this.oncharLoading(); // показываем спиннер, пока идет загрузка

    this.marvelService
      .getCharacter(charId) // вызываем метод getCharacter из MarvelService, передавая id персонажа
      .then(this.onCharLoaded) // когда промис resolve, вызываем метод onCharLoaded
      .catch(this.onError) // если промис reject, вызываем метод onError
  }

  // функция, которая обновляет state компонента
  onCharLoaded = (char) => { // метод класса, который обновляет state компонента
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
    const content = !(loading || error) ? <View char={char}/> : null; // если loading и error false, то показываем компонент View, иначе null


    return (
      <div className="char__info">

      </div>
    )
  }
}

const View = ({char}) => {
  return (
    // компонент должен возвращать один корневой элемент. Если убрать <>...</>, а оставить несколько элементов на одном уровне, React выдаст ошибку
    <>
      <div className="char__basics">
        <img src={thor} alt="abyss"/>
        <div>
          <div className="char__info-name">thor</div>
          <div className="char__btns">
            <a href="#" className="button button__main">
                <div className="inner">homepage</div>
            </a>
            <a href="#" className="button button__secondary">
                <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">
        In Norse mythology, Loki is a god or jötunn (or both). Loki is the son of Fárbauti and Laufey, and the brother of Helblindi and Býleistr. By the jötunn Angrboða, Loki is the father of Hel, the wolf Fenrir, and the world serpent Jörmungandr. By Sigyn, Loki is the father of Nari and/or Narfi and with the stallion Svaðilfari as the father, Loki gave birth—in the form of a mare—to the eight-legged horse Sleipnir. In addition, Loki is referred to as the father of Váli in the Prose Edda.
      </div>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
        <li className="char__comics-item">
          All-Winners Squad: Band of Heroes (2011) #3
        </li>
        <li className="char__comics-item">
          Alpha Flight (1983) #50
        </li>
        <li className="char__comics-item">
          Amazing Spider-Man (1999) #503
        </li>
        <li className="char__comics-item">
          Amazing Spider-Man (1999) #504
        </li>
        <li className="char__comics-item">
          AMAZING SPIDER-MAN VOL. 7: BOOK OF EZEKIEL TPB (Trade Paperback)
        </li>
        <li className="char__comics-item">
          Amazing-Spider-Man: Worldwide Vol. 8 (Trade Paperback)
        </li>
        <li className="char__comics-item">
          Asgardians Of The Galaxy Vol. 2: War Of The Realms (Trade Paperback)
        </li>
        <li className="char__comics-item">
          Vengeance (2011) #4
        </li>
        <li className="char__comics-item">
          Avengers (1963) #1
        </li>
        <li className="char__comics-item">
          Avengers (1996) #1
        </li>
      </ul>
    </>
  )
}

export default CharInfo;