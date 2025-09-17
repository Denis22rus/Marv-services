import {Component} from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

class CharList extends Component {
  // state - объект, который хранит данные компонента
  // когда сюда попадают данные?
  // когда вызывается метод onCharListLoaded
  state = {
    charList: [],
    loading: true,
    error: false
  }

  // новое свойство класса CharList
  marvelService = new MarvelService();

  // * метод жизненного цикла компонента, который вызывается автоматически после первого рендера компонента
  // метод обновляет state
  componentDidMount() {
    this.marvelService.getAllCharacters()
    // когда промис resolve, вызываем метод onCharListLoaded
    // данные в oncharListLoaded попадают через then?
      .then(this.onCharListLoaded)
      .catch(this.onError)
  }

  // * функция, которая обновляет state при успешном получении данных
  onCharListLoaded = (charList) => {
    this.setState({
      // в charList попадает массив с персонажами
      // синтаксис {charList} - сокращенная запись {charList: charList}, где первый charList - имя свойства, а второй charList - значение свойства (параметр функции)
      charList,
      loading: false
    })
  }

  // * функция, которая обновляет state при ошибке
  onError = () => {
    this.setState({
      error: true,
      loading: false
    })
  }

  // Этот метод создан для оптимизации,
  // чтобы не помещать такую конструкцию в метод render
  renderItems(arr) {
    const items =  arr.map((item) => {
      let imgStyle = {'objectFit' : 'cover'};
      // Если у персонажа нет картинки, то меняем стиль картинки
      if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'unset'};
      }

      // возвращаем разметку для каждого элемента массива
      return (
        <li
          className="char__item"
          key={item.id}
          // Вызываем метод onCharSelected при клике на элемент списка, который передает результат в App.js через props (поднимаем состояние вверх)
          onClick={() => this.props.onCharSelected(item.id)}>
          {/* props - это способ передачи данных от родительского компонента к дочернему
          в нем передаем item.id в метод onCharSelected */}
            <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
            <div className="char__name">{item.name}</div>
        </li>
      )
  });

  // А эта конструкция вынесена для центровки спиннера/ошибки
  // чтобы не было проблемы с версткой при появлении спиннера/ошибки
  // (т.к. ul - это flex-контейнер, и если в нем нет li, то он сжимается)
  return (
      <ul className="char__grid">
        {items}
      </ul>
    )
  }

  render() {

  // деструктуризация state
  const {charList, loading, error} = this.state;

  // вызываем метод renderItems и передаем в него массив charList из state
  const items = this.renderItems(charList);

  const errorMessage = error ? <ErrorMessage/> : null;
  const spinner = loading ? <Spinner/> : null;
  const content = !(loading || error) ? items : null;

  return (
      <div className="char__list">
          {errorMessage}
          {spinner}
          {content}
          <button className="button button__main button__long">
              <div className="inner">load more</div>
          </button>
      </div>
    )
  }
}

export default CharList;