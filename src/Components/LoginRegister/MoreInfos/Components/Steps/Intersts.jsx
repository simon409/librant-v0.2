import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const interestsData = [
  { id: '1', label: 'Drama', icon: '🎭' },
  { id: '2', label: 'Romance', icon: '💕' },
  { id: '3', label: 'Horror', icon: '👻' },
  { id: '4', label: 'Comedy', icon: '😂' },
  { id: '5', label: 'Action', icon: '💥' },
  { id: '6', label: 'Sci-fi', icon: '👽' },
  { id: '7', label: 'Mystery', icon: '🔍' },
  { id: '8', label: 'Fantasy', icon: '🧚' },
];

const Intersts = (props) => {

  const {selectedInterests, setSelectedInterests} = props;

  const handleInterestClick = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
      
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const interestsCopy = Array.from(interestsData);
    const [reorderedInterest] = interestsCopy.splice(result.source.index, 1);
    interestsCopy.splice(result.destination.index, 0, reorderedInterest);

    // Update the interests order in Firebase Realtime Database here
  };

  return (
    <div className="min-h-fit mt-5 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-8">Select your interests</h1>
      <div className="w-full p-6 rounded-lg bg-white">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="interests">
            {(provided) => (
              <ul
                className="grid grid-cols-2 gap-4"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {interestsData.map((interest, index) => (
                  <Draggable key={interest.id} draggableId={interest.id} index={index}>
                    {(provided) => (
                      <li
                        className={`py-4 px-4 sm:px-6 flex items-center ${
                          selectedInterests.includes(interest) ? 'bg-gray-100' : ''
                        }`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <span className="mr-4 text-3xl">{interest.icon}</span>
                        <button
                          className="flex-1 text-left"
                          onClick={() => handleInterestClick(interest)}
                        >
                          <h2 className="text-lg font-bold">{interest.label}</h2>
                          <p className="text-gray-600">{`#${interest.label.toLowerCase()}`}</p>
                        </button>
                        <span className="ml-4 text-gray-400">{index + 1}</span>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Intersts;