import React from 'react';
import uuid from 'uuid';
import connect from '../libs/connect';
import Notes from './Notes';
import NoteActions from '../actions/NoteActions';

const Lane = ({
    lane, notes, NoteActions, ...props
    }) => {

    const addNote = e => {
        e.stopPropagation();

        NoteActions.create({
            id: uuid.v4(),
            task: 'New Task'
        });
    };

    const deleteNote = (id, e) => {
        /**
         *  1) App --- onDelete -> Notes --- onDelete.bind(null,id) ---> Note
         *
         *  2) Note --- onDelete(id, e) ---> Notes --- onDelete(id, e) ---> App
         */
        e.stopPropagation();

        NoteActions.delete(id);

    };

    const activateNoteEdit = (id) => {
        NoteActions.update({id, editing: true});
    };

    const editNote = (id, task) => {
        NoteActions.update({id, task, editing: false});
    };

    return (
        <div {...props}>
            <div className="lane-header">
                <div className="lane-add-note">
                    <button className="add-note" onClick={addNote}> +</button>
                </div>
                <div className="lane-name">{lane.name}</div>
            </div>
            <Notes notes={notes}
                   onNoteClick={activateNoteEdit}
                   onEdit={editNote}
                   onDelete={deleteNote}
            />
        </div>
    );
};

export default connect(
    ({notes}) => ({
        notes
    }), {
        NoteActions
    }
)(Lane)
