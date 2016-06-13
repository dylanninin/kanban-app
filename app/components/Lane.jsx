import React from 'react';
import uuid from 'uuid';
import connect from '../libs/connect';
import Notes from './Notes';
import NoteActions from '../actions/NoteActions';
import LaneActions from '../actions/LaneActions';

import LaneHeader from './LaneHeader';

const Lane = ({
    lane, notes, LaneActions, NoteActions, ...props
    }) => {

    const deleteNote = (noteId, e) => {
        /**
         *  1) App --- onDelete -> Notes --- onDelete.bind(null,id) ---> Note
         *
         *  2) Note --- onDelete(id, e) ---> Notes --- onDelete(id, e) ---> App
         */
        e.stopPropagation();

        NoteActions.delete(noteId);

        LaneActions.detachFromLane({
            laneId: lane.id,
            noteId
        });

    };

    const activateNoteEdit = (id) => {
        NoteActions.update({id, editing: true});
    };

    const editNote = (id, task) => {
        NoteActions.update({id, task, editing: false});
    };

    return (
        <div {...props}>
            <LaneHeader lane={lane}/>
            <Notes notes={selectNotesByIds(notes, lane.notes)}
                   onNoteClick={activateNoteEdit}
                   onEdit={editNote}
                   onDelete={deleteNote}
            />
        </div>
    );
};

function selectNotesByIds(allNotes, noteIds = []) {
    return noteIds.reduce((notes, id) =>
        notes.concat(
            allNotes.filter(note => note.id === id)
        )
        , []);
}

export default connect(
    ({notes}) => ({
        notes
    }), {
        NoteActions,
        LaneActions
    }
)(Lane)
