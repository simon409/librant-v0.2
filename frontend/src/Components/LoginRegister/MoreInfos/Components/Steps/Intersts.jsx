import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';






const Intersts = (props) => {
  const {selectedInterests, setSelectedInterests, setInterestsData} = props;
  const [interests, setInterests] = useState([
    { id: '1', label: 'Computer Programming', icon: '💻', preference: 0},
    { id: '2', label: 'Web Development', icon: '🌐', preference: 0 },
    { id: '3', label: 'Database Management', icon: '🗃️', preference: 0 },
    { id: '4', label: 'Network Security', icon: '🔒', preference: 0 },
    { id: '5', label: 'Business and Entrepreneurship', icon: '💼', preference: 0 },
    { id: '6', label: 'Project Management', icon: '📈', preference: 0 },
    { id: '7', label: 'Statistics and Data Analysis', icon: '📊', preference: 0 },
    { id: '8', label: 'Electronics', icon: '🔌', preference: 0 },
    { id: '9', label: 'Mathematics', icon: '➕', preference: 0 },
    { id: '10', label: 'Artificial Intelligence', icon: '🤖', preference: 0 },
  ]);
  const highestRef = 5;
  
  const handleInterestClick = (interest) => {
    const index = interests.findIndex((i) => i.id === interest.id);
    const updatedInterest = { ...interest, preference: highestRef - selectedInterests.length };
    const updatedInterests = [...interests];
    updatedInterests[index] = updatedInterest;
  
    setInterests(updatedInterests);
  
    if(highestRef - selectedInterests.length > 0)
    {
      var newSelectedInterests = [...selectedInterests];
      const selectedIndex = newSelectedInterests.findIndex((i) => i.id === interest.id);
      if (selectedIndex === -1) {
        // If the interest is not already selected, add it to the end of the list
        newSelectedInterests.push(updatedInterest);
      } else {
        // If the interest is already selected, update its preference and move it to the end of the list
        newSelectedInterests[selectedIndex] = updatedInterest;
        newSelectedInterests.push(newSelectedInterests.splice(selectedIndex, 1)[0]);
      }
    
      setSelectedInterests(newSelectedInterests);
      setInterestsData(updatedInterests);
    }
  };
  
  
  
  
  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const interestsCopy = Array.from(interests);
    const [reorderedInterest] = interestsCopy.splice(result.source.index, 1);
    interestsCopy.splice(result.destination.index, 0, reorderedInterest);

    // Update the interests order in Firebase Realtime Database here
  };

  return (
    <div className="min-h-fit mt-5 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-8">Select your interests - Maximum 5</h1>
      <div className="w-full p-6 rounded-lg bg-white">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="interests">
            {(provided) => (
              <ul
                className="grid grid-cols-2 gap-4"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {interests.map((interest, index) => (
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