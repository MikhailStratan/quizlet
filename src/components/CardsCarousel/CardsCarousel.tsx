import React, { FC, useEffect, useRef, useState } from 'react';
import Card from '../Card/Card';
import Button from '../UI/Button/Button';
import { getAllByWord } from '../../words-api/words-api';
import type { iWord } from '../../types/card.type';
import './CardsCarousel.scss';
import { iDictionary } from '../../types/dictionary.type';
import { iUser } from '../../types/user.type';
import { dictionaryService } from '../../services/dictionary/dictionary.service';

interface CardsCarouselProps {
    activeUser: iUser;
    dictionary: iDictionary;
    onCurrentWordChange: (data: any) => void;
    className?: string;
}

const CardsCarousel: FC<CardsCarouselProps> = ({activeUser, dictionary, onCurrentWordChange, className}) => {
    //todo: separate wordInfo data from this component, maybe create parent for both of them
    const [cards, setCards] = useState<iWord[]>([]);
    const [cardIndex, setCardIndex] = useState<number>(0);
    const [currentCard, setCurrentCard] = useState<iWord>();

    const prevBtn = useRef<HTMLElement>(null);
    const nextBtn = useRef<HTMLElement>(null);

    const slideLeft = () => {
        if (cardIndex <= 0) {
            setCurrentCard(cards[0]);
            return;
        }
        setCardIndex(cardIndex - 1);
        setCurrentCard(cards[cardIndex - 1]);
    };

    const slideRight = () => {
        if (cardIndex >= cards.length-1) {
            setCurrentCard(cards[cards.length-1]);
            return;
        }
        setCardIndex(cardIndex + 1);
        setCurrentCard(cards[cardIndex + 1]);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement> ) => {
        // console.log(event)
        event.preventDefault();
        if (event.code === 'ArrowRight') {
            slideRight();
        }
        if (event.code === 'ArrowLeft') {
            slideLeft();
        }
    }

    const fetchWordInfo = async (word: string) => {
        await getAllByWord(word).then(data => {
            onCurrentWordChange(data);
        });
    }

    useEffect(() => {
        (async () => {
            const words = await dictionaryService.getWordsFromDictionary(dictionary);
            setCards(words);
            setCurrentCard(words[0]);
            setCardIndex(0);
        })();
    },[dictionary])

    useEffect(() => {
        (async () => {
            if (currentCard) {
                await fetchWordInfo(currentCard.word);
            }
        })();
    }, [currentCard]);

    return (
        <>
            <div
                className={ `carousel${className ? '-'+className : ''}`}
                onKeyDown={ handleKeyDown }
                tabIndex={ 0 }
            >
                <div className="card-container">
                    { cards.map((card, index) => {
                        let position = (index > cardIndex)
                            ? "nextCard"
                            : (index === cardIndex)
                                ? "activeCard"
                                : 'prevCard';
                        if (position === 'activeCard') {
                            return <div key={ card.id }>
                                <Card { ...card } cardStyle={ position } key={ card.id }>
                                    <Button className="btn btn-prev" onClick={ slideLeft } ref={ prevBtn }>Previous</Button>
                                    <Button className="btn btn-next" onClick={ slideRight } ref={ nextBtn }>Next</Button>
                                </Card>
                            </div>
                        } else {
                            return <Card {...card} cardStyle={ position } key={ card.id }></Card>
                        }
                    })}
                </div>
            </div>
        </>
    );
}

export default CardsCarousel;
