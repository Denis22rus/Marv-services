import {Component} from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

class CharList extends Component {
  // state - объект, который хранит данные компонента
  // когда сюда попадают данные?
  // когда вызывается метод onCharListLoaded
  state = {
    charList: [], // массив персонажей
    loading: true, // первичная загрузка
    error: false, // ошибка при загрузке
    newItemLoading: false, // загрузка новых персонажей при клике на кнопку "load more"
    offset: 0, // смещение для получения следующей порции персонажей (первые 20 элементов будут пропущены)
    charEnded: false // флаг, который показывает, что все персонажи загружены
  }

  // создает новый экземпляр класса MarvelService и записывает его в свойство marvelService
  // теперь мы можем использовать методы класса MarvelService через this.marvelService
  // метод getAllCharacters - асинхронный (возвращает промис) и внутри него используется await

  marvelService = new MarvelService();

  // * метод жизненного цикла компонента, который вызывается автоматически после первого рендера компонента
  // метод обновляет state
  componentDidMount() {
    this.onRequest(this.state.offset); // вызываем метод onRequest, чтобы загрузить первых 9 персонажей
  }

  // метод onRequest вызывается в componentDidMount после первого рендера и при клике на кнопку "load more"
  onRequest = (offset) => {
    this.onCharListLoading();
    this.marvelService.getAllCharacters(offset)
    // в offset сначала ничего не передается, поэтому используется значение по умолчанию из MarvelService.js
    // когда промис resolve, вызываем метод onCharListLoaded
    // данные в oncharListLoaded попадают через then
    .then(this.onCharListLoaded)
    .catch(this.onError)
  }

  // * функция, которая обновляет state при начале загрузки новых персонажей
  onCharListLoading = () => {
    this.setState({
      newItemLoading: true
    })
  }

    // * функция, которая обновляет state при успешном получении данных
    // * круглые скобки (=> {()}) нужны, чтобы вернуть объект из стрелочной функции Внутрь setState, т.к. новое состояние зависит от предыдущего состояния
  onCharListLoaded = (newCharList) => {
    //? 1
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }
    // Сначала появляются новые карточки, и сразу после этого кнопка пропадает, если новых карточек было меньше 9.

    // charlist - это деструктуризация, вынимаем charList из объекта state свойство charList и создаем локальную переменную charList
    // Если написать ({charList, loading}), то получил бы две переменные: charList = state.charList, loading = state.loading.
    // Если написать ({aaa}), а в state нет свойства aaa, то переменная aaa будет undefined.
    this.setState(({offset, charList}) => ({
      //? 2
      charList: [...charList, ...newCharList],
      // Если мы запускаем первый раз метод onCharListLoaded, то charList - это пустой массив из state
      // Когда мы кликаем на кнопку "load more", то в charList уже есть персонажи, и мы добавляем к ним новых персонажей из newCharList
      // newCharList получает новые данные из метода onReques, из этих новых данных мы создаем новый массив, в который сначала распыляем старый массив charList, а потом добавляем новые данные из newCharList
      // 1 старые элементы, 2 новые элементы и складываем все это в charList и далее он пойдет на формирование верстки
      loading: false,
      newItemLoading: false, // когда новые персонажи загрузились, меняем newItemLoading на false
      offset: offset + 9, // увеличиваем offset на 9, чтобы при следующем запросе пропустить уже загруженных персонажей (т.к. мы загружаем по 9 персонажей за раз)
      //? 3
      charEnded: ended // если новых персонажей меньше 9, то все персонажи загружены и кнопка "load more" больше не нужна
    }))
  }

  // * функция, которая обновляет state при ошибке
  // новое состояние не зависит от предыдущего, поэтому передаем объект а не функцию в setState
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
  const {charList, loading, error, offset, newItemLoading, charEnded} = this.state;

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
          <button
          // при клике на кнопку вызываем метод onRequest, в который передаем текущее смещение offset из state
            className="button button__main button__long"
            disabled={newItemLoading} // Кнопка будет заблокирована, когда идёт загрузка новых персонажей
            style={{'display': charEnded ? 'none' : 'block'}} // если все персонажи загружены, то кнопка не отображается
            onClick={() => this.onRequest(offset)} // при клике на кнопку вызываем метод onRequest, в который передаем текущее смещение offset из state
          >
              <div className="inner">load more</div>
          </button>
      </div>
    )
  }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;