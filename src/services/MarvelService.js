// service - папка для работы с API
class MarvelService {
  // _apiBase - приватное свойство класса (по соглашению, свойства и методы, которые начинаются с _ считаются приватными)
  _apiBase = "https://marvel-server-zeta.vercel.app/";
  _apiKey = "d4eecb0c66dedbfae4eab45d312fc1df";
  getResource = async (url) => {
    let res = await fetch(url); // fetch - встроенная функция для работы с API
    // res - ответ от сервера, res.ok - если запрос успешен (статус 200-299)
    // res.status - статус ответа от сервера (например, 404 - не найдено)
    // await - ждет, пока промис (fetch) выполнится и вернет результат

    if (!res.ok) {
    // Если приходит true, то меняем на false и наоборот
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    // throw new Error - выбрасывает ошибку, если запрос не успешен
    }

    return await res.json();
    // res.json() - метод, который преобразует ответ в JSON-формат (т.е. в обычный объект JS)
  }

  // функция для получения всех персонажей
  getAllCharacters = async () => {
    // res - массив с результатами
    const res = await this.getResource(`${this._apiBase}characters?apikey=${this._apiKey}`);
    return res.data.results.map(this._transformCharacter);
    // res.data.results - массив с персонажами
    // map - метод массива, который создает новый массив, вызывая функцию для каждого элемента массива
    // this._transformCharacter - функция, которая трансформирует данные персонажа (ниже)
  }

    // функция для получения персонажа
    getCharacter = async (id) => {
    const res = await this.getResource(`${this._apiBase}characters/${id}?apikey=${this._apiKey}`); // ждем, пока промис выполнится и вернет результат
    return this._transformCharacter(res.data.results[0]); // возвращаем трансформированные данные персонажа
    // results[0] - первый элемент массива results, где хранятся данные персонажа
    // res.data - data - свойство объекта res, где хранятся данные с API
    // пример res: {data: {results: [{name: '...', description: '...', thumbnail: '...', homepage: '...', wiki: '...'}]}}
  }

  // функция для трансформации данных персонажа
  // _ для обозначения приватного метода
  _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
      thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url
    }
  }
}

export default MarvelService;