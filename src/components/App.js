import React, {Component} from 'react';
import {
    Text,
    View,
    Button,
    StyleSheet
} from 'react-native';

class App extends Component {
    constructor(props){
        super(props)
        this.state = {
            dataButton : [],
            display : null,
            sumClicked : 0,
            currentGame : null,
            time : 0,
        }
        this.interval = 'hai';  
    }

    timeInterval(){
        clearInterval(this.interval)
        this.interval = setInterval(() =>{
            this.setState(prevState => {
            let currentTime = prevState.time -1;
            if(currentTime == 0){
                clearInterval(this.interval);
                return prevState.currentGame !== 'win' ? {currentGame : 'lose',time : currentTime} : {currentGame : prevState.currentGame,time : currentTime}
            }
            return {time : currentTime}})
        },1000);
        return this.interval;
    }

    startGame(){
        let dataButton = [];

        for(let i = 0; i < 6; i++){
            dataButton.push({value : this.randomNumber(30,5) , disabled : false});
        }
        let displayNumber = 0;
        let choosenIndex = [];
        
        for(let i = 0 ; i < this.randomNumber(dataButton.length-3,2); i++ ){
            let number = this.randomNumber(dataButton.length);
            while(choosenIndex.indexOf(number) != -1){
                number = this.randomNumber(dataButton.length);
            }
            
            choosenIndex.push(number);
        }
        choosenIndex.map(x => displayNumber += dataButton[x].value)
        this.setState({dataButton : dataButton, display : displayNumber, time : 10, currentGame : null, sumClicked : 0});
    }

    componentDidMount(){
        this.timeInterval()
    }

    componentWillMount(){
        this.startGame();
    }
    
    randomNumber = (max, min = 0 ) =>{
        return Math.floor((Math.random() * (max - min)) + min);
    }

    render() {
        const handleClick = (data, index) => {
            //disable , append , check winner game
            this.setState(prevState => {
                const checkWinner = () =>{
                    if(prevState.display == (prevState.sumClicked + prevState.dataButton[index].value) && prevState.currentGame != 'lose'){
                        return true;
                    }
                    return false;
                }

                prevState.dataButton[index].clicked = true;

                return {
                    dataButton : prevState.dataButton, 
                    sumClicked : prevState.sumClicked + prevState.dataButton[index].value,
                    currentGame : checkWinner()? 'win' : prevState.currentGame
                }
            });
        }
        
        const renderButton = (min,max) => {
            if(!this.state.dataButton){
                return;
            }
            return this.state.dataButton.map((x, i) =>{
                if(i >= min && i <= max){
                    return <View key={i} style={{width : 50}}>
                        <Button 
                            title={x.value.toString()} 
                            onPress={() => handleClick(x, i)}
                            disabled={x.clicked ? x.clicked : false}
                            
                        />
                    </View>
                }
            });
        }

        const restartGame = () => {
            this.startGame();
            this.timeInterval();
        }

        return (
            <View style={styles.container}>
                <View style={[styles.headerBox, { alignItems : 'center'}]}>
                    <Text allowFontScaling style={{fontSize : 60 }}>{this.state.display}</Text>
                    <Text allowFontScaling style={{fontSize : 25 }}>{this.state.currentGame ? this.state.currentGame : this.state.time}</Text>
                </View>
                <View style={styles.board}>
                    <View style={{ flex : 1 , justifyContent:'space-around', alignItems:'center'}} >
                        {renderButton(3,6)}
                    </View>
                    <View style={{ flex : 1 , justifyContent:'space-around', alignItems:'center'}} >
                        {renderButton(0,2)}
                    </View>
                </View>
                <View style={styles.footer}>
                    {this.state.currentGame ? <Button title="restart" onPress={restartGame}/> : null}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
     flex: 1,
     paddingTop: 22,
    },
    headerBox : {
         flex: 0.2,   
    },
    board : {
        flex : 0.5,
        flexDirection : 'row',
        alignItems : 'stretch',
        justifyContent : 'space-around'
    },
    footer : {
        flex : 0.5,
        justifyContent : 'flex-end'
    }
});

export default App;