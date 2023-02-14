import './App.css'
import Menu from './components/Menu/Menu';
import CardsCarousel from './components/CardsCarousel/CardsCarousel';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AddCard from './components/AddCard/AddCard';
import React, { FC, useEffect, useState } from 'react';
import DictionaryList from './components/DictionaryList/DictionaryList';
import WordInfo from './components/WordInfo/WordInfo';
import { iWordInfo } from './types/word-info.type';
import { iDictionary } from './types/dictionary.type';
import { iUser } from './types/user.type';
import { dictionaryService } from './services/dictionary/dictionary.service';

type AppProps = {
    user: iUser;
}

const App: FC<AppProps> = ({user}) => {
    const menu = [ 'Home', 'Learn', 'Add New Words' ];
    const [activeUser, setActiveUser] = useState<iUser>();
    const [dictionaries, setDictionaries] = useState<iDictionary[]>([]);

    const [activeDictionary, setActiveDictionary] = useState<iDictionary>();
    const [wordInfo, setWordInfo] = useState<iWordInfo>();
    const [showWordInfo, setShowWordInfo] = useState<boolean>(false);

    const onSelectActiveDictionary = (dictionary: iDictionary) => {
        console.log(dictionary.name)
        setActiveDictionary(dictionary);
    };

    function onCurrentWordChange(wordData: iWordInfo) {
        if (wordData) {
            setWordInfo(wordData);
        }
    }

    function isWordInfoShown(wordInfoShowState: boolean) {
        setShowWordInfo(wordInfoShowState);
    }

    useEffect(() => {
        setActiveUser(user);
        (async () => {
            const subscription = await dictionaryService.subscribeToDictionaries(setDictionaries);
            // subscription();
        })();

        setActiveDictionary(user.dictionaries[0]);

    },[])

    return (
        <div className="App">
            <Router>
                <Menu menuOptions={ menu }></Menu>
                <Routes>
                    <Route path="/" element={ <div style={{ fontSize: '100px' }}>Welcome to Quizlet!</div> } />
                    <Route path="/home" element={ <div style={{ fontSize: '100px' }}>Welcome to Quizlet!</div> } />
                    <Route path="/learn" element={
                        activeDictionary && activeUser
                            ? <>
                                <DictionaryList onDictionarySelect={ onSelectActiveDictionary } currentUser={ activeUser } dictionaries={ dictionaries }/>
                                <CardsCarousel
                                    activeUser={ activeUser }
                                    dictionary={ activeDictionary }
                                    onCurrentWordChange={ onCurrentWordChange }
                                    className={ showWordInfo ? 'word-info-shown' : '' }
                                />
                                { wordInfo ? <WordInfo
                                    wordInfo={ wordInfo } // todo: subscription for words to receive updates?
                                    isShowWordInfo={showWordInfo}
                                    onShowWordInfoChange={ isWordInfoShown }
                                ></WordInfo> : null }
                            </>
                            : null
                    }/>
                    <Route path="/add-new-words" element={
                        activeDictionary && activeUser
                            ? <>
                                <DictionaryList onDictionarySelect={ onSelectActiveDictionary } currentUser={ activeUser } dictionaries={ dictionaries }/>
                                <AddCard activeUser={ activeUser } dictionary={ activeDictionary } />
                            </>
                            : null
                    }/>
                </Routes>
            </Router>
        </div>
    );
}

export default App
