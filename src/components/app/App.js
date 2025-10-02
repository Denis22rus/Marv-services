import {Component} from 'react';
import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from "../errorBoundary/errorBoundary";

import decoration from '../../resources/img/vision.png';

class App extends Component {
	state = {
		// selectedChar будет хранить id персонажа
		selectedChar: null
	}

	// метод, который будет менять состояние selectedChar
	// поднимаем состояние вверх
	onCharSelected = (id) => {
		this.setState({
			// описываем свойство в state, чтобы потом устанавливать это свойство через аргумент
			selectedChar: id
		})
	}
	render(){
			return (
			<div className="app">
				<AppHeader/>
				<main>
					<ErrorBoundary>
						{/* // оборачиваем RandomChar в ErrorBoundary, чтобы отлавливать ошибки в RandomChar */}
						<RandomChar/>
					</ErrorBoundary>
					<div className="char__content">
						<ErrorBoundary>
							<CharList onCharSelected={this.onCharSelected}/>
						</ErrorBoundary>
						{/*// Мы берем id персонажа из charList и передаем его в CharInfo через onCharSelected для получения информации о персонаже
						 	// передаем в CharList метод onCharSelected через props
							// чтобы CharList мог менять состояние selectedChar в App */}
						<ErrorBoundary>
							<CharInfo charId={this.state.selectedChar}/>
						</ErrorBoundary>
					</div>
					<img className="bg-decoration" src={decoration} alt="vision"/>
				</main>
			</div>
		);
	}
}

export default App;