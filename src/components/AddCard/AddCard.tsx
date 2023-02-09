import React, { FC, useState } from 'react';
import { v4 as uuid } from 'uuid';
import Button from '../UI/Button/Button';
// import { addCardToDictionary } from '../../firebase/handlers/addCardToDictionary';
import './AddCard.scss';
import { iDictionary } from '../../types/dictionary.type';
import { dictionaryService } from '../../services/dictionary/dictionary.service';
import { iUser } from '../../types/user.type';

interface FormElements extends HTMLFormControlsCollection {
    word: HTMLInputElement;
    translation: HTMLInputElement;
}
interface AddCardFormElement extends HTMLFormElement {
    readonly elements: FormElements;
}

interface AddCardProps {
    activeUser: iUser;
    dictionary: iDictionary;
}

const AddCard: FC<AddCardProps> = ({ activeUser, dictionary}) => {
    const [error, setError] = useState('');

    const handleSubmit = async (event: React.FormEvent<AddCardFormElement>) => {
        event.preventDefault();
        let { word, translation } = event.currentTarget;

        try {
            const response = await dictionaryService.addWordToDictionary(activeUser, dictionary, {
                word: word.value.trim(),
                translation: translation.value.trim(),
                id: uuid()
            });

            word.value = '';
            translation.value = '';
            setError('');

            response && setError(response);
        } catch (error) {
            console.log(error)
            setError(`${error}`)
        }
    }

    return(
        <form onSubmit={ handleSubmit }>
            {error && <div id="error" className="error">{error}</div>}
            <label htmlFor="word">Enter English word:</label>
            <input id="word" type="text" />
            <label htmlFor="translation">Enter translation:</label>
            <input id="translation" type="text" />
            <Button>Add</Button>
        </form>
    );
}

export default AddCard;
